import express from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  collectionMutationLimiter,
  rateLimiter,
} from "../../middleware/rateLimiter";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "../../middleware/validateRequest";
import { collectionController } from "./collection.controller";
import {
  addPaperToCollectionSchema,
  collectionIdParamsSchema,
  collectionMemberParamsSchema,
  collectionParamsSchema,
  createCollectionSchema,
  inviteMemberSchema,
  listQuerySchema,
  paperCollectionParamsSchema,
  updateCollectionPaperSchema,
  updateCollectionSchema,
} from "./collection.validation";

export const collectionRoutes: express.Router = express.Router();

// Create a new collection
collectionRoutes.post(
  "/",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestBody(createCollectionSchema) as any,
  collectionController.create as any
);

// Get user's collections
collectionRoutes.get(
  "/my",
  rateLimiter,
  authMiddleware as any,
  validateRequestQuery(listQuerySchema) as any,
  collectionController.getMyCollections as any
);

// Get public collections
collectionRoutes.get(
  "/public",
  rateLimiter,
  collectionController.getPublicCollections as any
);

// Search collections (auth required — scoped to accessible collections)
collectionRoutes.get(
  "/search",
  rateLimiter,
  authMiddleware as any,
  collectionController.search as any
);

// Get collections shared with the authenticated user (accepted or pending)
collectionRoutes.get(
  "/shared",
  rateLimiter,
  authMiddleware as any,
  collectionController.getSharedCollections as any
);

// List invites sent by the authenticated user
collectionRoutes.get(
  "/invites/sent",
  rateLimiter,
  authMiddleware as any,
  collectionController.getInvitesSent as any
);

// List invites received by the authenticated user
collectionRoutes.get(
  "/invites/received",
  rateLimiter,
  authMiddleware as any,
  collectionController.getInvitesReceived as any
);

// Get collection statistics (auth required — scoped to the user's collections)
collectionRoutes.get(
  "/stats",
  rateLimiter,
  authMiddleware as any,
  collectionController.getStats as any
);

// Get a specific collection
collectionRoutes.get(
  "/:id",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.getOne as any
);

// Update a collection
collectionRoutes.patch(
  "/:id",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  validateRequestBody(updateCollectionSchema) as any,
  collectionController.update as any
);

// Delete a collection
collectionRoutes.delete(
  "/:id",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.delete as any
);

// Add paper to collection
collectionRoutes.post(
  "/:collectionId/papers",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionIdParamsSchema) as any,
  validateRequestBody(addPaperToCollectionSchema) as any,
  collectionController.addPaper as any
);

// Remove paper from collection
collectionRoutes.delete(
  "/:collectionId/papers/:paperId",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(paperCollectionParamsSchema) as any,
  collectionController.removePaper as any
);

// Get papers in a collection
collectionRoutes.get(
  "/:collectionId/papers",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionIdParamsSchema) as any,
  collectionController.getCollectionPapers as any
);

// Invite member to collection by email
collectionRoutes.post(
  "/:id/invite",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  validateRequestBody(inviteMemberSchema) as any,
  collectionController.inviteMember as any
);

// Respond to an invite (accept)
collectionRoutes.post(
  "/:id/accept",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.acceptInvite as any
);

// Respond to an invite (decline)
collectionRoutes.post(
  "/:id/decline",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.declineInvite as any
);

// List collection members
collectionRoutes.get(
  "/:id/members",
  rateLimiter,
  authMiddleware as any,
  validateRequestParams(collectionParamsSchema) as any,
  collectionController.getMembers as any
);

// Revoke a pending invite / remove a member (owner only)
collectionRoutes.delete(
  "/:collectionId/members/:memberId",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionMemberParamsSchema) as any,
  collectionController.revokeMember as any
);

// Resend a pending invite (owner only)
collectionRoutes.post(
  "/:collectionId/invites/:memberId/resend",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(collectionMemberParamsSchema) as any,
  collectionController.resendInvite as any
);

// Phase 4: Update paper status/starred within a collection
collectionRoutes.patch(
  "/:collectionId/papers/:paperId",
  collectionMutationLimiter,
  authMiddleware as any,
  validateRequestParams(paperCollectionParamsSchema) as any,
  validateRequestBody(updateCollectionPaperSchema) as any,
  collectionController.updateCollectionPaper as any
);
