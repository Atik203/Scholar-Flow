"""Render report/figures/*.png from the matching *.svg sources (layout mirror).

No SVG converter is installed on this machine (no rsvg/inkscape/cairosvg),
so this script draws the same labeled layouts with PIL at print resolution.
Re-run after editing an SVG to keep PNGs in sync:
    python render_figures.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))
S = 2  # supersample factor for crisp text


def font(bold=False, size=16):
    size *= S
    for name in (["arialbd.ttf"] if bold else []) + ["arial.ttf", "DejaVuSans.ttf"]:
        for d in ("C:/Windows/Fonts", "/usr/share/fonts"):
            p = os.path.join(d, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
    return ImageFont.load_default()


def box(d, xy, fill, outline, radius=12):
    d.rounded_rectangle([x * S for x in xy], radius=radius * S, fill=fill,
                        outline=outline, width=2 * S)


def txt(d, pos, s, fill="#0f172a", bold=False, size=16, anchor="la"):
    d.text((pos[0] * S, pos[1] * S), s, font=font(bold, size), fill=fill, anchor=anchor)


def arrow(d, x1, y1, x2, y2, color="#334155"):
    d.line([(x1 * S, y1 * S), (x2 * S, y2 * S)], fill=color, width=2 * S)
    L = 10 * S
    d.polygon([(x2 * S, y2 * S), (x2 * S - L, y2 * S - L // 3), (x2 * S - L, y2 * S + L // 3)],
              fill=color)


def save(img, name):
    p = os.path.join(HERE, name)
    img.resize((img.width // S, img.height // S), Image.LANCZOS).save(p, dpi=(300, 300))
    print("wrote", p)


def architecture():
    W, H = 1200 * S, 680 * S
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    txt(d, (600, 22), "ScholarFlow System Architecture", bold=True, size=26, anchor="ma")

    def layer(y, h, fill, edge, label, color, items):
        box(d, (60, y, 1140, y + h), fill, edge)
        txt(d, (80, y + 14), label, bold=True, size=15, fill=color)
        n = len(items)
        w = (1020 - (n - 1) * 40) / n
        x = 120
        for it in items:
            box(d, (x, y + 45, x + w, y + 90), "white", edge, radius=8)
            txt(d, (x + w / 2, y + 60), it, size=15, anchor="ma")
            x += w + 40

    layer(70, 110, "#eff6ff", "#2563eb", "CLIENT",
          "#2563eb", ["Browser (Next.js)", "TipTap Editor + Y.js", "RTK Query + SSE"])
    layer(200, 100, "#f0fdf4", "#16a34a", "FRONTEND (Vercel)",
          "#16a34a", ["Next.js 16 App Router + better-auth"])
    layer(320, 110, "#fefce8", "#ca8a04", "API (Render)",
          "#ca8a04", ["Express REST + JWT", "Socket.IO rooms", "Stripe webhooks"])
    box(d, (60, 450, 1140, 640), "#faf5ff", "#7c3aed")
    txt(d, (80, 464), "DATA + EXTERNAL SERVICES", bold=True, size=15, fill="#7c3aed")
    for (x, w, t1, t2) in [(100, 240, "PostgreSQL", "+ pgvector"), (370, 200, "AWS S3", ""),
                           (600, 200, "Redis", ""), (830, 280, "Gemini / OpenAI / Stripe", "")]:
        box(d, (x, 495, x + w, 550), "white", "#7c3aed", radius=8)
        if t2:
            txt(d, (x + w / 2, 502), t1, size=15, anchor="ma")
            txt(d, (x + w / 2, 524), t2, size=15, anchor="ma")
        else:
            txt(d, (x + w / 2, 512), t1, size=15, anchor="ma")
    txt(d, (600, 566), "REST / WebSocket (TLS) between layers - presigned S3 URLs", size=14,
        fill="#475569", anchor="ma")
    txt(d, (600, 592), "Frontend never touches DB or S3 keys - access-checked API only", size=14,
        fill="#475569", anchor="ma")
    for y1, y2 in [(180, 198), (300, 318), (430, 448)]:
        arrow(d, 600, y1, 600, y2)
    save(img, "architecture.png")


def erd():
    W, H = 1200 * S, 700 * S
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    txt(d, (600, 16), "ScholarFlow Entity-Relationship Diagram (core domain)", bold=True,
        size=24, anchor="ma")

    def ent(x, y, w, h, fill, edge, title, tcolor, rows):
        box(d, (x, y, x + w, y + h), fill, edge, radius=8)
        txt(d, (x + w / 2, y + 8), title, bold=True, size=16, fill=tcolor, anchor="ma")
        yy = y + 36
        for r in rows:
            txt(d, (x + 15, yy), r, size=13)
            yy += 22

    # Row 1
    ent(15, 60, 275, 250, "#eff6ff", "#2563eb", "Identity & Auth", "#1e40af",
        ["User: id, email (unique)", "name, image, role enum", "(RESEARCHER/PRO/LEAD/ADMIN)",
         "plan, subscription status", "Account: OAuth link (userId)",
         "Session + UserToken (refresh)", "VerificationToken (reset/verify)",
         "LoginHistory: who/when/where", "UserPreference: editor, quiet hrs"])
    ent(310, 60, 270, 250, "#f0fdf4", "#16a34a", "Workspace & Team", "#166534",
        ["Workspace: id, name", "ownerId -> User, visibility", "WorkspaceMember:",
         "userId, role (4 levels)", "WorkspaceInvitation:", "email, role, token, state",
         "(pending/accept/decline/exp.)", "WorkspaceSettings: defaults",
         "ActivityLog: member actions"])
    ent(600, 60, 285, 250, "#fefce8", "#ca8a04", "Paper Library", "#854d0e",
        ["Paper: id, uploaderId -> User", "workspaceId (nullable)",
         "title, authors, abstract, tags", "status: draft / published, soft-del",
         "PaperFile: S3 key, version", "PaperChunk: content + vector",
         "(HNSW cosine index)", "PaperVersion: 50 snapshots",
         "PaperShare: email, view/edit, revoke"])
    ent(905, 60, 280, 250, "#faf5ff", "#7c3aed", "Organize & Notes", "#5b21b6",
        ["Collection: id, workspaceId", "name, visibility, status",
         "CollectionPaper: paperId,", "status, starred",
         "CollectionMember: access list", "Notebook -> Section -> Note",
         "ResearchNote: typed, linked to", "papers/collections/threads",
         "Annotation (+Version): PDF marks"])
    # Row 2
    ent(15, 340, 330, 270, "#fff1f2", "#e11d48", "AI Layer", "#9f1239",
        ["AIProvider: catalog + keys, fallback", "AISummary: paperId + tone/",
         "audience/length config, cached", "AIKeyPoint: claims per paper",
         "AIInsightThread -> Message:", "grounded paper Q&A",
         "AIConversation -> Message:", "global assistant history (private)",
         "AIMetadata: title/tag suggestions", "AIContextCache: token efficiency"])
    ent(365, 340, 250, 270, "#ecfdf5", "#0d9488", "Billing", "#0f766e",
        ["Plan: catalog, Stripe price IDs", "Subscription: state, renewal,",
         "grace handling", "Payment: records, status",
         "WebhookEvent: idempotent log", "(sole entitlement truth)",
         "Citation + CitationExport:", "9 formats, history, re-download"])
    ent(635, 340, 245, 270, "#fff7ed", "#ea580c", "Discuss & Notify", "#9a3412",
        ["DiscussionThread: title, tags,", "pin / resolve states",
         "DiscussionMessage: author-", "validated, live via rooms",
         "Notification: category,", "read/star, quiet-hour aware",
         "SearchHistory: re-run/clear,", "trending queries"])
    ent(900, 340, 285, 270, "#f1f5f9", "#475569", "Insight & Ops", "#1e293b",
        ["UsageEvent: feature telemetry", "ActivityLogEntry: severity,",
         "filters, CSV/JSON export", "AdminReport: generated files",
         "AuditLog: admin trail", "SystemAlert + SystemSetting",
         "WebhookEndpoint -> Delivery", "ApiKey: issue/rotate/revoke",
         "ContentReport: moderation queue", "Faq/Testimonial/PageContent"])

    import math

    def link(x1, y1, x2, y2, label=None, lx=None, ly=None, dash=False):
        if dash:
            steps = 24
            for i in range(steps):
                if i % 2 == 0:
                    t1, t2 = i / steps, (i + 1) / steps
                    d.line([((x1 + (x2 - x1) * t1) * S, (y1 + (y2 - y1) * t1) * S),
                            ((x1 + (x2 - x1) * t2) * S, (y1 + (y2 - y1) * t2) * S)],
                           fill="#334155", width=2 * S)
        else:
            d.line([(x1 * S, y1 * S), (x2 * S, y2 * S)], fill="#334155", width=2 * S)
        a = math.atan2(y2 - y1, x2 - x1)
        hl = 10
        d.polygon([(x2 * S, y2 * S),
                   ((x2 - hl * math.cos(a - 0.4)) * S, (y2 - hl * math.sin(a - 0.4)) * S),
                   ((x2 - hl * math.cos(a + 0.4)) * S, (y2 - hl * math.sin(a + 0.4)) * S)],
                  fill="#334155")
        if label:
            txt(d, (lx, ly), label, size=12, fill="#475569", anchor="ma")

    link(290, 150, 308, 150, "owns", 299, 130)
    link(290, 220, 598, 220, "uploads / member of", 444, 200, dash=True)
    link(742, 310, 742, 338, "analyzed", 800, 322)
    link(885, 180, 903, 180, "groups", 894, 160)
    link(445, 310, 480, 338, "contains", 440, 327)
    link(152, 310, 420, 360, "subscribes", 270, 340, dash=True)
    link(1045, 310, 800, 338, "references", 930, 324, dash=True)
    txt(d, (600, 632), "Crow's-foot detail lives in Prisma schema; every paper/AI/search read is",
        size=13, fill="#475569", anchor="ma")
    txt(d, (600, 654), "access-scoped. Vector ops use parameterized raw SQL only; never dropped/resized.",
        size=13, fill="#475569", anchor="ma")
    save(img, "erd.png")


def lifecycle():
    W, H = 1200 * S, 360 * S
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    txt(d, (600, 18), "Paper Lifecycle: Upload to AI Insights", bold=True, size=24, anchor="ma")
    steps = [("1. Upload", ["PDF + metadata", "S3 presigned URL"], "#eff6ff", "#2563eb"),
             ("2. Extract", ["text, title, authors", "abstract (job)"], "#f0fdf4", "#16a34a"),
             ("3. Chunk+Embed", ["chunks -> vectors", "pgvector HNSW"], "#fefce8", "#ca8a04"),
             ("4. Ready", ["searchable, readable", "annotatable"], "#faf5ff", "#7c3aed"),
             ("5. AI Insights", ["summary, Q&A", "compare, review"], "#fff1f2", "#e11d48")]
    x, w, gap = 30, 190, 28
    for title, rows, fill, edge in steps:
        box(d, (x, 120, x + w, 230), fill, edge, radius=10)
        txt(d, (x + w / 2, 136), title, bold=True, size=15, anchor="ma")
        txt(d, (x + w / 2, 164), rows[0], size=14, anchor="ma")
        txt(d, (x + w / 2, 188), rows[1], size=14, anchor="ma")
        if x + w + gap < 1200:
            arrow(d, x + w, 175, x + w + gap - 4, 175)
        x += w + gap
    txt(d, (600, 272), "Extraction failures never block upload - dimension validated before insert",
        size=14, fill="#475569", anchor="ma")
    txt(d, (600, 298), "draft papers stay private until published",
        size=14, fill="#475569", anchor="ma")
    save(img, "paper_lifecycle.png")


architecture()
erd()
lifecycle()
