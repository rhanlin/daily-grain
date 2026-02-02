import React from 'react';
import { EisenhowerMatrix } from '@/features/tasks/EisenhowerMatrix';

export const MatrixPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">艾森豪矩陣</h2>
        <p className="text-muted-foreground">檢視所有任務的優先順序</p>
      </div>
      <EisenhowerMatrix />
    </div>
  );
};
