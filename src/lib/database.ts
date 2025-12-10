import Dexie, { Table } from 'dexie';
import type {
  ActivityLogEntry,
  Attachment,
  Comment,
  Filter,
  Label,
  Project,
  Section,
  SyncQueueItem,
  Task,
  Template,
  User,
} from '@/types';

export class TodoneDatabase extends Dexie {
  users!: Table<User>;
  projects!: Table<Project>;
  sections!: Table<Section>;
  tasks!: Table<Task>;
  labels!: Table<Label>;
  filters!: Table<Filter>;
  comments!: Table<Comment>;
  attachments!: Table<Attachment>;
  templates!: Table<Template>;
  activityLog!: Table<ActivityLogEntry>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('todone');
    this.version(1).stores({
      users: '&id, email',
      projects: '&id, userId, favorite, parentProjectId',
      sections: '&id, projectId',
      tasks:
        '&id, projectId, sectionId, parentTaskId, userId, completed, dueDate, priority, labels',
      labels: '&id, userId, name',
      filters: '&id, userId, favorite',
      comments: '&id, taskId, userId',
      attachments: '&id, taskId',
      templates: '&id, userId, category',
      activityLog: '&id, userId, entityType, entityId',
      syncQueue: '&id, entityType, action, synced',
    });

    this.version(2).stores({
      users: '&id, email',
      projects: '&id, userId, favorite, parentProjectId, order',
      sections: '&id, projectId, order',
      tasks:
        '&id, projectId, sectionId, parentTaskId, userId, completed, dueDate, priority, labels, order',
      labels: '&id, userId, name',
      filters: '&id, userId, favorite, name',
      comments: '&id, taskId, userId',
      attachments: '&id, taskId',
      templates: '&id, userId, category',
      activityLog: '&id, userId, entityType, entityId',
      syncQueue: '&id, entityType, action, synced',
    });
  }
}

export const db = new TodoneDatabase();
