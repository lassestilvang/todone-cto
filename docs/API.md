# Todone API Documentation

This document describes the current and planned API endpoints for Todone.

## Overview

Phase 1 focuses on front-end architecture and local data management. The backend API structure is prepared for future cloud sync and collaboration. The API is built with Express and TypeScript (see `server/` directory).

## Authentication

### POST `/api/auth/register`
Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "Ada Lovelace",
    "email": "ada@todone.app",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT token",
    "user": { /* User object */ }
  }
  ```

### POST `/api/auth/login`
Authenticates a user.
- **Request Body**:
  ```json
  {
    "email": "ada@todone.app",
    "password": "securepassword"
  }
  ```
- **Response**: same as register.

### POST `/api/auth/logout`
Invalidates the current session token.

## Tasks

### GET `/api/tasks`
Retrieve all tasks for the authenticated user.
- **Query Parameters**: `projectId`, `sectionId`, `label`, `dueDate`, `completed`

### POST `/api/tasks`
Create a new task.
- **Request Body**: Partial Task object (content required)

### PATCH `/api/tasks/:id`
Update a task.

### DELETE `/api/tasks/:id`
Delete a task (with undo capability planned).

### POST `/api/tasks/:id/complete`
Mark a task as completed.

### POST `/api/tasks/:id/uncomplete`
Mark a task as not completed.

## Projects

### GET `/api/projects`
Retrieve projects for the authenticated user.

### POST `/api/projects`
Create a new project.

### PATCH `/api/projects/:id`
Update project properties.

### DELETE `/api/projects/:id`
Delete a project (cascade options for tasks and sections).

## Sections

### POST `/api/projects/:projectId/sections`
Create a section within a project.

### PATCH `/api/sections/:id`
Update a section.

### DELETE `/api/sections/:id`
Delete a section.

## Labels

### GET `/api/labels`
Get user labels.

### POST `/api/labels`
Create a new label.

### DELETE `/api/labels/:id`
Delete a label.

## Filters

### GET `/api/filters`
Retrieve saved filters.

### POST `/api/filters`
Create a new filter.

### DELETE `/api/filters/:id`
Delete a filter.

## Comments (Planned)

### GET `/api/tasks/:id/comments`
Retrieve comments for a task.

### POST `/api/tasks/:id/comments`
Add a comment to a task.

## Attachments (Planned)

### POST `/api/tasks/:id/attachments`
Upload an attachment.

## Sync Engine

### GET `/api/sync`
Fetch updates since a given timestamp.

### POST `/api/sync`
Send local changes to the server.

## Integration with Dexie

The frontend interacts with the API via fetch/axios. While offline, changes are stored in the Sync Queue and sent to the server when back online.

## Error Handling

Standardized error responses:
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task does not exist",
    "details": {}
  }
}
```

## Rate Limiting

Planned rate limits for API access (per token/user).

| Endpoint Group | Rate Limit |
| --- | --- |
| Auth | 10 requests/minute |
| Tasks CRUD | 120 requests/minute |
| Projects | 60 requests/minute |

## Authentication Middleware

Express middleware verifies JWT tokens and attaches user context to requests.

## Environment Variables

```
PORT=4000
JWT_SECRET=super-secret
DATABASE_URL=postgres://...
```

## Deployment

The API can be deployed using Docker (see `Dockerfile`). Future deployment pipeline includes CI/CD with automated tests.
