import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './features/views/AuthPage';
import { InboxView } from './features/views/InboxView';
import { TodayView } from './features/views/TodayView';
import { UpcomingView } from './features/views/UpcomingView';
import { ProjectView } from './features/views/ProjectView';
import { LabelsView } from './features/views/LabelsView';
import { FiltersView } from './features/views/FiltersView';
import { ProductivityView } from './features/views/ProductivityView';
import { SettingsView } from './features/views/SettingsView';
import { CommandPalette } from './features/command/CommandPalette';
import { QuickAddModal } from './features/tasks/QuickAddModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { useUIStore } from './stores/useUIStore';
import { useTaskStore } from './stores/useTaskStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { selectedTaskId, isTaskDetailOpen, closeTaskDetail } = useUIStore();
  const { getTaskById } = useTaskStore();

  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) ?? null : null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/today" replace /> : <AuthPage />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="inbox" element={<InboxView />} />
          <Route path="today" element={<TodayView />} />
          <Route path="upcoming" element={<UpcomingView />} />
          <Route path="filters" element={<FiltersView />} />
          <Route path="labels" element={<LabelsView />} />
          <Route path="productivity" element={<ProductivityView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="project/:projectId" element={<ProjectView />} />
        </Route>

        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>

      <CommandPalette />
      <QuickAddModal />
      <TaskDetailModal task={selectedTask} isOpen={isTaskDetailOpen} onClose={closeTaskDetail} />
    </BrowserRouter>
  );
};
