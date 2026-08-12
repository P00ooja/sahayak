// 




import { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Layout>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'settings' && <SettingsPage onNavigate={setCurrentPage} />}
    </Layout>
  );
}