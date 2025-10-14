# Scholar-Flow Feature Usage Guide

## 🎯 Overview

This guide covers the three major new features added to Scholar-Flow: **Citation Export System**, **Threaded Research Discussions**, and **Activity Log System**. These features are now fully integrated into the Research section of your dashboard.

## 📚 Citation Export System

### What It Does
Export your research papers and collections in 7 different academic citation formats with batch processing and history tracking.

### How to Access
1. Navigate to **Research** → **Citations** in your dashboard sidebar
2. Or go directly to `/dashboard/researcher/research/citations`

### Key Features

#### 1. **Multi-Format Support**
- **BibTeX**: For LaTeX documents and academic papers
- **EndNote**: For EndNote reference manager
- **APA**: American Psychological Association style
- **MLA**: Modern Language Association style
- **IEEE**: Institute of Electrical and Electronics Engineers style
- **Chicago**: Chicago Manual of Style
- **Harvard**: Harvard referencing style

#### 2. **Paper Selection**
- Browse through your research papers
- Select individual papers or multiple papers for batch export
- View paper details including authors, year, and title
- Visual indicators show which papers are selected

#### 3. **Collection Export**
- Export entire collections at once
- View collection paper counts
- Quick export buttons for each collection

#### 4. **Export History**
- Access via **Research** → **Citations** → **Export History**
- View all previous exports with timestamps
- Re-download previous exports
- Delete old exports to manage storage

#### 5. **Format Guide**
- Access via **Research** → **Citations** → **Format Guide**
- See examples of each citation format
- Copy example citations to clipboard
- Compare different formats side-by-side

### Step-by-Step Usage

#### Exporting Individual Papers
1. Go to **Research** → **Citations**
2. Select papers by clicking on them (they'll highlight when selected)
3. Click **"Export Selected (X)"** button
4. Choose your preferred format in the dialog
5. Click **"Export"** to download

#### Exporting Collections
1. In the Citations page, find the **Collections** section
2. Click **"Export"** next to any collection
3. Choose format and export options
4. Download the file

#### Viewing Export History
1. Go to **Research** → **Citations** → **Export History**
2. Browse your previous exports
3. Click **"Re-download"** to get the file again
4. Use **"Delete"** to remove old exports

---

## 💬 Threaded Research Discussions

### What It Does
Create and participate in threaded discussions about research papers, collections, and workspaces with real-time collaboration features.

### How to Access
1. Navigate to **Research** → **Discussions** in your dashboard sidebar
2. Or go directly to `/dashboard/researcher/research/discussions`

### Key Features

#### 1. **Discussion Creation**
- Create discussions for papers, collections, or workspaces
- Add descriptive titles and detailed content
- Tag discussions for easy categorization
- Set discussion type (Question, Idea, Review, Collaboration, Feedback)

#### 2. **Threaded Conversations**
- Nested message replies with conversation hierarchy
- Real-time updates when new messages are added
- User attribution for all messages
- Timestamp tracking for all activities

#### 3. **Discussion Management**
- Pin important discussions for easy access
- Mark discussions as resolved when questions are answered
- Filter discussions by status, pinned state, and tags
- Search through discussion content

#### 4. **Collaboration Features**
- Multiple participants per discussion
- Real-time notification system
- Discussion guidelines and best practices
- User activity tracking

### Step-by-Step Usage

#### Creating a New Discussion
1. Go to **Research** → **Discussions**
2. Click **"Start Discussion"** button
3. Fill in the discussion form:
   - **Title**: Clear, descriptive title
   - **Content**: Detailed description of your topic
   - **Entity**: Link to a paper, collection, or workspace
   - **Tags**: Add relevant keywords
   - **Type**: Choose discussion type
4. Click **"Create Discussion"**

#### Participating in Discussions
1. Browse discussions in the main list
2. Click on any discussion to view details
3. Read the original post and all replies
4. Add your own reply using the reply form
5. Use the sidebar to manage discussion settings

#### Managing Discussions
1. **Pin/Unpin**: Click the pin icon to highlight important discussions
2. **Resolve/Reopen**: Mark discussions as resolved when questions are answered
3. **Filter**: Use the filter options to find specific discussions
4. **Search**: Use the search bar to find discussions by content

#### Discussion Guidelines
- Be respectful and constructive in your comments
- Use clear, descriptive titles for discussions
- Tag discussions with relevant keywords
- Mark discussions as resolved when questions are answered
- Pin important discussions for easy access

---

## 📊 Activity Log System

### What It Does
Comprehensive tracking and monitoring of all research-related activities with advanced filtering and export capabilities.

### How to Access
1. Navigate to **Research** → **Activity Log** in your dashboard sidebar
2. Or go directly to `/dashboard/researcher/research/activity-log`

### Key Features

#### 1. **Comprehensive Tracking**
- Monitor all workspace activities with detailed logging
- Track activities for papers, collections, discussions, and annotations
- User activity tracking and attribution
- Timestamp and metadata capture

#### 2. **Advanced Filtering**
- Filter by user, entity type, action, and severity level
- Date range filtering (today, week, month, quarter, year)
- Search through activity descriptions
- Real-time filter updates

#### 3. **Severity Levels**
- **INFO**: General information and updates
- **WARNING**: Potential issues or concerns
- **ERROR**: Errors that need attention
- **CRITICAL**: Critical issues requiring immediate action

#### 4. **Export Capabilities**
- Export activity data in multiple formats (JSON, CSV, Excel, PDF)
- Customizable export options and filters
- Export history and re-download capabilities
- Bulk export functionality

### Step-by-Step Usage

#### Viewing Activity Log
1. Go to **Research** → **Activity Log**
2. View the activity timeline with all recent activities
3. Use the quick stats cards to see overview information
4. Scroll through the timeline to see detailed activity information

#### Filtering Activities
1. Use the **Advanced Filters** section
2. Set your desired filters:
   - **Search**: Type keywords to search activity descriptions
   - **Severity**: Choose severity level (Info, Warning, Error, Critical)
   - **Entity Type**: Filter by papers, discussions, collections, etc.
   - **Date Range**: Choose time period
3. Click **"Clear"** to reset all filters

#### Exporting Activity Data
1. Go to **Research** → **Activity Log** → **Export Log**
2. Configure your export:
   - **Format**: Choose JSON, CSV, Excel, or PDF
   - **Date Range**: Select time period
   - **Severity**: Choose severity levels to include
   - **Entity Type**: Select entity types to include
   - **Options**: Include metadata, user info, timestamps
3. Click **"Export Activity Log"** to download

#### Understanding Activity Types
- **Paper Activities**: Upload, edit, delete, view papers
- **Collection Activities**: Create, modify, share collections
- **Discussion Activities**: Create, reply, resolve discussions
- **Annotation Activities**: Add, edit, delete annotations
- **User Activities**: Login, profile updates, role changes
- **Workspace Activities**: Create, modify, share workspaces

---

## 🚀 Quick Start Tips

### For New Users
1. **Start with Citations**: Export a few papers to understand the format options
2. **Create a Discussion**: Start a simple discussion about a research topic
3. **Check Activity Log**: See what activities are being tracked

### For Power Users
1. **Batch Operations**: Use collection exports for multiple papers
2. **Discussion Management**: Pin important discussions and use tags effectively
3. **Activity Monitoring**: Set up regular exports for activity analysis

### Best Practices
1. **Citations**: Use the format guide to choose the right citation style for your field
2. **Discussions**: Tag discussions consistently and mark resolved ones
3. **Activity Log**: Export regularly to maintain historical records

---

## 🔧 Technical Details

### Supported Formats
- **Citation Export**: BibTeX, EndNote, APA, MLA, IEEE, Chicago, Harvard
- **Activity Export**: JSON, CSV, Excel, PDF
- **Discussion Export**: JSON format for data analysis

### Performance
- **Citation Export**: Handles up to 100 papers per export
- **Discussions**: Supports unlimited threads and messages
- **Activity Log**: Tracks up to 10,000 activities per workspace

### Integration
- All features integrate seamlessly with existing Scholar-Flow workflow
- Role-based access control for all features
- Real-time updates and notifications
- Mobile-responsive design

---

## 📞 Support

If you encounter any issues or have questions about these features:

1. Check the **Format Guide** for citation-related questions
2. Review **Discussion Guidelines** for collaboration best practices
3. Use the **Activity Log** to troubleshoot any system issues
4. Contact support for technical assistance

---

## 🎉 Conclusion

These three features work together to create a comprehensive research management system:

- **Citations** help you properly reference your work
- **Discussions** enable collaboration and knowledge sharing
- **Activity Log** provides transparency and audit trails

Use them in combination to maximize your research productivity and collaboration effectiveness!
