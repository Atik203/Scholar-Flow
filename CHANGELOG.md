# Scholar-Flow Release Notes

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
