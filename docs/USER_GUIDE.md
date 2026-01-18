# Todone User Guide

Welcome to Todone! This guide will help you get started and become productive quickly.

## Getting Started

1. **Open Todone**: Visit the deployed app or run it locally (`npm run dev`).
2. **Create an account**: Provide your name, email, and password.
3. **Log in**: Access your personalized workspace.

## Core Concepts

### Inbox
- Default landing place for new tasks
- Use it to quickly capture ideas
- Process tasks into projects later

### Today
- Shows tasks due today
- Includes overdue tasks
- Displays key stats (due today, overdue, tomorrow)

### Upcoming
- Weekly overview of tasks
- Navigate by day
- Shows number of tasks per day

### Projects
- Organize tasks by area
- Assign colors and sections
- View tasks by project

### Productivity
- Track daily and weekly goals
- Earn Karma and level up through nine tiers
- Monitor streaks and completion trends
- Visual charts for last 7 days and 4 weeks

## Creating Tasks

### Quick Add (Global)
- Press `Cmd/Ctrl + K`
- Type your task with natural language
- Examples:
  - `Finish report tomorrow p1 #work @urgent`
  - `Plan trip for 2h next week`

### Inline Task Creation
- Use the "Add task" field in Inbox, Today, Upcoming, or Projects
- Supports the same natural language shortcuts

### Task Properties
- **Priority**: `p1`, `p2`, `p3`, `p4`
- **Due Date**: `today`, `tomorrow`, `next week`
- **Project**: `#project_name`
- **Labels**: `@label_name`
- **Duration**: `for 30min`, `for 1h`

## Managing Tasks

- **Complete a task**: Click the checkbox
- **View details & comments**: Click any task to open the detail modal
- **Edit description**: Use the description editor inside the detail modal
- **Add comments**: Scroll to the comments section, type your note, and send
- **Delete a task**: Detail modal → Delete button

## Navigation

- **Sidebar**: Inbox, Today, Upcoming, Projects
- **Command Palette**: `Cmd/Ctrl + K`
- **Keyboard Shortcuts**:
  - `Cmd/Ctrl + K`: Command palette
  - `Q`: Quick add (planned)
  - `G then I`: Go to Inbox (planned)
  - `G then T`: Go to Today (planned)

## Labels & Filters

- Create labels with `@label_name`
- Filters are coming in Phase 2

## Projects & Sections

- Create projects to organize tasks
- Add sections within projects
- Each project supports multiple views:
  - **List**: Traditional task list with sections
  - **Board**: Kanban-style columns (one per section)
  - **Calendar**: Monthly/weekly/daily calendar view with drag-and-drop

#### Calendar View

The calendar view provides a visual timeline for your project tasks:

**Features:**
- **Three view modes**: Month, week, and day views
- **Drag-and-drop**: Move tasks between dates by dragging
- **Quick add**: Click "Add task" in any cell to create a task with that date
- **Task display**: Priority-coded colors, task counts, overflow indicators
- **Navigation**: Previous/Next buttons and Today quick navigation

**How to Use:**
1. Navigate to any project
2. Click Calendar icon in the view switcher
3. Use month/week/day buttons to change view
4. Drag tasks to reschedule them
5. Click "Add task" in any cell to quickly create a task for that date

## Comments & Collaboration

- **Add Comments**: Click any task → scroll to comments → type and send
- **View Comments**: See all task comments with timestamps
- **Delete Comments**: Hover over your comment → click delete icon
- **@Mentions**: Type @name in comments (UI ready, full parsing coming soon)
- **Task Discussions**: Keep all context in one place with task comments

## Settings

- Find settings via sidebar (Settings icon) or shortcut `G then S`
- All settings auto-save immediately - no manual save needed
- Tabs included:
  - **Account**: Update name, email, password, avatar, danger zone
  - **Appearance**: Select light/dark/system theme, accent color, display options
  - **Notifications**: Configure email/push notifications for reminders, mentions, assignments, goals
  - **General**: Regional preferences (language, date/time formats, start of week), task defaults, data export
  - **Shortcuts**: Reference of all keyboard shortcuts (customization coming soon)
- Theme changes apply instantly to the entire app
- Accent color updates all brand-colored elements in real-time
- All settings pages follow Todone's dark, modern aesthetic

## Templates

Templates help you quickly set up new projects with pre-configured structures.

### Browsing Templates

- Navigate to **Templates** from the sidebar
- Browse 50+ curated templates across 6 categories:
  - Work: Product launches, sprint planning, client onboarding, and more
  - Personal: Daily routines, weekly planning, fitness goals, travel planning
  - Education: Course planning, study schedules, research projects
  - Management: Team management, OKR planning, performance reviews
  - Marketing & Sales: Campaigns, content calendars, sales pipelines
  - Customer Support: Ticket management, knowledge base, customer onboarding
- Use the search bar to find specific templates
- Filter by category to narrow down options

### Using a Template

1. Click on any template card to preview it
2. Review the structure (project, sections, tasks)
3. Click "Use Template" to create a new project
4. The project is instantly created with all sections and tasks
5. You're automatically navigated to the new project

### Creating Custom Templates

Turn your existing projects into templates for reuse:

1. Navigate to **Templates** view
2. Click "Create Template" in the header
3. Fill in:
   - Template name
   - Description
   - Category
   - Select source project
4. Click "Create Template"
5. Your custom template appears in the gallery

**Note:** Custom templates copy all sections and top-level tasks from the source project.

## Recurring Tasks

Create tasks that repeat automatically on a schedule.

### Setting Up Recurrence

When creating or editing a task:

1. Click the "Recurring" toggle or icon
2. Select a pattern type:
   - **Daily**: Every day or every N days
   - **Weekly**: On specific days of the week
   - **Monthly**: On a specific day of the month
   - **Yearly**: On a specific date each year
3. Configure the interval (e.g., every 2 weeks, every 3 months)
4. Optionally set:
   - End date: Stop recurring after a specific date
   - Exception dates: Skip specific dates
   - Occurrence limit: Stop after N occurrences

### Recurring Patterns Examples

- "Every day" - Daily tasks
- "Every week on Mon, Wed, Fri" - Three-day work schedule
- "Every 2 weeks on Friday" - Biweekly meetings
- "Every month on the 15th" - Monthly bill payments
- "Every year on December 25" - Annual events
- "Every 3 days until March 15" - Limited duration tasks

### Visual Indicators

- Tasks with recurring patterns show a repeat icon (↻)
- A chip displays the pattern description
- Hover over the chip to see the full pattern details

### Managing Recurrence

- **Edit**: Click the task and modify the recurrence pattern
- **Clear**: Remove recurrence from a task
- **Reset**: Start the pattern from today

### Natural Language Patterns

Tdone automatically generates human-readable descriptions of your recurring patterns, making it easy to understand at a glance what the schedule is.

## Productivity Features

### Karma System
- **Earn Karma**: Complete tasks to earn points (10 points per completed task)
- **Lose Karma**: Overdue tasks reduce your karma (2 points per overdue task)
- **Level Up**: Progress through 9 levels from Beginner to Enlightened
- **View Progress**: Track your level progress and points needed to next level

### Goals & Streaks
- **Daily Goal**: Set a target number of tasks to complete each day
- **Weekly Goal**: Set a target for the week
- **Current Streak**: Maintain consecutive days meeting your daily goal
- **Longest Streak**: Track your best streak ever
- **Visual Progress**: See progress bars and percentages

### Charts
- **Last 7 Days**: Bar chart showing daily completion counts
- **Last 4 Weeks**: Line chart showing trends over time
- **Stats Cards**: Total completed, current streak, daily progress

### Settings
- Configure daily and weekly goals
- Set goals to 0 to disable tracking
- Toggle karma system on/off
- Enable/disable goal celebrations

## Settings

- Access account and app settings (planned)
- Customize theme, notifications, and preferences

## Offline Mode

- Todone works offline with IndexedDB
- Tasks sync when you're back online (future)

## Integrations

- UI placeholders for future integrations (Google Calendar, Slack, etc.)

## Tips for Success

- Capture tasks quickly using natural language
- Review your Inbox daily
- Plan your day each morning in the Today view
- Use Upcoming to prepare for the week
- Organize tasks into projects and sections

## Help & Support

- Check the documentation in the `docs/` directory
- Open an issue on GitHub for support

---

**Remember:** Every task completed moves you from to-do to todone. 🎯
