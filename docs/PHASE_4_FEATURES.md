# Phase 4 Features - Settings, Calendar, Templates, & Recurring Tasks

## Overview

This document describes the major features implemented in Phase 4 of Todone: Settings Panel, Calendar View, Templates System, Recurring Tasks UI, and Settings Persistence.

---

## Settings Panel

### Overview

A comprehensive settings system for managing user preferences and app configuration with live persistence.

### Tabs

#### 1. Account Settings

Manage your profile and account information.

**Features:**
- Profile information (name, email)
- Avatar display with initials
- Change password section
- Danger zone (account deletion)
- All with proper form fields and save buttons

**UI:**
- Clean profile card with avatar
- Form fields for name and email
- Password change form with confirmation
- Clearly marked danger zone in red

#### 2. Appearance Settings

Customize the visual appearance of Todone.

**Features:**
- Theme selector (Light / Dark / System)
  - Light mode: Light background with dark text
  - Dark mode: Dark background with light text (default)
  - System mode: Follows system preference
- Accent color picker (6 colors)
  - Emerald (#10b981) - Default
  - Blue (#3b82f6)
  - Purple (#8b5cf6)
  - Pink (#ec4899)
  - Orange (#f97316)
  - Red (#ef4444)
- Display options
  - Compact mode toggle
  - Show completed tasks toggle
- Real-time preview of selected theme/color

**Implementation:**
- Theme switching toggles the Tailwind `dark` class on documentElement
- System theme listener updates when system preference changes
- Accent color propagates through CSS variables (`--brand-500`, `--brand-rgb`)
- All UI components respect the accent color in real-time

#### 3. Notification Settings

Configure how you receive notifications.

**Features:**
- Email notifications for:
  - Task reminders
  - Comments and mentions
  - Task assignments
  - Daily summary
  - Overdue tasks
  - Goal achievements
- Push notification enable button
- Individual toggles for each notification type

**UX:**
- All toggles auto-save immediately
- Push notification button reflects current state
- Inline helper text explains each option

#### 4. General Settings

Regional preferences and task defaults.

**Features:**
- Regional Settings:
  - Language selector (9 languages)
    - English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese
  - Date format options (3 formats)
    - MM/DD/YYYY (US format)
    - DD/MM/YYYY (European format)
    - YYYY-MM-DD (ISO format)
  - Time format (12h / 24h)
  - Start of week (Sunday / Monday)
- Task Defaults:
  - Default view on launch
  - Auto-add time toggle
  - Show weekends toggle
- Data & Privacy:
  - Export all data (JSON)
  - Download activity log

**Future:**
- Language switching implementation (i18n system)
- Actual data export functionality

#### 5. Shortcuts Settings

Reference guide for all keyboard shortcuts.

**Features:**
- Complete list of keyboard shortcuts
- Grouped by category
- Visual presentation with `<kbd>` elements
- "Customize Shortcuts" placeholder for future

### Access

- Navigate to **Settings** from the sidebar
- Use keyboard shortcut: `G then S`
- Direct URL: `/settings`

---

## Calendar View

### Overview

A fully functional multi-view calendar for visualizing tasks by date with drag-and-drop rescheduling.

### Features

#### 1. Multi-View Calendar

Three view modes for different time horizons:

**Month View:**
- Full monthly grid with 7 columns
- Previous/Next month navigation
- Shows adjacent month days (grayed out)
- Up to 3 tasks displayed per day + overflow count
- Task count indicators per day
- Current day highlighting with brand accent
- Priority-based task color coding (P1-P4)

**Week View:**
- Weekly grid showing 7 days
- Previous/Next week navigation
- Up to 5 tasks displayed per day + overflow count
- More detailed view for weekly planning
- Same priority color coding as month view

**Day View:**
- Single day expanded view
- Previous/Next day navigation
- Up to 20 tasks displayed + overflow count
- Detailed view for daily scheduling
- Full date shown in header (e.g., "Monday, January 15")

#### 2. Navigation Controls

- **Today button**: Quick navigation to current date
- **Previous/Next buttons**: Navigate by month/week/day based on current view
- **View toggle buttons**: Switch between month/week/day views
- Dynamic title showing current period
  - Month: "January 2024"
  - Week: "Jan 7 - Jan 13, 2024"
  - Day: "Monday, January 15, 2024"

#### 3. Drag-and-Drop Rescheduling

Move tasks between dates with intuitive drag-and-drop.

**Features:**
- Powered by @dnd-kit for smooth drag experience
- Drag any task card to a different day cell
- Tasks fade to 50% opacity while dragging
- Drop zones highlight when hovering
- Task due date automatically updates on drop
- Drag overlay shows task being moved

**Implementation:**
- `DraggableTaskCard` component wraps each task
- `DroppableDay` component accepts task drops
- `useTaskStore.updateTask` updates due date on successful drop
- PointerSensor with 8px activation threshold for better UX

#### 4. Quick Add from Calendar

Create tasks directly from any calendar cell.

**Features:**
- "Add task" button appears in every calendar cell
- Click to reveal inline input field
- Auto-focus on input when opened
- Task created with selected date as due date
- Supports project association when used in ProjectView
- Form submission creates task and closes input
- Blur closes input if empty

**Usage:**
1. Click "Add task" button in any day cell
2. Type task name
3. Press Enter or click away
4. Task is created with the correct due date

#### 5. Task Display

- Priority-based color coding:
  - P1: Red background
  - P2: Orange background
  - P3: Blue background
  - No priority: Gray background
- Truncated task names with ellipsis
- Task count badges on each day
- Overflow indicator ("+N more")
- Hover/focus states for interactivity

### Integration

- Added to **ProjectView** as the third view mode
- View switcher buttons with icons (List, Board, Calendar)
- Persists selected view type to project settings via `updateProject`
- Works for every project without requiring sections
- Displays all project tasks grouped by due date
- Seamless switching between List/Board/Calendar views

### Access

- Navigate to any project
- Click the **Calendar** icon in the view switcher
- The calendar shows all tasks for that project

---

## Templates System

### Overview

A rich template gallery with 50+ curated blueprints plus custom template creation from existing projects.

### Template Library

50+ pre-built templates across 6 categories:

#### Work Category (15+ templates)
- Product Launch
- Sprint Planning
- Client Onboarding
- Software Development
- Meeting Management
- Project Management
- Code Review
- Bug Tracking
- Documentation
- Team Tasks
- Daily Standup
- Retrospective
- Roadmap Planning
- Release Management
- Testing Workflow

#### Personal Category (10+ templates)
- Daily Routine
- Weekly Planning
- Monthly Review
- Goals & Objectives
- Habit Tracking
- Home Projects
- Personal Development
- Fitness Goals
- Travel Planning
- Event Planning

#### Education Category (8+ templates)
- Course Planning
- Study Schedule
- Assignment Tracker
- Research Project
- Exam Preparation
- Reading List
- Note Organization
- Learning Goals

#### Management Category (8+ templates)
- Team Management
- Performance Review
- OKR Planning
- Resource Allocation
- Budget Planning
- Risk Management
- Stakeholder Updates
- Strategic Planning

#### Marketing & Sales Category (6+ templates)
- Campaign Planning
- Content Calendar
- Lead Generation
- Sales Pipeline
- Customer Journey
- Marketing Strategy

#### Customer Support Category (6+ templates)
- Ticket Management
- Knowledge Base
- Customer Onboarding
- Feedback Collection
- Support Escalation
- SLA Tracking

### Template Structure

Each template includes:
- Project name and color
- Sections with names and order
- Tasks with:
  - Content
  - Description (optional)
  - Section assignment
  - Priority (optional)
  - Labels (optional)
  - Order within section

### Features

#### 1. Template Gallery

- Search functionality to find templates quickly
- Category filters for browsing
- Responsive grid layout
- Icon badges for each template
- Template cards with descriptions

#### 2. Template Preview

- Detailed modal showing full structure
- View all sections and tasks before using
- See project name and color
- Preview task counts per section
- Clear description of template purpose

#### 3. Use Template Flow

One-click template instantiation that creates:

1. **Project** with the template's name and color
2. **Sections** in the specified order
3. **Tasks** with all their properties (content, description, priority, labels, order)
4. Automatic navigation to the new project

### Custom Templates

Create your own templates from existing projects.

**Features:**
- "Create template" CTA in TemplatesView header
- Disabled until projects exist (helpful UX)
- Modal form for:
  - Template name
  - Description
  - Category selection
  - Project source selection
- Copies:
  - All sections
  - All top-level tasks (content, description, priority, labels, order)
- Persists via `useTemplateStore.addCustomTemplate`
- Auto-selects the new template for preview

### Store Architecture

**useTemplateStore** provides:
- `templates`: Array of all templates (bundled + custom)
- `getTemplateById(id)`: Find template by ID
- `getTemplatesByCategory(category)`: Filter templates by category
- `getCategories()`: Get sorted list of categories
- `addCustomTemplate(...)`: Create new custom template

### Access

- Navigate to **Templates** from the sidebar
- Direct URL: `/templates`

---

## Recurring Tasks UI

### Overview

A visual recurring pattern builder shared between Task Composer and Task Detail Modal.

### Recurring Pattern Types

#### 1. Daily Pattern

- Repeats every N days
- Interval: Number of days between occurrences

#### 2. Weekly Pattern

- Repeats on specific days of the week
- Interval: Number of weeks between occurrences
- Days of week: Monday through Sunday checkboxes

#### 3. Monthly Pattern

- Repeats on specific day of month
- Interval: Number of months between occurrences
- Day of month: 1-31

#### 4. Yearly Pattern

- Repeats on specific date each year
- Interval: Number of years between occurrences
- Month and day selection

#### 5. Custom Pattern

- Customizable interval
- Flexible day selection
- Advanced configuration options

### RecurringPatternPicker Component

#### Pattern Presets

Quick-select buttons for common patterns:
- **Daily**: Every day
- **Weekly**: Every week on specific days
- **Monthly**: Every month on specific date
- **Yearly**: Every year on specific date
- **Custom**: Full configuration control

#### Configuration Controls

- **Interval Input**: Number of units between occurrences
- **Days of Week Checkboxes**: For weekly patterns
- **Day of Month Input**: For monthly patterns
- **Month and Day Selectors**: For yearly patterns

#### Advanced Options

- **End Date**: Stop recurring on a specific date
- **Exception Dates**: Skip specific dates
- **Occurrence Counter**: Limit total occurrences

### Natural Language Description

The `describeRecurringPattern` function generates human-readable descriptions:

**Examples:**
- "Every day"
- "Every 2 weeks on Mon, Wed, Fri"
- "Every month on the 15th"
- "Every year on December 25th"
- "Every 3 days until March 15, 2024"

### Integration

#### Task Composer

- Inline recurrence controls when creating new tasks
- Pattern picker collapses when not in use
- Live preview of pattern description
- Task metadata saved with recurrence info

#### TaskDetailModal

- Edit recurrence for existing tasks
- Clear recurrence button
- Reset pattern option
- Visual indicator of recurring status

### Recurrence Badges

Tasks with recurring patterns show:
- **Badge**: Recurring icon (Repeat symbol)
- **Chip**: Pattern description (truncated if long)
- **Color**: Brand accent color for visibility

### RecurringPattern Type

```typescript
type RecurringPattern = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
  exceptions?: Date[];
};
```

---

## Settings Persistence

### Overview

Complete preference persistence with instant visual updates and auto-save behavior.

### useSettingsStore

A Zustand store with three main slices:

#### 1. Appearance Settings

```typescript
interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  compactMode: boolean;
  showCompletedTasks: boolean;
}
```

**Persistence:**
- Saved to localStorage with key `'todone-settings'`
- Auto-saves on any change
- Merges with defaults on load
- Auto-applies theme and accent color on load

#### 2. Notification Settings

```typescript
interface NotificationSettings {
  emailNotifications: {
    taskReminders: boolean;
    commentsAndMentions: boolean;
    taskAssignments: boolean;
    dailySummary: boolean;
    overdueTasks: boolean;
    goalAchievements: boolean;
  };
  pushNotificationsEnabled: boolean;
}
```

**Persistence:**
- All settings auto-save immediately
- No manual save button needed
- Nested structure preserved

#### 3. General Settings

```typescript
interface GeneralSettings {
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  startOfWeek: StartOfWeek;
  defaultView: DefaultView;
  autoAddTime: boolean;
  showWeekends: boolean;
}
```

**Persistence:**
- Regional preferences saved
- Task defaults persisted
- Auto-save on all changes

### Store Methods

- `updateAppearance(settings)`: Update appearance settings
- `updateNotifications(settings)`: Update notification settings
- `updateGeneralSettings(settings)`: Update general settings
- `resetToDefaults()`: Reset all settings to defaults
- `loadFromStorage()`: Reload from localStorage

### Live Theme Application

**Theme Switching:**
```typescript
const applyTheme = (theme: Theme) => {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};
```

**Accent Color Application:**
```typescript
const applyAccentColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const root = document.documentElement;
  root.style.setProperty('--brand-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--brand-500', color);
};
```

### CSS Variables

The accent color is applied via CSS variables that Tailwind classes reference:

```css
:root {
  --brand-rgb: 16, 185, 129;
  --brand-500: #10b981;
}
```

This allows all `bg-brand-*`, `text-brand-*`, `border-brand-*`, etc. classes to dynamically change color.

### Settings View Integration

All settings tabs are wired to the store:

**Appearance Tab:**
- Theme selector directly calls `updateAppearance`
- Color picker calls `updateAppearance({ accentColor })`
- Toggles call `updateAppearance` with new values

**Notifications Tab:**
- Each checkbox calls `updateNotifications` with the specific setting
- Email notification nested calls handle deeply nested updates
- Push notification button calls `updateNotifications({ pushNotificationsEnabled })`

**General Tab:**
- Language selector calls `updateGeneralSettings({ language })`
- Date format calls `updateGeneralSettings({ dateFormat })`
- All other inputs follow the same pattern

### Auto-Save UX

- No manual save buttons needed
- Settings save immediately on change
- Inline helper text explains auto-save behavior
- Visual feedback shows active state
- Changes persist across browser sessions

### Default Settings

```typescript
const DEFAULT_SETTINGS: Settings = {
  appearance: {
    theme: 'dark',
    accentColor: '#10b981',
    compactMode: false,
    showCompletedTasks: true,
  },
  notifications: {
    emailNotifications: {
      taskReminders: true,
      commentsAndMentions: true,
      taskAssignments: true,
      dailySummary: false,
      overdueTasks: true,
      goalAchievements: true,
    },
    pushNotificationsEnabled: false,
  },
  general: {
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    startOfWeek: 'sunday',
    defaultView: 'today',
    autoAddTime: false,
    showWeekends: true,
  },
};
```

---

## Calendar Quick Add Enhancement

### Overview

Add tasks directly from any calendar cell with instant creation and automatic date assignment.

### Features

#### Inline Input

- "Add task" button appears in each calendar cell
- Click to reveal inline input field
- Auto-focus on input when opened
- Minimal, clean design
- Matches calendar cell styling

#### Auto-Date Assignment

- Task created with the cell's date as due date
- Works in month, week, and day views
- Project association when used in ProjectView
- Proper Date object passed to task store

#### Smart Behavior

- Form submission creates task and closes input
- Blur closes input if empty
- Prevents empty task creation
- Focus management for keyboard users

### Usage Example

1. Navigate to a project and switch to Calendar view
2. Find the day you want to add a task to
3. Click "Add task" button in that day's cell
4. Type your task name
5. Press Enter or click away
6. Task appears in the cell immediately

### Implementation Details

**Component:** Extended `DroppableDay` component with quick add state

**State:**
```typescript
const [showQuickAdd, setShowQuickAdd] = useState(false);
const [quickAddInput, setQuickAddInput] = useState('');
const inputRef = useRef<HTMLInputElement>(null);
```

**Handler:**
```typescript
const handleQuickAdd = (content: string, date: Date) => {
  addTask({
    content,
    projectId,
    dueDate: date,
    priority: null,
  });
};
```

**CalendarView Integration:**
- `handleQuickAdd` passed to all `DroppableDay` instances
- `addTask` from `useTaskStore` creates the task
- `projectId` prop allows project association

---

## Implementation Statistics

### Code Additions

**New Components:** 6 major
- SettingsView with 5 tabs (Account, Appearance, Notifications, General, Shortcuts)
- CalendarView (monthly task visualization with drag-and-drop)
- TemplatesView (50+ curated templates, custom creation, preview/apply)
- RecurringPatternPicker (shared across TaskComposer and TaskDetailModal)
- useTemplateStore (template data, category ordering, custom creation)
- useSettingsStore (persistence, theme/color application, localStorage sync)

**Updated Components:** 10+
- Sidebar, App, UIStore, useKeyboardShortcuts, ProjectView
- TaskComposer, TaskDetailModal, SubTaskItem
- useTaskStore (recurring pattern persistence)
- SettingsView (wired all inputs to persistent store)

**New Data/Lib:**
- templates.ts (50+ structured templates)
- recurrence.ts (natural language generator)

**Lines of Code Added:** ~3000+ across all Phase 4 features

### Build Quality

```
✅ TypeScript Compilation: NO ERRORS
✅ ESLint: PASSING (0 warnings)
✅ Production Build: SUCCESSFUL
✅ Bundle Size: ~930 KB (optimized)
✅ Performance: Maintained
✅ Build Time: ~10-12 seconds
```

---

## Best Practices

### Settings

1. **Auto-save**: Changes should persist immediately without manual save
2. **Live Preview**: Visual changes should apply instantly (theme, color)
3. **Defaults**: Always merge with defaults to ensure all fields exist
4. **Validation**: Add form validation for all inputs (future)
5. **UX**: Group related settings together with clear labels

### Calendar

1. **Task Limits**: Limit displayed tasks per cell to maintain readability
2. **Overflow**: Always show "+N more" indicator for hidden tasks
3. **Drag UX**: Use activation threshold to prevent accidental drags
4. **Focus**: Auto-focus quick add input for keyboard efficiency
5. **Color**: Use priority colors for quick scanning

### Templates

1. **Structure**: Keep template structure simple and focused
2. **Descriptions**: Provide clear, helpful descriptions
3. **Categories**: Use meaningful category names
4. **Previews**: Show full structure before applying
5. **Custom**: Allow users to create their own templates

### Recurring Tasks

1. **Simplicity**: Start with preset patterns for common use cases
2. **Description**: Generate human-readable descriptions
3. **Badges**: Show clear visual indicators of recurring tasks
4. **Flexibility**: Allow advanced configuration when needed
5. **Integration**: Ensure recurrence works across all task views

---

## Future Enhancements

### Calendar

- Time blocking with duration visualization
- External calendar integration (Google, Outlook)
- Calendar-specific filters (labels, priority, assignee)
- Drag-to-resize task duration
- Week/Day view improvements
- More granular time views

### Templates

- Template sharing between users
- Community template gallery
- Template rating and reviews
- Template categories expansion
- Template search improvements
- Template versioning

### Recurring Tasks

- Smart recurrence suggestions
- Recurrence exceptions with calendar picker
- Recurrence analytics
- Natural language input for patterns
- Recurrence templates
- Batch edit recurrence

### Settings

- Language switching implementation
- Data export/import functionality
- Account deletion implementation
- Password change implementation
- Custom keyboard shortcuts
- Advanced notification preferences
- Accessibility settings

---

## Troubleshooting

### Settings

**Theme not changing?**
- Check browser console for errors
- Ensure CSS variables are being set
- Verify Tailwind dark class is toggling
- Try hard refresh

**Accent color not updating?**
- Check that CSS variables are set on :root
- Verify color format is valid hex
- Check for CSS specificity issues

### Calendar

**Drag and drop not working?**
- Ensure @dnd-kit is installed
- Check that pointer events aren't blocked
- Verify DroppableDay ref is set
- Check collision detection configuration

**Quick add not creating tasks?**
- Verify addTask is being called
- Check projectId is passed correctly
- Ensure date is valid Date object
- Check task store state

### Templates

**Template not applying correctly?**
- Verify template structure is valid
- Check section and task orders
- Ensure all required fields exist
- Check project/section creation

### Recurring Tasks

**Pattern not saving?**
- Verify RecurringPattern object is valid
- Check that pattern is passed to task
- Ensure useTaskStore is working
- Check task update logic

---

**Phase 4 makes Todone a powerful, customizable, and user-friendly task management system!** ⚙️📅📋🔄✨
