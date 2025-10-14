# Scholar-Flow Release Notes

## Release 1.1.9 (October 15, 2025) - Citation Management Enhancement

### 🎯 New Features

#### Citation Export History Management

- **Delete Citations**: Remove citation exports from history with confirmation dialog
- **Download Citations**: Re-download previous exports with proper filename and format
- **Export from Formats Page**: Quick export directly from citation format showcase
- **Smart Filename Generation**: Automatic filename creation based on paper/collection name and date

#### Enhanced Citation Workflows

- **History Page Management**: Full CRUD operations on citation export history
- **Format-Specific Export**: Pre-select format when exporting from formats page
- **Export Dialog Enhancement**: Controlled dialog mode with external state management
- **Real-time Updates**: Automatic history refresh after delete/download operations

#### User Experience Improvements

- **Confirmation Dialogs**: Safety confirmation before deleting citation exports
- **Loading States**: Visual feedback during delete/download operations
- **Toast Notifications**: Success/error messages for all citation operations
- **File Extension Handling**: Proper file extensions (.bib, .enw, .txt) based on format

### 🔧 Technical Implementation

#### Backend API Enhancements

- **Delete Endpoint**: `DELETE /api/citations/:exportId` - Soft delete citation exports
- **Download Endpoint**: `GET /api/citations/:exportId/download` - Retrieve citation content
- **User Verification**: Ownership checks before delete/download operations
- **Soft Delete Pattern**: Maintains data integrity with `isDeleted` flag

**New Service Methods:**

```typescript
// CitationExportService additions
static async deleteExport(req: AuthRequest, exportId: string)
static async downloadExport(req: AuthRequest, exportId: string)
```

#### Frontend Redux Integration

- **Delete Mutation**: `useDeleteCitationExportMutation` with cache invalidation
- **Download Query**: `useLazyDownloadCitationExportQuery` for on-demand downloads
- **Optimistic Updates**: Instant UI feedback with server reconciliation
- **Cache Strategy**: Strategic invalidation of `CitationExport` tag

**New API Endpoints:**

```typescript
deleteCitationExport: builder.mutation<{ message: string }, string>;
downloadCitationExport: builder.query<DownloadResponse, string>;
```

#### Component Enhancements

**Citation History Page (`/dashboard/research/citations/history`):**

- Implemented `handleDeleteExport` with confirmation and toast feedback
- Implemented `handleReDownload` with blob creation and automatic download
- Added loading states and error handling
- Integrated toast notifications for all operations

**Citation Formats Page (`/dashboard/research/citations/formats`):**

- Added `CitationExportDialog` integration
- Implemented format pre-selection on button click
- Loaded papers and collections for export dialog
- Enhanced user workflow with format-first approach

**CitationExportDialog Component:**

- Added controlled/uncontrolled mode support
- Implemented `preSelectedFormat` prop for format pre-selection
- Enhanced with external state management (`isOpen`, `onClose`)
- Conditional trigger rendering based on control mode

### 🗄️ Database & Schema

- **Existing Schema**: No changes required - utilized existing `CitationExport` model
- **Soft Delete**: Used existing `isDeleted` boolean field
- **Performance**: Leveraged existing indexes on `userId` and `exportedAt`

### 📊 API Routes Summary

| Method | Endpoint                            | Purpose            | Auth |
| ------ | ----------------------------------- | ------------------ | ---- |
| POST   | `/api/citations/export`             | Export citations   | ✅   |
| GET    | `/api/citations/history`            | Get export history | ✅   |
| DELETE | `/api/citations/:exportId`          | Delete export      | ✅   |
| GET    | `/api/citations/:exportId/download` | Download export    | ✅   |

### 🎨 Filename Generation Logic

- **BibTeX**: `{name}-{date}.bib`
- **EndNote**: `{name}-{date}.enw`
- **Others**: `{name}-{date}.txt`
- **Fallback**: `citations-{date}.{ext}`

### ✅ Files Changed

**Backend (2 files):**

1. `apps/backend/src/app/services/citationExport.service.ts` - Added delete/download methods
2. `apps/backend/src/app/routes/citation.routes.ts` - Added DELETE and GET download endpoints

**Frontend (4 files):**

1. `apps/frontend/src/redux/api/phase2Api.ts` - Added delete/download mutations
2. `apps/frontend/src/app/dashboard/(modules)/research/citations/history/page.tsx` - Implemented handlers
3. `apps/frontend/src/app/dashboard/(modules)/research/citations/formats/page.tsx` - Added export integration
4. `apps/frontend/src/components/citations/CitationExportDialog.tsx` - Enhanced dialog control

### 🐛 Bug Fixes

- Fixed `setIsOpen` reference error in CitationExportDialog
- Removed `deletedAt` field usage (schema doesn't have it)
- Fixed TypeScript type errors in all components
- Proper cleanup in download handler (URL.revokeObjectURL)

### 📝 Documentation

- Created `CITATION_FUNCTIONS_ADDED.md` - Complete implementation summary
- Created `TESTING_GUIDE.md` - Comprehensive testing instructions
- Updated `CITATIONS_DEBUG.md` - Enhanced debugging guide

### 🚀 Performance & Security

- **Authentication**: All endpoints require JWT authentication
- **Authorization**: User ownership verified before operations
- **Soft Delete**: No data loss, can be recovered if needed
- **Blob Handling**: Proper cleanup to prevent memory leaks
- **Error Handling**: Try-catch blocks with user-friendly messages

---

## Release 1.3.0 (January 15, 2025) - Citation Management & Collaboration Enhancement

### 🎯 New Features

#### Citation Export System

- **Multi-format Support**: Export citations in BibTeX, EndNote, APA, MLA, IEEE, Chicago, and Harvard formats
- **Batch Export**: Export individual papers or entire collections
- **Export History**: Track and re-download previous exports
- **Research Integration**: Seamlessly integrated into the Research workflow
- **Citation Management**: Comprehensive citation tools with format-specific formatting

#### Threaded Research Discussions

- **Enhanced Discussion System**: Create discussions for papers, collections, or workspaces
- **Threaded Conversations**: Nested message replies with conversation hierarchy
- **Discussion Management**: Pin important discussions, mark as resolved, and categorize with tags
- **Real-time Collaboration**: Live discussion participation with user attribution
- **Discussion Guidelines**: Built-in best practices and discussion types

#### Activity Log System

- **Comprehensive Tracking**: Monitor all workspace activities with detailed logging
- **Advanced Filtering**: Filter by user, entity type, action, severity, and date range
- **Activity Export**: Export activity data in JSON or CSV formats
- **Severity Levels**: INFO, WARNING, ERROR, and CRITICAL activity categorization
- **Entity-specific Logs**: Track activities for papers, collections, discussions, and annotations

#### UI/UX Improvements

- **Reorganized Navigation**: Moved citation features to Research section, discussions to Collaboration
- **Removed Phase 2 Branding**: Integrated features seamlessly into existing workflow
- **Enhanced Citations Page**: Comprehensive citation management with paper selection and export history
- **Improved Sidebar**: Cleaner navigation structure with logical feature grouping

### 🔧 Technical Implementation

#### Backend API

- **Citation Export Service**: Complete citation formatting for 7 academic formats
- **Discussion Service**: Full CRUD operations for threads and messages with permissions
- **Activity Log Service**: Comprehensive activity tracking with filtering and export
- **Database Schema**: New models for CitationExport, DiscussionThread, DiscussionMessage, ActivityLogEntry
- **Authentication**: Secure endpoints with workspace-based access control

#### Frontend Components

- **CitationExportDialog**: Export interface with format selection and options
- **CreateDiscussionDialog**: Discussion creation with entity association
- **DiscussionThreadCard**: Thread display with message management
- **ActivityLog**: Activity viewer with advanced filtering and export
- **Enhanced Citations Page**: Integrated citation management at `/dashboard/research/citations`

#### Database Changes

- **New Models**: CitationExport, DiscussionThread, DiscussionMessage, ActivityLogEntry
- **New Enums**: CitationFormat, ActivitySeverity
- **Enhanced Relationships**: Updated existing models with proper relations
- **Optimized Indexes**: Performance improvements for all new features

---

## Release 1.3.1 (January 15, 2025) - Code Quality & TypeScript Fixes

### 🔧 Code Updates & Fixes

#### TypeScript Type System Improvements

- **Fixed CitationExportHistory Interface**: Added missing properties (`downloadedAt`, `fileSize`, `paperCount`) to match actual API response structure
- **Enhanced DiscussionThread Interface**: Added `author`, `messages`, and `participants` properties for complete type safety
- **Resolved Type Annotations**: Fixed implicit `any` type errors in array map functions across all components
- **API Type Consistency**: Synchronized all frontend interfaces with backend API responses

#### Next.js 15 Compatibility

- **Dynamic Route Params Fix**: Updated discussion detail page to handle Next.js 15's new async params structure
- **Server/Client Component Separation**: Created proper client component wrapper for React hooks functionality
- **Build Optimization**: Ensured all dynamic routes work correctly with Next.js 15's new routing system

#### Component Type Safety

- **DiscussionThreadCard Updates**: Fixed component to use correct `author` property instead of `user` for thread authors
- **Type Definition Synchronization**: Ensured all components use consistent type definitions from the API
- **Error Resolution**: Fixed all TypeScript compilation errors across the application

#### Build System Improvements

- **Production Build Success**: Resolved all build compilation errors
- **Type Checking Pass**: Achieved zero TypeScript errors across the entire codebase
- **Bundle Optimization**: Maintained proper code splitting and optimization for all new features
- **Route Generation**: Successfully generated 166 static pages including all new feature routes

#### Navigation Structure Fixes

- **Sidebar Navigation Cleanup**: Removed duplicate "Collaboration" section that was conflicting with "Collaborations"
- **Feature Organization**: Properly moved Discussions and Activity Log to Research section for better UX
- **Role-based Routing**: Ensured all new features work correctly with existing role-scoped routing system

### 🎯 Technical Achievements

- ✅ **Zero TypeScript Errors**: Complete type safety across the application
- ✅ **Successful Production Build**: All 166 routes compiled successfully
- ✅ **Next.js 15 Compatibility**: Full compatibility with latest Next.js features
- ✅ **Type System Integrity**: Consistent type definitions throughout the codebase
- ✅ **Component Reliability**: All components properly typed and error-free

### 📊 Build Statistics

- **Total Routes**: 166 static pages successfully generated
- **New Feature Routes**: 9 new routes for citations, discussions, and activity logs
- **Bundle Size**: Optimized with proper code splitting
- **Type Safety**: 100% TypeScript coverage with zero errors

---

## Release 1.2.0 (January 15, 2025) - Annotation & Collaboration Phase 1

### 🎯 New Features

#### PDF Annotation System

- **Interactive PDF Viewer**: React-PDF integration with text selection and coordinate-based positioning
- **Three Annotation Types**: Highlight (yellow), Comment (blue), Note (green) with visual differentiation
- **Real-time Annotation Overlay**: Annotations appear directly on PDF pages with zoom/rotate controls
- **Annotation Toolbar**: Type selection, annotation management, and display controls
- **Annotation List Sidebar**: Page-based organization with threaded replies and user attribution
- **Threaded Replies**: Nested discussion threads for annotations

#### Comments System

- **Paper-level Comments**: Threaded discussion system for papers
- **Comment Management**: Create, edit, delete, and reply to comments
- **User Attribution**: Avatars, names, and timestamps for all comments
- **Real-time Updates**: Comments appear immediately across the interface

#### Research Notes System

- **Rich Text Editor**: Full-featured note editor with auto-save functionality
- **Tag-based Organization**: Add custom tags for note categorization
- **Privacy Controls**: Private/public note visibility settings
- **Search Functionality**: Search across note content and tags
- **Paper-specific Notes**: Link notes to specific papers or keep them general
- **Note Management**: Create, edit, delete, and search notes

#### UI/UX Enhancements

- **Tabbed Interface**: Seamless switching between Preview, Annotations, Comments, and Notes
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Components**: Consistent design language with existing Scholar-Flow interface

### 🔧 Technical Implementation

#### Backend API

- **Annotation Endpoints**: Full CRUD operations for annotations with versioning
- **Note Endpoints**: Complete note management with search and filtering
- **Database Schema**: New ResearchNote model with optimized indexes
- **Authentication**: Secure endpoints with user-based access control

#### Frontend Components

- **PdfAnnotationViewer**: Main PDF viewer with annotation overlay
- **AnnotationToolbar**: Toolbar for annotation controls and type selection
- **AnnotationLayer**: Renders annotations as overlays on PDF with hover effects
- **AnnotationList**: Sidebar list of all annotations grouped by page
- **CommentSection**: Comments interface with threaded discussions
- **NotesPanel**: Research notes management interface
- **Redux Integration**: Complete API integration with RTK Query
- **Research Annotations Route**: Dedicated annotation interface at `/dashboard/researcher/research/annotations`
- **Real-time Paper Loading**: Fetches actual user papers from database instead of mock data

### 🗄️ Database Changes

- **ResearchNote Model**: New table for research notes with tags and privacy controls
- **Enhanced Annotation Model**: Full utilization of existing annotation system
- **Optimized Indexes**: Performance improvements for annotation and note queries

---

## Release 1.1.8 (October 3, 2025)
