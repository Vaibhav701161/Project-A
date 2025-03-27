import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserProfile } from '../hooks/useUserProfile';
import { PublicHeader } from './navigation/PublicHeader';
import { Sidebar } from './navigation/Sidebar';
import { Footer } from './navigation/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { hasCompletedOnboarding, loading } = useUserProfile();
  
  const isAuthPage = location.pathname.includes('/auth');
  const isOnboardingPage = location.pathname.includes('/onboarding');
  const shouldShowSidebar = user && hasCompletedOnboarding && !isAuthPage && !isOnboardingPage && !loading;

  // Don't show any navigation on auth and onboarding pages
  if (isAuthPage || isOnboardingPage) {
    return <>{children}</>;
  }

  // Show loading state while checking onboarding status
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowSidebar ? (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
      ) : (
        <>
          <PublicHeader />
          <main className="min-h-[calc(100vh-64px-80px)]">{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
}