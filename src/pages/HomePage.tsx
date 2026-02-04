import React, { useState } from 'react';
import { CategoryOverview } from '@/features/categories/CategoryOverview';
import { CreateCategoryDrawer } from '@/features/categories/CreateCategoryDrawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [isCreateCatOpen, setIsCreateCatOpen] = useState(false);

  return (
    <div className="relative pt-2 pb-24 min-h-[calc(100vh-120px)]">
      {/* <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">分類概覽</h1>
        <p className="text-muted-foreground">組織您的所有任務與目標。</p>
      </header> */}

      <section>
        <CategoryOverview onOpenCreateCategory={() => setIsCreateCatOpen(true)} />
      </section>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl z-50 transition-transform active:scale-95" 
        size="icon"
        onClick={() => setIsCreateCatOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateCategoryDrawer 
        open={isCreateCatOpen} 
        onOpenChange={setIsCreateCatOpen} 
      />
    </div>
  );
};
