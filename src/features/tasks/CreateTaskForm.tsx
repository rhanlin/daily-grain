import React, { useState } from 'react';
import { useTask } from '@/hooks/useTask';
import { useCategory } from '@/hooks/useCategory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

export const CreateTaskForm: React.FC = () => {
  const { categories } = useCategory();
  const { createTask } = useTask();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      await createTask(categoryId, title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="選擇分類" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input 
        className="flex-1"
        placeholder="想要完成什麼任務？" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" disabled={!title.trim() || !categoryId}>
        <Plus className="h-4 w-4 mr-1" />
        新增
      </Button>
    </form>
  );
};
