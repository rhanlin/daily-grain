import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Category, type Task } from '@/lib/db';

export interface BacklogGroup {
  category: Category;
  tasks: Task[];
  subtasks: any[]; // We'll handle subtasks if needed later, focusing on Task grouping for now
}

export const useBacklog = (date: string) => {
  const data = useLiveQuery(async () => {
    // 1. Fetch all active categories
    const categories = await db.categories.filter(c => !c.isArchived).toArray();
    
    // 2. Fetch all daily plan items for the date to filter them out
    const planItems = await db.dailyPlanItems.where('date').equals(date).toArray();
    const planRefIds = new Set(planItems.map(item => item.refId));
    
    // 3. Fetch all tasks and subtasks
    const allTasks = await db.tasks.toArray();
    const allSubTasks = await db.subtasks.toArray();
      
    // Filter subtasks not in the plan and not completed
    const backlogSubTasks = allSubTasks.filter(s => !s.isCompleted && !planRefIds.has(s.id));

    // 4. Group by category
    const groups: BacklogGroup[] = categories.map(cat => {
      // Find all tasks in this category
      const catTasks = allTasks.filter(t => t.categoryId === cat.id);
      
      // Filter subtasks that belong to these tasks AND are not in plan AND not completed
      const catSubTasks = backlogSubTasks.filter(s => {
        const parentTask = catTasks.find(t => t.id === s.taskId);
        return !!parentTask;
      });

      // Filter parent tasks that have at least one visible subtask
      const tasksWithSubtasks = catTasks.filter(t => {
        return catSubTasks.some(s => s.taskId === t.id);
      });

      return {
        category: cat,
        tasks: tasksWithSubtasks,
        subtasks: catSubTasks
      };
    }).filter(group => group.subtasks.length > 0);

    return groups;
  }, [date]);

  return {
    groups: data || [],
    loading: data === undefined
  };
};
