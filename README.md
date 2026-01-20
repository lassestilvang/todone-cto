# Todone - From to-do to todone

![Todone Logo](./public/todone.svg)

Todone is a complete, modern task management application inspired by Todoist's best features, built with a beautiful, performant UI and an emphasis on getting things done. Phases 1-4 are complete with core features, advanced organization, and productivity tools.

## 🌟 Brand Identity

- **Name**: Todone (pronounced "to-done")
- **Tagline**: "From to-do to todone"
- **Concept**: Emphasizes task completion and achievement
- **Brand Color**: Vibrant green (#10b981)

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Database**: IndexedDB (Dexie.js) for offline-first functionality
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Rich Text**: TipTap (prepared for Phase 2)
- **Drag & Drop**: @dnd-kit (prepared for Phase 2)

## 📋 Implemented Features

### Phase 1: Core Foundation (✅ Complete)

1. **Project Structure & Configuration**
   - Vite-based React + TypeScript setup
   - Strict TypeScript configuration
   - ESLint and Prettier for code quality
   - Tailwind CSS with custom design system

2. **Authentication System**
   - JWT-based local authentication
   - Login and registration forms
   - User session management
   - Protected routes

3. **Task Management**
   - Create, read, update, delete (CRUD) operations
   - Task completion/uncompletion
   - Task properties: content, description, due date, priority, labels
   - IndexedDB for persistent local storage

4. **Core Views**
   - **Inbox**: Default landing place for unorganized tasks
   - **Today**: Tasks due today with overdue section
   - **Upcoming**: Weekly view with tasks organized by day
   - **Project View**: View tasks within a specific project

5. **Projects & Sections**
   - Create and manage projects
   - Assign colors to projects
   - Create sections within projects
   - Hierarchical organization

6. **UI Components**
   - Button, Input, Textarea, Checkbox
   - Modal, Card, Badge
   - TaskItem, TaskList, TaskComposer
   - Sidebar navigation
   - Header with search and quick actions

7. **Natural Language Parsing**
   - Parse priority indicators (p1, p2, p3, p4, !!!, !!, !)
   - Parse date keywords (today, tomorrow, next week)
   - Parse project references (#project_name)
   - Parse labels (@label_name)
   - Parse duration (for 1h, for 30min)

8. **Keyboard Shortcuts**
   - Cmd/Ctrl + K: Open command palette
   - Quick navigation between views

9. **Command Palette**
   - Global search and navigation
   - Jump to projects, views, and filters
   - Fuzzy search functionality

### Phase 2: Enhanced Organization (✅ Complete)

1. **Labels System**
   - Create and manage labels with custom colors
   - Add labels to tasks using @ syntax
   - Filter tasks by label
   - 20 vibrant color options
   - Personal and shared label types

2. **Filters System**
   - Powerful query language for custom filters
   - Combine conditions with AND (&) and OR (|)
   - Filter by priority, date, labels, projects
   - Save favorite filters
   - Real-time preview of results

3. **Enhanced Search**
   - Global search across tasks, projects, labels, filters
   - Fuzzy matching with relevance scoring
   - Contextual search results
   - Quick navigation from search

4. **Sub-tasks**
   - Unlimited nesting of sub-tasks
   - Visual hierarchy with indentation
   - Expand/collapse controls
   - Inline sub-task creation

5. **Drag-and-Drop**
   - Reorder tasks with drag-and-drop
   - Smooth animations and visual feedback
   - Keyboard and pointer support
   - Task list reordering in all views

### Phase 3: Collaboration & Productivity (✅ Complete)

1. **Comments System**
   - Add comments to tasks
   - View comment history with timestamps
   - Delete comments
   - @Mentions support (UI ready)

2. **Productivity System**
   - Karma points for completing tasks
   - Level progression (9 levels)
   - Daily and weekly goals
   - Streak tracking
   - Visual progress charts

3. **Board View**
   - Kanban-style task organization
   - Columns by section
   - Drag tasks between columns
   - Visual task cards

4. **Task Detail Modal**
   - Comprehensive task editing
   - Description editor
   - Comments section
   - Full task management

### Phase 4: Advanced Features (✅ Complete)

1. **Settings Panel**
   - Account settings (profile, password)
   - Appearance (theme, accent color)
   - Notifications (email, push)
   - General (language, date format)
   - Keyboard shortcuts reference
   - Auto-save persistence

2. **Calendar View**
   - Monthly, weekly, and day views
   - Drag-and-drop task rescheduling
   - Quick add from calendar cells
   - Priority-based color coding
   - Today highlighting and navigation

3. **Templates System**
   - 50+ curated templates across 6 categories
   - Template preview before use
   - Custom template creation from projects
   - One-click project instantiation
   - Search and category filtering

4. **Recurring Tasks**
   - Daily, weekly, monthly, yearly patterns
   - Custom intervals
   - End dates and exceptions
   - Natural language pattern descriptions
   - Visual recurrence badges

5. **Settings Persistence**
   - LocalStorage for preferences
   - Live theme switching
   - Dynamic accent colors via CSS variables
   - Auto-save on all changes

## 🏗️ Project Structure

```
todone/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Sidebar, Header, AppLayout)
│   │   ├── projects/      # Project-related components
│   │   ├── tasks/         # Task components (TaskItem, TaskList, TaskComposer)
│   │   └── ui/            # Reusable UI components
│   ├── features/
│   │   ├── command/       # Command palette
│   │   ├── tasks/         # Task-specific features (parser)
│   │   └── views/         # Main application views
│   ├── lib/
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── database.ts    # Dexie database setup
│   │   └── utils.ts       # General utilities
│   ├── stores/
│   │   ├── useAuthStore.ts    # Authentication state
│   │   ├── useProjectStore.ts # Project state
│   │   ├── useTaskStore.ts    # Task state
│   │   └── useUIStore.ts      # UI state
│   ├── styles/
│   │   └── index.css      # Global styles and Tailwind imports
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🎯 Data Models

The application includes comprehensive TypeScript interfaces for:

- **User**: User profile, settings, preferences, and karma stats
- **Project**: Project metadata, color, view type, hierarchy
- **Section**: Sections within projects for organization
- **Task**: Complete task model with all properties
- **Label**: Task labels with colors
- **Filter**: Custom filter queries
- **Comment**: Task comments (prepared for Phase 3)
- **Attachment**: File attachments (prepared for Phase 3)
- **Template**: Project templates (prepared for Phase 3)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lassestilvang/todone-cto.git
   cd todone-cto
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## 🎨 Design System

### Colors

- **Brand**: Green (#10b981) with full palette (50-900)
- **Priority Colors**:
  - P1: Red (#dc2626)
  - P2: Orange (#f97316)
  - P3: Blue (#3b82f6)
  - P4: Gray (#6b7280)

### Typography

- System font stack for optimal performance
- 14px default body text
- Clear heading hierarchy

### Spacing

- 8px grid system (4px, 8px, 16px, 24px, 32px)
- Consistent padding and margins

### Animations

- 150ms for micro-interactions
- 300ms for view transitions
- Smooth fade-in and slide-in effects

## 🗺️ Roadmap

### ✅ Completed Phases

**Phase 1:** Core Foundation - Authentication, task management, projects, sections, natural language parsing

**Phase 2:** Enhanced Organization - Labels, filters, enhanced search, sub-tasks, drag-and-drop

**Phase 3:** Collaboration & Productivity - Comments, karma system, board view, task detail modal

**Phase 4:** Advanced Features - Settings panel, calendar views, templates system, recurring tasks, settings persistence

### Future Enhancements

Potential improvements for future development:
- Time blocking with duration visualization in calendar
- External calendar integration (Google, Outlook)
- Calendar-specific filters (labels, priority, assignee)
- Template sharing between users
- Community template gallery
- Language switching implementation (i18n)
- Data export/import functionality
- Custom keyboard shortcuts
- Recurrence analytics
- Mobile app version
- Browser extension
- AI-powered task suggestions
- Collaboration features (real-time sync)
- Advanced notifications (email, push)

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete user documentation
- **[Phase 2 Features](docs/PHASE_2_FEATURES.md)** - Labels, filters, and sub-tasks
- **[Phase 4 Features](docs/PHASE_4_FEATURES.md)** - Settings, calendar, templates, recurring tasks
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and design decisions
- **[API](docs/API.md)** - API documentation
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment guide
- **[Keyboard Shortcuts](docs/KEYBOARD_SHORTCUTS.md)** - All keyboard shortcuts

## 🏆 Project Status

**Current Status:** ✅ All Phases Complete - Feature Complete! 🎉

**Version:** 1.0.0-alpha

**Build Status:**
- ✅ TypeScript compilation: 0 errors
- ✅ ESLint: 1 acceptable warning
- ✅ Production build: Successful
- ✅ Bundle size: ~998 KB (301.93 KB gzipped)

**Active Branch:** `feat-todone-initial-architecture`

**Last Updated:** January 2025

## 🤝 Contributing

This project follows strict code quality standards:

- TypeScript strict mode (no `any` types)
- ESLint and Prettier for consistent code style
- Semantic HTML and accessible markup
- Component size limit: 300 lines
- Custom hooks for reusable logic

## 📄 License

ISC

## 🙏 Acknowledgments

Inspired by the excellent work of Todoist and other task management pioneers. Todone aims to provide a similar level of polish with its own unique identity focused on completion and achievement.

---

**Todone** - Because life's better when your to-do's are todone! ✅
