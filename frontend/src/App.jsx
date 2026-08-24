import { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import QAPage from './pages/QAPage';
import LessonPlannerPage from './pages/LessonPlannerPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'qa' && <QAPage />}
      {currentPage === 'lesson-planner' && <LessonPlannerPage />}
      {currentPage === 'settings' && <SettingsPage onNavigate={setCurrentPage} />}
    </Layout>
  );
}