import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { repository } from '@/lib/repository';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface DesktopQuickAddProps {
  selectedDate: string;
}

export const DesktopQuickAdd: React.FC<DesktopQuickAddProps> = ({ selectedDate }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await repository.subtasks.quickCreate(
        title.trim(),
        selectedDate
      );
      setTitle('');
      toast.success('已新增任務');
    } catch (err) {
      console.error(err);
      toast.error('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-b bg-card/50">
      <form onSubmit={handleSubmit} className="relative group">
        <Input
          placeholder="快速新增子任務..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="pr-10 h-10 border-dashed focus-visible:border-solid transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary disabled:opacity-0 transition-all"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
      <p className="text-[10px] text-muted-foreground mt-2 px-1">
        按 Enter 鍵快速新增至今日計畫
      </p>
    </div>
  );
};
