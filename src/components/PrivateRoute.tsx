import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth, loading } = useAuth();

  if(loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;

  if(!auth) return <Navigate to="/login" replace />;

  return <>{children}</>;
}