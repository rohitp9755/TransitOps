import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Drivers from './pages/Drivers.jsx';
import Trips from './pages/Trips.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Expenses from './pages/Expenses.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';

// Each app route is gated by the RBAC module it belongs to; ProtectedRoute
// redirects unauthenticated users to /login and unauthorized roles to /.
const ROUTES = [
  { path: '/', element: <Dashboard />, module: 'dashboard' },
  { path: '/fleet', element: <Vehicles />, module: 'fleet' },
  { path: '/drivers', element: <Drivers />, module: 'drivers' },
  { path: '/trips', element: <Trips />, module: 'trips' },
  { path: '/maintenance', element: <Maintenance />, module: 'maintenance' },
  { path: '/expenses', element: <Expenses />, module: 'expenses' },
  { path: '/analytics', element: <Analytics />, module: 'analytics' },
  { path: '/settings', element: <Settings />, module: 'settings' },
];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {ROUTES.map(({ path, element, module }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute module={module}>{element}</ProtectedRoute>}
              />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
