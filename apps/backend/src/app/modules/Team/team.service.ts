import ApiError from "../../errors/ApiError";
import prisma, { Prisma } from "../../shared/prisma";
import { USER_ROLES } from "../Auth/auth.constant";

// TeamSettings is a virtual aggregate stored as JSON in a single column on a sentinel User row
// of the requesting team_lead. In Phase 5 we don't have a dedicated Team model — the team is the
// set of users in the same organization. We store settings on the requesting team_lead's
// UserPreference-like record.
//
// Strategy: We will use the existing `UserPreference` table's `metadata` JSON field for
// per-user (team_lead) settings overrides. For org-wide defaults we store in a singleton
// `metadata` JSON on the most-recently-active team_lead. This is simple and avoids a new model.
//
// For consistency we read settings as the most recently active team_lead (or the caller) row.

type TeamSettingsPayload = {
  general?: {
    name?: string;
    description?: string;
    visibility?: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
    defaultRole?: string;
    timezone?: string;
    language?: string;
  };
  permissions?: {
    canMembersInvite?: boolean;
    canMembersCreateCollections?: boolean;
    canMembersShareExternally?: boolean;
    canMembersAccessAI?: boolean;
    canMembersExportData?: boolean;
    canMembersDeletePapers?: boolean;
    requireApprovalForPapers?: boolean;
    requireApprovalForCollections?: boolean;
  };
  notifications?: {
    newMemberJoins?: boolean;
    paperUploaded?: boolean;
    collectionCreated?: boolean;
    weeklyDigest?: boolean;
    activityAlerts?: boolean;
    mentionNotifications?: boolean;
  };
  security?: {
    enforce2FA?: boolean;
    sessionTimeout?: number;
    allowedDomains?: string[];
    passwordPolicy?: "basic" | "strong" | "enterprise";
  };
  integrations?: {
    slackWebhook?: string;
    discordWebhook?: string;
    customWebhook?: string;
  };
};

const DEFAULT_SETTINGS: TeamSettingsPayload = {
  general: {
    name: "My Team",
    description: "",
    visibility: "INVITE_ONLY",
    defaultRole: "RESEARCHER",
    timezone: "UTC",
    language: "en",
  },
  permissions: {
    canMembersInvite: false,
    canMembersCreateCollections: true,
    canMembersShareExternally: false,
    canMembersAccessAI: true,
    canMembersExportData: true,
    canMembersDeletePapers: false,
    requireApprovalForPapers: false,
    requireApprovalForCollections: false,
  },
  notifications: {
    newMemberJoins: true,
    paperUploaded: true,
    collectionCreated: true,
    weeklyDigest: true,
    activityAlerts: false,
    mentionNotifications: true,
  },
  security: {
    enforce2FA: false,
    sessionTimeout: 24,
    allowedDomains: [],
    passwordPolicy: "strong",
  },
  integrations: {
    slackWebhook: "",
    discordWebhook: "",
    customWebhook: "",
  },
};

export class TeamService {
  // -------------------------------------------------------------------------
  // Members
  // -------------------------------------------------------------------------

  /**
   * List team members.
   *
   * "Team" in Phase 5 = the set of users that the requesting team_lead / admin can manage.
   * Since the platform has no org model yet, this returns users that share at least one
   * workspace membership with the requester (excluding soft-deleted users).
   */
  static async listMembers(
    userId: string,
    limit: number,
    cursor: string | undefined,
    filters: {
      search?: string;
      role?: string;
      status?: string;
    }
  ) {
    const take = limit + 1;
    const where: Prisma.UserWhereInput = { isDeleted: false };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.role) {
      where.role = filters.role as any;
    }

    // Pagination: simple cursor on createdAt
    if (cursor) {
      const cursorUser = await prisma.user.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cursorUser) {
        where.createdAt = { lt: cursorUser.createdAt };
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          memberships: {
            where: { isDeleted: false },
            select: {
              role: true,
              workspace: {
                select: { id: true, name: true, color: true },
              },
            },
            take: 10,
          },
          _count: {
            select: {
              memberships: { where: { isDeleted: false } },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const hasMore = users.length > limit;
    const sliced = hasMore ? users.slice(0, -1) : users;

    const formatted = sliced.map((u) => ({
      id: u.id,
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
      email: u.email,
      image: u.image,
      role: u.role,
      joinedAt: u.createdAt,
      lastActive: u.createdAt, // approximate; updatedAt is closer but we use createdAt for now
      status: "active" as const, // status derivation is best-effort; we have no lastActiveAt field
      workspaces: u.memberships.map((wm) => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        role: wm.role,
      })),
      workspaceCount: u._count.memberships,
    }));

    return {
      result: formatted,
      meta: { total, limit, hasMore, nextCursor: hasMore ? sliced[sliced.length - 1].id : null },
    };
  }

  /**
   * Get a single team member by ID.
   */
  static async getMember(userId: string, targetUserId: string) {
    const user = await prisma.user.findFirst({
      where: { id: targetUserId, isDeleted: false },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        memberships: {
          where: { isDeleted: false },
          select: {
            role: true,
            joinedAt: true,
            workspace: { select: { id: true, name: true, color: true } },
          },
        },
        _count: {
          select: {
            memberships: { where: { isDeleted: false } },
          },
        },
      },
    });

    if (!user) throw new ApiError(404, "Team member not found");
    return user;
  }

  /**
   * Update a team member's role. Only TEAM_LEAD+ can do this.
   */
  static async updateMember(
    requestorId: string,
    targetUserId: string,
    data: { role?: string }
  ) {
    if (data.role) {
      const validRoles = Object.values(USER_ROLES);
      if (!validRoles.includes(data.role as any)) {
        throw new ApiError(400, "Invalid role");
      }
      await prisma.user.update({
        where: { id: targetUserId },
        data: { role: data.role as any },
      });
    }
    return { success: true };
  }

  /**
   * Remove a team member (soft-delete). Only ADMIN can do this in Phase 5.
   * The user's data is preserved (isDeleted=true); they can no longer sign in.
   */
  static async removeMember(requestorId: string, targetUserId: string) {
    if (requestorId === targetUserId) {
      throw new ApiError(400, "You cannot remove yourself");
    }
    await prisma.user.update({
      where: { id: targetUserId },
      data: { isDeleted: true },
    });
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // Team Activity
  // -------------------------------------------------------------------------

  /**
   * Get aggregated activity feed for the team.
   * Returns ActivityLogEntry rows where:
   *   - the actor (userId) is in workspaces accessible by the requestor, OR
   *   - the workspace is one of the requestor's workspaces
   * Includes the "team" entity events (no workspaceId) authored by the requestor.
   */
  static async getActivity(
    userId: string,
    limit: number,
    cursor: string | undefined,
    filters: {
      entity?: string;
      memberId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const take = limit + 1;
    const where: Prisma.ActivityLogEntryWhereInput = { isDeleted: false };

    if (filters.entity) where.entity = filters.entity;
    if (filters.memberId) where.userId = filters.memberId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    // Scope: any activity from workspaces the user is in, or authored by the user
    const userWorkspaces = await prisma.workspace.findMany({
      where: {
        isDeleted: false,
        OR: [
          { ownerId: userId },
          { members: { some: { userId, isDeleted: false } } },
        ],
      },
      select: { id: true },
    });
    const workspaceIds = userWorkspaces.map((w) => w.id);

    where.OR = [
      { workspaceId: { in: workspaceIds } },
      { userId },
    ];

    if (cursor) {
      const cursorEntry = await prisma.activityLogEntry.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cursorEntry) {
        where.createdAt = { ...(where.createdAt as object), lt: cursorEntry.createdAt };
      }
    }

    const entries = await prisma.activityLogEntry.findMany({
      where,
      take,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            role: true,
          },
        },
        workspace: { select: { id: true, name: true } },
      },
    });

    const hasMore = entries.length > limit;
    const sliced = hasMore ? entries.slice(0, -1) : entries;

    return {
      result: sliced,
      meta: {
        limit,
        hasMore,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
      },
    };
  }

  /**
   * Get team activity summary (counts by entity, by severity, total, recent, trends).
   */
  static async getActivitySummary(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userWorkspaces = await prisma.workspace.findMany({
      where: {
        isDeleted: false,
        OR: [
          { ownerId: userId },
          { members: { some: { userId, isDeleted: false } } },
        ],
      },
      select: { id: true },
    });
    const workspaceIds = userWorkspaces.map((w) => w.id);

    const baseWhere: Prisma.ActivityLogEntryWhereInput = {
      isDeleted: false,
      createdAt: { gte: startDate },
      OR: [{ workspaceId: { in: workspaceIds } }, { userId }],
    };

    const [
      totalActivities,
      byTypeGroups,
      bySeverityGroups,
      recentActivities,
    ] = await Promise.all([
      prisma.activityLogEntry.count({ where: baseWhere }),
      prisma.activityLogEntry.groupBy({
        by: ["entity"],
        where: baseWhere,
        _count: { entity: true },
      }),
      prisma.activityLogEntry.groupBy({
        by: ["severity"],
        where: baseWhere,
        _count: { severity: true },
      }),
      prisma.activityLogEntry.findMany({
        where: baseWhere,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              image: true,
              role: true,
            },
          },
          workspace: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      totalActivities,
      activitiesByType: byTypeGroups.reduce<Record<string, number>>((acc, g) => {
        acc[g.entity] = g._count.entity;
        return acc;
      }, {}),
      activitiesBySeverity: bySeverityGroups.reduce<Record<string, number>>(
        (acc, g) => {
          acc[g.severity] = g._count.severity;
          return acc;
        },
        {}
      ),
      recentActivities,
      days,
    };
  }

  /**
   * Get team-wide stats: total members, active, pending (invitations), inactive,
   * total papers, total collections.
   */
  static async getStats(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalMembers,
      pendingInvitations,
      totalPapers,
      totalCollections,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.workspaceInvitation.count({
        where: { isDeleted: false, status: "PENDING" },
      }),
      prisma.paper.count({ where: { isDeleted: false } }),
      prisma.collection.count({ where: { isDeleted: false } }),
      prisma.activityLogEntry.count({
        where: { isDeleted: false, createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    // "Active" / "inactive" approximations: we don't have lastActiveAt, so we use
    // createdAt as a rough proxy. Recently created users are "invited/active";
    // older users are "inactive" only if they have no recent activity log entries.
    const usersWithActivity = await prisma.user.findMany({
      where: { isDeleted: false },
      select: { id: true, createdAt: true },
    });
    const activeUserIds = new Set(
      (
        await prisma.activityLogEntry.findMany({
          where: { isDeleted: false, createdAt: { gte: sevenDaysAgo } },
          select: { userId: true },
          distinct: ["userId"],
        })
      )
        .map((r) => r.userId)
        .filter((id): id is string => !!id)
    );

    let activeMembers = 0;
    let inactiveMembers = 0;
    for (const u of usersWithActivity) {
      if (activeUserIds.has(u.id)) activeMembers++;
      else if (u.createdAt < sevenDaysAgo) inactiveMembers++;
    }

    // Activity score (simple heuristic: log-scaled recent activity)
    const activityScore = Math.min(100, Math.round(50 + Math.log10(recentActivity + 1) * 12));

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      pendingInvitations,
      totalPapers,
      totalCollections,
      activityScore,
      recentActivityCount: recentActivity,
    };
  }

  // -------------------------------------------------------------------------
  // Team Invitations
  // -------------------------------------------------------------------------

  /**
   * Send a team invitation by email. Reuses WorkspaceInvitation table
   * with `workspaceId` set to a placeholder "team" workspace or with NULL
   * handled via the recipient's first shared workspace.
   *
   * For Phase 5 simplicity: a "team invitation" is a pending workspace invitation
   * in any workspace owned by the inviter. We auto-pick the first owned workspace
   * (or create a stub team workspace) and create a pending invitation.
   *
   * Alternative: store in a separate table. For now, we use workspace invitations
   * and tag the role with a special marker — the front-end will treat them as
   * "team-level" by absence of an explicit per-workspace link in the UI.
   */
  static async inviteMember(
    inviterId: string,
    payload: { email: string; role?: string; message?: string }
  ) {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: payload.email, isDeleted: false },
      select: { id: true, email: true, name: true, firstName: true, lastName: true },
    });
    if (!user) {
      throw new ApiError(404, "No registered user with this email");
    }
    if (user.id === inviterId) {
      throw new ApiError(400, "You cannot invite yourself");
    }

    // Check if already a member of any of the inviter's workspaces
    const inviterWorkspaces = await prisma.workspace.findMany({
      where: { isDeleted: false, ownerId: inviterId },
      select: { id: true },
    });

    if (inviterWorkspaces.length === 0) {
      throw new ApiError(
        400,
        "You must own at least one workspace before inviting team members"
      );
    }

    // Find an existing shared membership
    const existingMembership = await prisma.workspaceMember.findFirst({
      where: {
        userId: user.id,
        workspaceId: { in: inviterWorkspaces.map((w) => w.id) },
        isDeleted: false,
      },
    });
    if (existingMembership) {
      throw new ApiError(400, "User is already a member of one of your workspaces");
    }

    // Reuse first owned workspace for the invitation record
    const targetWorkspaceId = inviterWorkspaces[0].id;

    // Upsert invitation
    const invitation = await prisma.workspaceInvitation.upsert({
      where: { workspaceId_userId: { workspaceId: targetWorkspaceId, userId: user.id } },
      create: {
        workspaceId: targetWorkspaceId,
        userId: user.id,
        role: (payload.role as any) || "RESEARCHER",
        invitedById: inviterId,
        status: "PENDING",
        invitedAt: new Date(),
      },
      update: {
        role: (payload.role as any) || "RESEARCHER",
        invitedById: inviterId,
        status: "PENDING",
        invitedAt: new Date(),
        acceptedAt: null,
        declinedAt: null,
        isDeleted: false,
      },
    });

    // Try to send email (non-blocking — failure doesn't break the API)
    try {
      const { default: emailService } = await import("../../shared/emailService");
      const inviter = await prisma.user.findUnique({
        where: { id: inviterId },
        select: { name: true, firstName: true, lastName: true, email: true },
      });
      await emailService.sendTeamInvitationEmail({
        email: user.email,
        name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        teamName: inviter?.name || "ScholarFlow Team",
        inviterName:
          inviter?.name ||
          `${inviter?.firstName || ""} ${inviter?.lastName || ""}`.trim() ||
          inviter?.email ||
          "A team lead",
        role: invitation.role,
        message: payload.message,
        invitationId: invitation.id,
      });
    } catch (err) {
      // Swallow email errors — invitation is created
      if (process.env.NODE_ENV !== "production") {
        console.error("Team invitation email failed:", (err as any)?.message || err);
      }
    }

    return { invitationId: invitation.id };
  }

  /**
   * Cancel (soft-delete) a pending team invitation.
   */
  static async cancelInvitation(inviterId: string, invitationId: string) {
    const invite = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });
    if (!invite) throw new ApiError(404, "Invitation not found");
    if (invite.invitedById !== inviterId) {
      throw new ApiError(403, "You can only cancel invitations you sent");
    }
    await prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: { isDeleted: true, status: "DECLINED" },
    });
    return { success: true };
  }

  /**
   * Resend a pending invitation (re-sends the email; resets the invitedAt timestamp).
   */
  static async resendInvitation(inviterId: string, invitationId: string) {
    const invite = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });
    if (!invite) throw new ApiError(404, "Invitation not found");
    if (invite.invitedById !== inviterId) {
      throw new ApiError(403, "You can only resend invitations you sent");
    }
    if (invite.status !== "PENDING") {
      throw new ApiError(400, "Only pending invitations can be resent");
    }
    await prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: { invitedAt: new Date() },
    });
    // Re-send email
    try {
      const { default: emailService } = await import("../../shared/emailService");
      const [inviter, invitee, workspace] = await Promise.all([
        prisma.user.findUnique({ where: { id: inviterId }, select: { name: true, email: true } }),
        prisma.user.findUnique({ where: { id: invite.userId }, select: { email: true, name: true, firstName: true, lastName: true } }),
        prisma.workspace.findUnique({ where: { id: invite.workspaceId }, select: { name: true } }),
      ]);
      if (invitee && inviter && workspace) {
        await emailService.sendTeamInvitationEmail({
          email: invitee.email,
          name: invitee.name || `${invitee.firstName || ""} ${invitee.lastName || ""}`.trim() || invitee.email,
          teamName: workspace.name,
          inviterName: inviter.name || inviter.email,
          role: invite.role,
          invitationId: invite.id,
        });
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Resend team invitation email failed:", (err as any)?.message || err);
      }
    }
    return { success: true };
  }

  /**
   * List team invitations sent by the requester.
   */
  static async listSentInvitations(inviterId: string, limit: number, skip: number) {
    const [invitations, total] = await Promise.all([
      prisma.workspaceInvitation.findMany({
        where: { invitedById: inviterId, isDeleted: false },
        take: limit,
        skip,
        orderBy: { invitedAt: "desc" },
        include: {
          user: { select: { id: true, name: true, firstName: true, lastName: true, email: true, image: true } },
          workspace: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.workspaceInvitation.count({ where: { invitedById: inviterId, isDeleted: false } }),
    ]);

    return {
      result: invitations.map((i) => ({
        ...i,
        inviteeName: i.user.name || `${i.user.firstName || ""} ${i.user.lastName || ""}`.trim() || i.user.email,
        inviteeEmail: i.user.email,
        inviteeImage: i.user.image,
      })),
      meta: { total, totalPage: Math.ceil(total / limit) },
    };
  }

  /**
   * List team invitations received by the requester.
   */
  static async listReceivedInvitations(userId: string, limit: number, skip: number) {
    const [invitations, total] = await Promise.all([
      prisma.workspaceInvitation.findMany({
        where: { userId, isDeleted: false },
        take: limit,
        skip,
        orderBy: { invitedAt: "desc" },
        include: {
          invitedBy: { select: { id: true, name: true, firstName: true, lastName: true, email: true, image: true } },
          workspace: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.workspaceInvitation.count({ where: { userId, isDeleted: false } }),
    ]);

    return {
      result: invitations.map((i) => ({
        ...i,
        inviterName: i.invitedBy?.name || `${i.invitedBy?.firstName || ""} ${i.invitedBy?.lastName || ""}`.trim() || i.invitedBy?.email || "Unknown",
        inviterEmail: i.invitedBy?.email,
        inviterImage: i.invitedBy?.image,
      })),
      meta: { total, totalPage: Math.ceil(total / limit) },
    };
  }

  // -------------------------------------------------------------------------
  // Team Settings
  // -------------------------------------------------------------------------

  /**
   * Get team settings. Stored in the requesting user's UserPreference.metadata
   * under key "teamSettings". Falls back to defaults.
   */
  static async getSettings(userId: string): Promise<TeamSettingsPayload> {
    const pref = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    const meta = (pref?.metadata as Record<string, any>) || {};
    const stored = (meta.teamSettings as TeamSettingsPayload) || {};
    return this._mergeSettings(stored);
  }

  /**
   * Update team settings (deep-merge with existing).
   */
  static async updateSettings(
    userId: string,
    patch: TeamSettingsPayload
  ): Promise<TeamSettingsPayload> {
    const current = await this.getSettings(userId);
    const merged = this._deepMergeSettings(current, patch);

    const pref = await prisma.userPreference.findUnique({
      where: { userId },
      select: { metadata: true },
    });
    const meta = (pref?.metadata as Record<string, any>) || {};
    meta.teamSettings = merged;

    await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        metadata: meta,
      },
      update: {
        metadata: meta,
      },
    });

    return merged;
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private static _mergeSettings(stored: TeamSettingsPayload): TeamSettingsPayload {
    return {
      general: { ...DEFAULT_SETTINGS.general, ...stored.general },
      permissions: { ...DEFAULT_SETTINGS.permissions, ...stored.permissions },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...stored.notifications },
      security: {
        ...DEFAULT_SETTINGS.security,
        ...stored.security,
        allowedDomains: stored.security?.allowedDomains || DEFAULT_SETTINGS.security!.allowedDomains,
      },
      integrations: { ...DEFAULT_SETTINGS.integrations, ...stored.integrations },
    };
  }

  private static _deepMergeSettings(
    base: TeamSettingsPayload,
    patch: TeamSettingsPayload
  ): TeamSettingsPayload {
    return {
      general: { ...base.general, ...patch.general },
      permissions: { ...base.permissions, ...patch.permissions },
      notifications: { ...base.notifications, ...patch.notifications },
      security: { ...base.security, ...patch.security },
      integrations: { ...base.integrations, ...patch.integrations },
    };
  }
}

