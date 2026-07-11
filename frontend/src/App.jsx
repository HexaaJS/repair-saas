import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layout/AppLayout';

// Pages publiques
import Login from './pages/Login';
import Register from './pages/Register';
import Tracking from './pages/Tracking';
import Landing from './pages/Landing';

// Pages privées
import Dashboard from './pages/Dashboard';
import Repairs from './pages/Repairs';
import RepairDetail from './pages/RepairDetail';
import Clients from './pages/Clients';
import Shops from './pages/Shops';
import Settings from './pages/Settings';

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/landing" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/suivi/:token" element={<Tracking />} />

          {/* Privé */}
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/repairs" element={<PrivateRoute><AppLayout><Repairs /></AppLayout></PrivateRoute>} />
          <Route path="/repairs/:id" element={<PrivateRoute><AppLayout><RepairDetail /></AppLayout></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><AppLayout><Clients /></AppLayout></PrivateRoute>} />
          <Route path="/shops" element={<PrivateRoute><AppLayout><Shops /></AppLayout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><AppLayout><Settings /></AppLayout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;