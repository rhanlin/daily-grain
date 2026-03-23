import { describe, it, expect } from 'vitest';
import { filterBacklogGroups } from '../BacklogLogic';
import { type BacklogGroup } from '@/hooks/useBacklog';
import { type Category, type Task, type SubTask } from '@/lib/db';

describe('filterBacklogGroups', () => {
  const mockCategory: Category = {
    id: 'cat1',
    name: 'Work',
    color: '#ff0000',
    createdAt: '',
    updatedAt: '',
    isArchived: false,
    orderIndex: 0
  };

  const mockTasks: Task[] = [
    { id: 't1', title: 'Task 1', categoryId: 'cat1', status: 'TODO', description: '', eisenhower: 'Q1', createdAt: '', updatedAt: '' },
    { id: 't2', title: 'Task 2', categoryId: 'cat1', status: 'TODO', description: '', eisenhower: 'Q2', createdAt: '', updatedAt: '' }
  ];

  const mockSubtasks: SubTask[] = [
    { id: 's1', title: 'Sub 1', taskId: 't1', isCompleted: false, type: 'one-time', eisenhower: 'Q1', createdAt: '', updatedAt: '', isArchived: false },
    { id: 's2', title: 'Sub 2', taskId: 't1', isCompleted: false, type: 'daily', eisenhower: 'Q1', createdAt: '', updatedAt: '', isArchived: false },
    { id: 's3', title: 'Sub 3', taskId: 't2', isCompleted: false, type: 'daily', eisenhower: 'Q2', createdAt: '', updatedAt: '', isArchived: false }
  ];

  const mockGroups: BacklogGroup[] = [
    {
      category: mockCategory,
      tasks: mockTasks,
      subtasks: mockSubtasks
    }
  ];

  it('should return all groups when hideRoutine is false', () => {
    const result = filterBacklogGroups(mockGroups, false);
    expect(result).toEqual(mockGroups);
  });

  it('should filter out daily subtasks and empty tasks when hideRoutine is true', () => {
    const result = filterBacklogGroups(mockGroups, true);
    
    expect(result).toHaveLength(1);
    expect(result[0].subtasks).toHaveLength(1);
    expect(result[0].subtasks[0].id).toBe('s1');
    
    expect(result[0].tasks).toHaveLength(1);
    expect(result[0].tasks[0].id).toBe('t1');
  });

  it('should remove category group if no tasks remain after filtering', () => {
    const onlyDailyGroups: BacklogGroup[] = [
      {
        category: mockCategory,
        tasks: [mockTasks[1]],
        subtasks: [mockSubtasks[2]] // Only daily
      }
    ];
    
    const result = filterBacklogGroups(onlyDailyGroups, true);
    expect(result).toHaveLength(0);
  });
});
