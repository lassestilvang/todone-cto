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
import { CommandPalette } from './features/command/CommandPalette';
import { QuickAddModal } from './features/tasks/QuickAddModal';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

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
          <Route path="project/:projectId" element={<ProjectView />} />
        </Route>

        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>

      <CommandPalette />
      <QuickAddModal />
    </BrowserRouter>
  );
};
