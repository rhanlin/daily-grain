import React, { useState } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { type Category } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Folder, Pencil, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TaskList } from '../tasks/TaskList';

export const CategoryList: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategory();
  const [newCatName, setNewCatName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (newCatName.trim()) {
      await createCategory(newCatName, '#3b82f6'); // Default blue
      setNewCatName('');
      setIsDialogOpen(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = async (id: string) => {
    if (editName.trim()) {
      await updateCategory(id, { name: editName });
      setEditingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteCategory(deleteId);
      setDeleteId(null);
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
          <Card key={cat.id} className="hover:border-primary transition-colors group relative">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: cat.color }}
              />
              {editingId === cat.id ? (
                <Input 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => saveEdit(cat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                  autoFocus
                  className="h-8"
                />
              ) : (
                <CardTitle className="text-base flex-1">{cat.name}</CardTitle>
              )}
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(cat)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDeleteClick(cat.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
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

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除分類？</DialogTitle>
            <DialogDescription>
              確定要刪除此分類嗎？包含的所有任務都會被封存。此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete}>確認刪除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
