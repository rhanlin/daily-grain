import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MousePointer2, Target } from 'lucide-react';

interface MatrixItem {
  id: string;
  title: string;
  eisenhower: string;
  type: 'TASK' | 'SUBTASK';
  parentId?: string;
  status?: string;
  isCompleted?: boolean;
}

interface QuadrantProps {
  title: string;
  items: MatrixItem[];
  color: string;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, items, color, focusedId, onFocus }) => (
  <Card className={`h-full border-t-4 flex flex-col overflow-hidden`} style={{ borderTopColor: color }}>
    <CardHeader className="py-2 px-3 bg-secondary/10 border-b">
      <CardTitle className="text-[10px] sm:text-xs font-bold flex justify-between items-center uppercase tracking-wider">
        {title}
        <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 space-y-1 flex-1 overflow-y-auto bg-background/50">
      {items.map((item) => {
        const isRelated = focusedId === null || item.id === focusedId || item.parentId === focusedId;
        return (
          <div 
            key={item.id} 
            onClick={() => onFocus(item.type === 'TASK' ? (focusedId === item.id ? null : item.id) : null)}
            className={`
              text-[10px] sm:text-xs p-2 rounded border shadow-sm transition-all cursor-pointer
              ${item.type === 'TASK' ? 'font-bold bg-card' : 'italic bg-muted/30 ml-2 border-dashed'}
              ${!isRelated ? 'opacity-20 grayscale' : 'opacity-100 scale-100'}
              ${item.id === focusedId ? 'ring-2 ring-primary border-primary' : 'border-border'}
            `}
          >
            <div className="flex items-center gap-1">
              {item.type === 'SUBTASK' && <MousePointer2 className="h-2 w-2" />}
              <span className="truncate">{item.title}</span>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="text-[10px] text-muted-foreground p-4 italic text-center">
          無項目
        </div>
      )}
    </CardContent>
  </Card>
);

export const EisenhowerMatrix: React.FC = () => {
  const [viewFilter, setViewFilter] = useState<'ALL' | 'TASK' | 'SUBTASK'>('ALL');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const allItems = useLiveQuery(async () => {
    const tasks = await db.tasks.where('status').anyOf('TODO', 'DONE').toArray();
    const subtasks = await db.subtasks.toArray();

    const matrixTasks: MatrixItem[] = tasks.map(t => ({
      id: t.id,
      title: t.title,
      eisenhower: t.eisenhower,
      type: 'TASK',
      status: t.status
    }));

    const matrixSubs: MatrixItem[] = subtasks.map(s => ({
      id: s.id,
      title: s.title,
      eisenhower: s.eisenhower || 'Q4',
      type: 'SUBTASK',
      parentId: s.taskId,
      isCompleted: s.isCompleted
    }));

    return [...matrixTasks, ...matrixSubs];
  });

  const items = allItems || [];
  
  const filteredItems = items.filter(item => {
    if (viewFilter === 'TASK') return item.type === 'TASK';
    if (viewFilter === 'SUBTASK') return item.type === 'SUBTASK';
    return true;
  });

  const getQuadrantItems = (q: string) => filteredItems.filter(i => i.eisenhower === q);

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>點擊任務可鎖定關聯子任務</span>
        </div>
        <Tabs value={viewFilter} onValueChange={(v) => setViewFilter(v as 'ALL' | 'TASK' | 'SUBTASK')}>
          <TabsList className="scale-90 origin-right">
            <TabsTrigger value="ALL">全部</TabsTrigger>
            <TabsTrigger value="TASK">僅任務</TabsTrigger>
            <TabsTrigger value="SUBTASK">僅子任務</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-1 min-h-0">
        <Quadrant 
          title="I. 重要且緊急" 
          items={getQuadrantItems('Q1')} 
          color="#ef4444" 
          focusedId={focusedId}
          onFocus={setFocusedId}
        />
        <Quadrant 
          title="II. 重要但不緊急" 
          items={getQuadrantItems('Q2')} 
          color="#3b82f6" 
          focusedId={focusedId}
          onFocus={setFocusedId}
        />
        <Quadrant 
          title="III. 不重要但緊急" 
          items={getQuadrantItems('Q3')} 
          color="#f59e0b" 
          focusedId={focusedId}
          onFocus={setFocusedId}
        />
        <Quadrant 
          title="IV. 不重要也不緊急" 
          items={getQuadrantItems('Q4')} 
          color="#10b981" 
          focusedId={focusedId}
          onFocus={setFocusedId}
        />
      </div>
    </div>
  );
};
