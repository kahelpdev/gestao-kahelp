import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlanningPage from './pages/planning/PlanningPage';
import SprintsPage from './pages/sprints/SprintsPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import TeamsPage from './pages/teams/TeamsPage';
import HistoryPage from './pages/history/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/sprints" element={<SprintsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
