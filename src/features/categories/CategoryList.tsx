import React, { useState } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Folder } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TaskList } from '../tasks/TaskList';

export const CategoryList: React.FC = () => {
  const { categories, createCategory } = useCategory();
  const [newCatName, setNewCatName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (newCatName.trim()) {
      await createCategory(newCatName, '#3b82f6'); // Default blue
      setNewCatName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5" />
          主題分類
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新增分類
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>建立新分類</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                placeholder="分類名稱" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={handleCreate}>建立</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: cat.color }}
              />
              <CardTitle className="text-base">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList categoryId={cat.id} />
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">尚未建立任何分類</p>
        )}
      </div>
    </div>
  );
};
