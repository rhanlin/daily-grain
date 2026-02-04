import React from 'react';
import { useCategorySummary } from '@/hooks/useCategorySummary';
import { CategoryCard } from './CategoryCard';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CategoryOverview: React.FC = () => {
  const summaries = useCategorySummary();
  const navigate = useNavigate();

  if (summaries === undefined) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed rounded-lg">
        <FolderPlus className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">尚無分類</h3>
          <p className="text-muted-foreground">建立一個分類來開始組織您的任務。</p>
        </div>
        <Button onClick={() => navigate('/matrix')}>前往矩陣頁面建立</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaries.map((cat) => (
        <CategoryCard 
          key={cat.id} 
          category={cat} 
          onClick={() => navigate(`/category/${cat.id}`)}
        />
      ))}
    </div>
  );
};
