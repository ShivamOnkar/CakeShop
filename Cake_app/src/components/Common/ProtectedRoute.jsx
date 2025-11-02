// src/components/Common/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;