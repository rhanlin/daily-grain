import React from 'react';
import { useTask } from '@/hooks/useTask';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuadrantProps {
  title: string;
  tasks: any[];
  color: string;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, tasks, color }) => (
  <Card className={`h-full border-t-4`} style={{ borderTopColor: color }}>
    <CardHeader className="py-3 px-4">
      <CardTitle className="text-sm font-bold flex justify-between items-center">
        {title}
        <Badge variant="outline">{tasks.length}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 pt-0 space-y-1 max-h-[200px] overflow-y-auto">
      {tasks.map((task) => (
        <div key={task.id} className="text-xs p-2 bg-secondary/50 rounded-sm truncate">
          {task.title}
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-[10px] text-muted-foreground p-2 italic text-center">
          無任務
        </div>
      )}
    </CardContent>
  </Card>
);

export const EisenhowerMatrix: React.FC = () => {
  const { tasks } = useTask();

  const q1 = tasks.filter(t => t.eisenhower === 'Q1' && t.status !== 'DONE');
  const q2 = tasks.filter(t => t.eisenhower === 'Q2' && t.status !== 'DONE');
  const q3 = tasks.filter(t => t.eisenhower === 'Q3' && t.status !== 'DONE');
  const q4 = tasks.filter(t => t.eisenhower === 'Q4' && t.status !== 'DONE');

  return (
    <div className="grid grid-cols-2 gap-3 aspect-square max-w-2xl mx-auto">
      <Quadrant title="I. 重要且緊急" tasks={q1} color="#ef4444" />
      <Quadrant title="II. 重要但不緊急" tasks={q2} color="#3b82f6" />
      <Quadrant title="III. 不重要但緊急" tasks={q3} color="#f59e0b" />
      <Quadrant title="IV. 不重要也不緊急" tasks={q4} color="#10b981" />
    </div>
  );
};
