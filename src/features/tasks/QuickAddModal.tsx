import { Modal } from '@/components/ui/Modal';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import { useUIStore } from '@/stores/useUIStore';

export const QuickAddModal: React.FC = () => {
  const { isQuickAddOpen, closeQuickAdd } = useUIStore();

  return (
    <Modal isOpen={isQuickAddOpen} onClose={closeQuickAdd} title="Quick add task" className="max-w-2xl">
      <TaskComposer autoFocus />
    </Modal>
  );
};
