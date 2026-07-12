import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from './ui.jsx';

/** Blocks unauthenticated users; optionally requires view access to a module. */
export function ProtectedRoute({ children, module }) {
  const { user, loading, can } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Restoring session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Role lacks access to this section — send them to the dashboard.
  if (module && !can(module, 'view')) return <Navigate to="/" replace />;

  return children;
}
