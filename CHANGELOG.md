# Scholar-Flow Release Notes

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
- **CommentSection**: Comments interface with threaded discussions
- **NotesPanel**: Research notes management interface
- **Redux Integration**: Complete API integration with RTK Query

### 🗄️ Database Changes
- **ResearchNote Model**: New table for research notes with tags and privacy controls
- **Enhanced Annotation Model**: Full utilization of existing annotation system
- **Optimized Indexes**: Performance improvements for annotation and note queries

---

## Release 1.1.8 (October 3, 2025)
