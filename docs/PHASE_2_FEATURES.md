# Phase 2 Features - Search, Labels, Filters & Sub-tasks

## Overview

This document describes the major features implemented in Phase 2 of Todone: Enhanced Search, Labels, Filters, and Sub-tasks (Task Hierarchy).

## Enhanced Search & Command Palette

### Goals
- Find anything (tasks, projects, labels, filters) from a single shortcut (Cmd/Ctrl + K)
- Provide fuzzy matching so partial matches work
- Show context (type, query, label color) directly in results

### Features
1. **Global Search**
   - Uses a custom `globalSearch` helper
   - Fuzzy matching with relevance scores
   - Searches across:
     - Task content + description + labels
     - Project names
     - Label names
     - Filter names & queries
   - Returns up to 13 combined results (5 tasks, 3 projects, 3 labels, 2 filters)

2. **Command Palette UI**
   - Live results update as you type
   - Icons for each result type (task, project, label, filter)
   - Colored dots for labels/filters to mirror their brand color
   - Click results to navigate instantly:
     - Tasks open their project or Inbox
     - Projects open in project view
     - Filters/Labels jump to their dedicated views
   - Falls back to Quick Navigation when there are no matches

3. **Keyboard Shortcuts**
   - `Cmd/Ctrl + K`: Toggle command palette
   - Arrow keys: Navigate results (via default focus + buttons)

---

## Labels System

### What are Labels?

Labels are flexible tags that can be attached to tasks to organize them by context, energy level, location, or any custom attribute. Unlike projects, a task can have multiple labels.

### Use Cases

- **Contexts**: @home, @office, @errands, @computer
- **Energy Levels**: @high_energy, @low_energy, @quick_win
- **Time Estimates**: @5min, @30min, @2hours
- **Locations**: @downtown, @online, @phone
- **People**: @boss, @team, @client, @partner
- **Status**: @waiting, @blocked, @urgent, @someday

### Features

1. **Create Labels**
   - Choose from 20 vibrant colors
   - Mark as personal or shared
   - Unique names (lowercase, use underscores)

2. **Manage Labels**
   - Edit name, color, or visibility
   - Delete labels (with confirmation)
   - Search through labels
   - View all labels in one place

3. **Use Labels**
   - Add labels when creating tasks using `@label_name`
   - Filter tasks by label
   - See label colors in task lists

### API

```typescript
// Store methods
useLabelStore.addLabel({ name: 'urgent', color: '#ef4444', personal: true })
useLabelStore.updateLabel(id, { color: '#f97316' })
useLabelStore.deleteLabel(id)
useLabelStore.getLabelsByNames(['urgent', 'work'])
```

### Access

- Navigate to **Labels** from the sidebar
- Use Cmd/Ctrl + K and type "Labels"
- Direct URL: `/labels`

## Filters System

### What are Filters?

Filters are saved queries that create custom views of your tasks. They use a powerful query language to combine multiple conditions.

### Query Language

#### Basic Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `today` | Tasks due today | `today` |
| `overdue` | Overdue tasks | `overdue` |
| `no date` | Tasks without due date | `no date` |
| `p1` - `p4` | Priority levels | `p1` |
| `@label` | Filter by label | `@urgent` |
| `#project` | Filter by project | `#work` |
| `search:term` | Text search in content | `search:meeting` |
| `recurring` | Recurring tasks only | `recurring` |
| `subtask` | Tasks with subtasks | `subtask` |
| `!subtask` | Tasks without subtasks | `!subtask` |

#### Combining Conditions

Use `&` (and) and `|` (or) to combine conditions:

```
today & p1              // High priority tasks due today
@urgent | @critical     // Tasks with urgent OR critical label
#work & overdue         // Overdue tasks in work project
p1 | p2                 // P1 or P2 priority
search:meeting & today  // Tasks with "meeting" due today
```

### Features

1. **Create Filters**
   - Write custom queries
   - Real-time preview of results
   - Choose from 10 colors
   - Mark as favorite

2. **Manage Filters**
   - Edit query, name, or color
   - Delete filters (with confirmation)
   - See preview of matched tasks
   - Organize favorites separately

3. **Use Filters**
   - Quick access from sidebar (planned)
   - Apply to task lists
   - Combine with search

### Common Filter Examples

```typescript
// Morning routine
"today & @home"

// Focus time
"p1 | p2 & @deep_work"

// Quick wins
"@5min & !subtask"

// Waiting on others
"@waiting | @blocked"

// This week's priorities
"p1 & no date"

// Overdue urgent items
"overdue & (@urgent | p1)"

// Long-term planning
"no date & #planning"
```

### API

```typescript
// Store methods
useFilterStore.addFilter({
  name: 'Today\'s Priorities',
  query: 'today & (p1 | p2)',
  color: '#3b82f6',
  favorite: true
})
useFilterStore.updateFilter(id, { query: 'today & p1' })
useFilterStore.deleteFilter(id)

// Apply filters
import { executeFilterQuery } from '@/lib/filterParser';
const filtered = executeFilterQuery(tasks, 'today & @urgent');
```

### Access

- Navigate to **Filters** from the sidebar
- Use Cmd/Ctrl + K and type "Filters"
- Direct URL: `/filters`

## Implementation Details

### Database Schema

Labels and filters are stored in IndexedDB:

```typescript
// Labels table
{
  id: string;
  name: string;
  color: string;
  personal: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filters table
{
  id: string;
  name: string;
  query: string;
  color: string;
  favorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Store Architecture

Both systems use Zustand for state management:

- **useLabelStore**: Manages label CRUD operations
- **useFilterStore**: Manages filter CRUD operations
- Auto-loads data on app start via `AppLayout`

### Components

1. **LabelManager** (`src/components/labels/LabelManager.tsx`)
   - Form-based CRUD interface
   - Color picker with 20 options
   - Search and filtering
   - Personal/shared toggle

2. **FilterManager** (`src/components/filters/FilterManager.tsx`)
   - Query builder interface
   - Real-time preview
   - Color selection
   - Favorite toggle
   - Separate sections for favorites

### Filter Parser

The `filterParser` utility (`src/lib/filterParser.ts`) provides:

```typescript
// Parse query string into structured format
parseFilterQuery(query: string): FilterQuery

// Apply parsed query to task list
applyFilterQuery(tasks: Task[], query: FilterQuery): Task[]

// One-step execution
executeFilterQuery(tasks: Task[], queryString: string): Task[]
```

## Best Practices

### Labels

1. **Keep names short and clear**: @urgent, not @this_is_urgent
2. **Use consistent naming**: @5min, @30min, @2hours (not @5m, @half_hour)
3. **Create sparingly**: Too many labels = harder to choose
4. **Review regularly**: Delete unused labels

### Filters

1. **Start simple**: Begin with `today` or `p1`, then add conditions
2. **Use favorites**: Star your most-used filters
3. **Name clearly**: "Today's urgent tasks" not "Filter 1"
4. **Test queries**: Use preview before saving
5. **Combine intelligently**: `today & p1` is better than creating separate filters

## Future Enhancements

### Phase 3 Additions

1. **Filter Views**
   - Apply saved filters as dedicated views
   - Quick switch between filters in sidebar
   - Default filter per project

2. **Smart Labels**
   - Auto-suggest labels based on content
   - Recently used labels
   - Popular label combinations

3. **Advanced Queries**
   - Date ranges: `due after:2024-01-01`
   - Created date: `created:this week`
   - Assignee filtering: `assigned to:me`
   - Nested queries with parentheses

4. **Filter Templates**
   - Pre-built filter library
   - Community-shared filters
   - Import/export filters

5. **Label Analytics**
   - Most used labels
   - Task distribution by label
   - Label productivity insights

## Drag & Drop Reordering

### Overview
Tasks can now be reordered with drag-and-drop, powered by @dnd-kit.

### Features
- **TaskList Upgrade**: The existing TaskList component now has an `enableDragDrop` prop.
- **Keyboard + Pointer Support**: Uses PointerSensor and KeyboardSensor for accessibility.
- **Order Persistence**: New positions update each task's `order` field via Zustand store.
- **View Coverage**: Enabled in Inbox, Today, Upcoming (per-day lists), and Project sections.
- **Visual Cues**: Dragged tasks fade to 50% opacity and follow cursor smoothly.

### Usage
```tsx
<TaskList tasks={inboxTasks} enableDragDrop />
```

### Future Enhancements
- Drag between sections/projects
- Reorder nested sub-tasks independently
- Board view drag columns

## Sub-tasks (Task Hierarchy)

### Overview
Sub-tasks allow you to break large tasks into smaller steps with unlimited nesting.

### Features
- **Recursive Rendering**: Tasks with `parentTaskId` are displayed beneath their parent with indentation and collapse controls.
- **Inline Creation**: Use the "Add sub-task" button on any task to quickly create children.
- **Hierarchy Management**: Completing a parent visually cascades to children, and task metadata (due date, priority) remains visible.
- **Views Integration**: Inbox, Today, Upcoming, and Project views now render hierarchical task trees.

### Best Practices
1. Keep sub-task names action-oriented.
2. Use sub-tasks for sequential steps or checklists.
3. Avoid creating very deep hierarchies unless necessary—2-3 levels are ideal for clarity.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` → "Labels" | Jump to Labels view |
| `Cmd/Ctrl + K` → "Filters" | Jump to Filters view |

More shortcuts planned for Phase 2 completion.

## Troubleshooting

### Labels not appearing in tasks?
- Ensure you're using the `@` symbol: `@urgent` not `urgent`
- Check the label exists in Labels view
- Labels are case-insensitive: `@urgent` = `@Urgent`

### Filter not returning expected results?
- Use the preview feature to debug
- Check query syntax (use `&` for AND, `|` for OR)
- Verify label names match exactly
- Remember: queries are case-insensitive

### Can't delete a label?
- Labels can always be deleted
- Deletion removes label from all tasks
- Consider editing instead of deleting if you want to keep history

---

**Phase 2 makes Todone incredibly flexible, searchable, and hierarchical!** 🔍🏷️📋✨
