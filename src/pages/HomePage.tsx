import { CategoryList } from '@/features/categories/CategoryList';
import { CreateTaskForm } from '@/features/tasks/CreateTaskForm';
import { Separator } from '@/components/ui/separator';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold">快速新增任務</h2>
        <CreateTaskForm />
      </section>
      
      <Separator />

      <section>
        <CategoryList />
      </section>
    </div>
  );
};
