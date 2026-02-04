import React from 'react';
import { EisenhowerMatrix } from '@/features/tasks/EisenhowerMatrix';

export const MatrixPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <EisenhowerMatrix />
    </div>
  );
};
