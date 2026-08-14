import { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import QAPage from './pages/QAPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Layout>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'qa' && <QAPage />}
      {currentPage === 'settings' && <SettingsPage onNavigate={setCurrentPage} />}
    </Layout>
  );
}