import Dexie, { type Table } from 'dexie';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  status: 'TODO' | 'DONE' | 'ARCHIVED';
  eisenhower: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  updatedAt: string;
  completedAt?: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
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
  }
}

export const db = new MyDatabase();
