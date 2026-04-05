import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Master from './pages/Master.jsx';
import Billing from './pages/Billing.jsx';

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-7 bg-bg-primary">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/master/*" element={<Master />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}