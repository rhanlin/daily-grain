import { type BacklogGroup } from '@/hooks/useBacklog';

/**
 * Filters backlog groups based on the hideRoutine toggle.
 * Excludes subtasks with type 'daily' and removes categories that become empty.
 */
export const filterBacklogGroups = (
  groups: BacklogGroup[],
  hideRoutine: boolean
): BacklogGroup[] => {
  if (!hideRoutine) return groups;

  return groups
    .map((group) => {
      // Filter subtasks to exclude 'daily' type
      const filteredSubtasks = group.subtasks.filter((sub) => sub.type !== 'daily');

      // Filter tasks to only include those that still have subtasks after filtering
      // (assuming tasks in BacklogGroup are those that have subtasks)
      const filteredTasks = group.tasks.filter((task) =>
        filteredSubtasks.some((sub) => sub.taskId === task.id)
      );

      return {
        ...group,
        tasks: filteredTasks,
        subtasks: filteredSubtasks,
      };
    })
    .filter((group) => group.tasks.length > 0);
};
