# Todone - From to-do to todone

![Todone Logo](./public/todone.svg)

Todone is a complete, modern task management application inspired by Todoist's best features, built with a beautiful, performant UI and an emphasis on getting things done. This is the initial architecture implementation focused on Phase 1 core features.

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

## 📋 Implemented Features (Phase 1)

### ✅ Core Foundation

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

### Phase 2: Essential Features (Next)
- Filters and labels system
- Complete search functionality
- Three view layouts (list, board, calendar)
- Sub-tasks and task hierarchy
- Full drag-and-drop support
- Task comments

### Phase 3: Advanced Features
- Recurring tasks with scheduler
- Complete natural language parsing
- Productivity/Karma system
- Calendar integration UI
- Templates system
- Collaboration features

### Phase 4: Polish & AI
- AI Assist features
- Offline sync engine
- Advanced animations
- Empty states and onboarding
- Accessibility enhancements
- Performance optimization
- Mobile responsive design
- Browser extension

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
