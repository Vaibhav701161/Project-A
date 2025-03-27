import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserProfile } from '../../hooks/useUserProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

export function ProtectedRoute({ children, requiresOnboarding = true }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { hasCompletedOnboarding, loading } = useUserProfile();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiresOnboarding && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}