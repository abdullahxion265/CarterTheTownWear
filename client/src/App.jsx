import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function ProtectedAdmin() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return <Admin />;
}

export default function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/browse"       element={<Browse />} />
        <Route path="/admin/login"  element={<AdminLogin />} />
        <Route path="/admin"        element={<ProtectedAdmin />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
