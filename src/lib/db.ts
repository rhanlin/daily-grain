import Dexie, { type Table } from 'dexie';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  orderIndex: number;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  status: 'TODO' | 'DONE' | 'ARCHIVED';
  eisenhower: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  eisenhower: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  refId: string; // taskId or subTaskId
  refType: 'TASK' | 'SUBTASK';
  orderIndex: number;
  isRollover: boolean;
  updatedAt: string;
}

export class MyDatabase extends Dexie {
  categories!: Table<Category>;
  tasks!: Table<Task>;
  subtasks!: Table<SubTask>;
  dailyPlanItems!: Table<DailyPlanItem>;

  constructor() {
    super('PNoteDatabase');
    this.version(1).stores({
      categories: 'id, name, updatedAt, isArchived',
      tasks: 'id, categoryId, status, eisenhower, updatedAt',
      subtasks: 'id, taskId, updatedAt',
      dailyPlanItems: 'id, date, refId, updatedAt'
    });

    this.version(2).stores({
      tasks: 'id, categoryId, status, eisenhower, updatedAt, createdAt',
      subtasks: 'id, taskId, updatedAt, createdAt'
    }).upgrade(async tx => {
      // Populate createdAt for Tasks
      await tx.table('tasks').toCollection().modify(task => {
        if (!task.createdAt) {
          task.createdAt = task.updatedAt || new Date().toISOString();
        }
      });
      // Populate createdAt for SubTasks
      await tx.table('subtasks').toCollection().modify(subtask => {
        if (!subtask.createdAt) {
          subtask.createdAt = subtask.updatedAt || new Date().toISOString();
        }
      });
    });

    this.version(3).stores({
      categories: 'id, name, updatedAt, isArchived, orderIndex'
    }).upgrade(async tx => {
      // Initialize orderIndex for existing categories based on createdAt
      const categories = await tx.table('categories').toArray();
      // Sort by createdAt ascending to assign indices
      categories.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      
      for (let i = 0; i < categories.length; i++) {
        await tx.table('categories').update(categories[i].id, { orderIndex: i });
      }
    });
  }
}

export const db = new MyDatabase();