import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
