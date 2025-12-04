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
- **Edit a task**: Click the task to open details (planned)
- **Delete a task**: Options menu (planned)

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
- Each project supports multiple views (list, board, calendar coming soon)

## Productivity Features

- Karma system and streaks coming in Phase 3
- Productivity dashboard planned for Phase 3

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
