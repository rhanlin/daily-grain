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
    
    // 2. Fetch ALL daily plan items (all dates) to filter them out globally
    const allPlanItems = await db.dailyPlanItems.toArray();
    const globalPlanRefIds = new Set(allPlanItems.map(item => item.refId));
    
    // 3. Fetch all tasks and subtasks
    const allTasks = await db.tasks.toArray();
    const allSubTasks = await db.subtasks.toArray();
      
    // Filter subtasks not in ANY plan and not completed (unless multi-time/daily)
    const backlogSubTasks: any[] = [];
    for (const s of allSubTasks) {
        // One-time: exclude if completed or scheduled
        if (s.type === 'one-time' || !s.type) {
            if (!s.isCompleted && !globalPlanRefIds.has(s.id)) {
                backlogSubTasks.push({ ...s, completedCount: 0 });
            }
        } else {
            // Multi-time / Daily: Always show in backlog if NOT archived
            // T016: Include progress for backlog display
            const completedCount = allPlanItems
                .filter(item => item.refId === s.id && item.isCompleted)
                .length;
            
            backlogSubTasks.push({ ...s, completedCount });
        }
    }

    // 4. Group by category
    const groups: BacklogGroup[] = categories.map(cat => {
      // Find all tasks in this category that are TODO (not archived/done)
      const catTasks = allTasks.filter(t => t.categoryId === cat.id && t.status === 'TODO');
      
      // Find subtasks belonging to this category's tasks that are in the backlog
      const catSubTasks = backlogSubTasks.filter(s => {
        const parentTask = allTasks.find(t => t.id === s.taskId);
        return parentTask?.categoryId === cat.id && parentTask?.status !== 'ARCHIVED';
      });

      // FR-003 & FR-004: Only include parent Tasks that have at least one visible subtask
      const tasksWithSubtasks = catTasks.filter(t => 
        catSubTasks.some(s => s.taskId === t.id)
      );

      return {
        category: cat,
        tasks: tasksWithSubtasks,
        subtasks: catSubTasks
      };
    }).filter(group => group.tasks.length > 0);

    return groups;
  }, [date]);

  return {
    groups: data || [],
    loading: data === undefined
  };
};
