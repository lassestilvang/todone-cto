# Todone Architecture Documentation

## Overview

Todone is built as an offline-first, progressive web application using React, TypeScript, and IndexedDB. The architecture is designed to support real-time updates, offline functionality, and future cloud sync capabilities.

## Core Principles

1. **Offline-First**: All data is stored locally in IndexedDB using Dexie.js
2. **Type Safety**: Strict TypeScript throughout the codebase
3. **Component Composition**: Small, reusable components
4. **State Management**: Zustand for predictable state updates
5. **Performance**: Virtual scrolling, lazy loading, and optimistic updates

## Technology Stack

### Frontend
- **React 18**: Modern React with Hooks and Concurrent Features
- **TypeScript 5**: Strict type checking for reliability
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Zustand**: Lightweight state management
- **Stores**: Separate stores for auth, tasks, projects, and UI

### Database
- **Dexie.js**: IndexedDB wrapper with Promise-based API
- **IndexedDB**: Browser-native database for persistence

### Routing
- **React Router v6**: Declarative routing with data loading

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
Dexie Database Operation
    ↓
Store State Update
    ↓
Component Re-render
```

## State Management

### Store Structure

#### useAuthStore
- User authentication state
- Login/logout operations
- User profile data

#### useTaskStore
- Task CRUD operations
- Task completion/uncompletion
- Task queries (today, overdue, by project)

#### useProjectStore
- Project and section management
- Project hierarchy
- Project colors and metadata

#### useUIStore
- Active view state
- Sidebar visibility
- Modal states (command palette, quick add)

## Database Schema

### Users Table
- `id` (primary key)
- `email` (indexed)
- Settings and preferences
- Karma statistics

### Projects Table
- `id` (primary key)
- `userId` (indexed)
- `parentProjectId` (indexed)
- Project metadata

### Sections Table
- `id` (primary key)
- `projectId` (indexed)
- Order and metadata

### Tasks Table
- `id` (primary key)
- `projectId` (indexed)
- `sectionId` (indexed)
- `userId` (indexed)
- `completed` (indexed)
- `dueDate` (indexed)
- All task properties

## Component Architecture

### Layout Components
- **AppLayout**: Main application shell
- **Sidebar**: Navigation and project list
- **Header**: Search, quick add, user menu

### Feature Components
- **Views**: Page-level components (Inbox, Today, Upcoming)
- **Tasks**: Task-related components
- **Auth**: Authentication forms

### UI Components
- Atomic, reusable components
- Consistent API design
- Accessibility built-in

## Natural Language Processing

The task parser (`src/features/tasks/parser.ts`) handles:

- **Date keywords**: today, tomorrow, next week, Monday
- **Priority**: p1, p2, p3, p4, !!!, !!, !
- **Labels**: @label_name
- **Projects**: #project_name
- **Duration**: for 1h, for 30min

Future enhancements will include:
- More complex date patterns
- Recurring task patterns
- Time specifications
- Assignee parsing

## Keyboard Shortcuts

Implemented via event listeners at the App level:

- `Cmd/Ctrl + K`: Command palette
- `Escape`: Close modals
- `Q`: Quick add task (future)

## Performance Considerations

### Current
- Optimistic UI updates
- Indexed database queries
- Memoized components

### Future
- Virtual scrolling for 1000+ tasks
- Code splitting by route
- Service worker for caching
- Background sync

## Security

### Authentication
- JWT-based authentication (local)
- Tokens stored in localStorage
- Password not stored (prepared for hashing)

### Data
- All data stored locally
- No server communication in Phase 1
- Ready for end-to-end encryption

## Sync Architecture (Prepared)

The database includes a `syncQueue` table for future cloud sync:

1. Track all local changes
2. Queue changes when offline
3. Sync when connection restored
4. Conflict resolution strategies

## Testing Strategy

### Unit Tests
- Utility functions
- Date parsing
- Task queries

### Integration Tests
- Store operations
- Database operations
- Component interactions

### E2E Tests
- User flows (create task, complete task)
- Navigation
- Authentication

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Type Checking
```bash
npm run typecheck
```

## Future Enhancements

### Phase 2
- Drag-and-drop with @dnd-kit
- Rich text editing with TipTap
- Advanced filtering system
- Label management

### Phase 3
- Cloud sync with conflict resolution
- Real-time collaboration
- File attachments
- Activity log

### Phase 4
- AI-powered task suggestions
- Voice input
- Browser extension
- Mobile apps
- Calendar integration

## File Structure Conventions

### Components
- One component per file
- PascalCase naming
- Collocated types
- Maximum 300 lines

### Hooks
- `use` prefix
- Extracted from components
- Reusable logic

### Types
- Centralized in `src/types/`
- Exported interfaces
- No `any` types

### Styles
- Tailwind utility classes
- Custom components in CSS
- Design tokens in config

## Error Handling

### Database Errors
- Try-catch in store actions
- User-friendly error messages
- Rollback on failure

### Network Errors (Future)
- Retry logic
- Offline detection
- Queue operations

### User Errors
- Form validation
- Inline error messages
- Helpful guidance

## Accessibility

### Current
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

### Future
- Screen reader optimization
- Reduced motion support
- High contrast mode
- Voice control

## Performance Metrics

### Target Metrics
- Initial load: < 2s
- Interaction response: < 100ms
- Task creation: < 50ms
- Database query: < 10ms

### Monitoring
- Lighthouse scores
- Web Vitals
- Bundle size analysis

## Maintenance

### Code Quality
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety
- Git hooks for pre-commit checks

### Documentation
- Inline comments for complex logic
- README for setup
- This document for architecture
- API documentation for utilities

## Conclusion

The Todone architecture is designed for scalability, performance, and maintainability. The offline-first approach ensures the app works anywhere, while the modular structure allows for easy feature additions and improvements.
