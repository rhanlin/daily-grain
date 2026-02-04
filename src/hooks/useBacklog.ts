import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Category, type Task, type SubTask } from '@/lib/db';

export interface BacklogGroup {
  category: Category;
  tasks: Task[];
  subtasks: SubTask[];
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
      
    // Filter tasks not in the plan, not archived, and status is TODO
    const backlogTasks = allTasks.filter(t => 
      t.status === 'TODO' && 
      !planRefIds.has(t.id)
    );

    // Filter subtasks not in the plan and not completed
    const backlogSubTasks = allSubTasks.filter(s => 
      !s.isCompleted && 
      !planRefIds.has(s.id)
    );

    // 4. Group by category
    const groups: BacklogGroup[] = categories.map(cat => {
      // Find tasks in this category that are in the backlog
      const catTasks = backlogTasks.filter(t => t.categoryId === cat.id);
      
      // Find subtasks that belong to ANY task in this category (even if the task itself is archived or scheduled)
      // BUT they must be in the backlogSubTasks list (unscheduled, incomplete)
      const catSubTasks = backlogSubTasks.filter(s => {
        const parentTask = allTasks.find(t => t.id === s.taskId);
        return parentTask?.categoryId === cat.id;
      });

      return {
        category: cat,
        tasks: catTasks,
        subtasks: catSubTasks
      };
    }).filter(group => group.tasks.length > 0 || group.subtasks.length > 0);

    return groups;
  }, [date]);

  return {
    groups: data || [],
    loading: data === undefined
  };
};