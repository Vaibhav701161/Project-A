import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BusinessOnboarding } from './onboarding/BusinessOnboarding';
import { InfluencerOnboarding } from './onboarding/InfluencerOnboarding';
import { useUserProfile } from '../hooks/useUserProfile';
import { Layout } from '../components/Layout';

export function Onboarding() {
  const navigate = useNavigate();
  const userType = useAuthStore((state) => state.userType);
  const { hasCompletedOnboarding } = useUserProfile();

  // Redirect to dashboard if onboarding is already completed
  React.useEffect(() => {
    if (hasCompletedOnboarding) {
      navigate('/dashboard');
    }
  }, [hasCompletedOnboarding, navigate]);

  if (!userType) return null;

  return (
    <Layout>
      {userType === 'business' ? <BusinessOnboarding /> : <InfluencerOnboarding />}
    </Layout>
  );
}