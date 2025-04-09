import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Overview } from './pages/dashboard/Overview';
import { Advertisements } from './pages/dashboard/Advertisements';
import { Influencers } from './pages/dashboard/Influencers';
import { Profile } from './pages/Profile';
import { Support } from './pages/Support';
import { PaymentHistory } from './pages/PaymentHistory';
import { PaymentTest } from './pages/PaymentTest';
import { CampaignDetail } from './pages/dashboard/CampaignDetail';
import { StripeProvider } from './components/payment/StripeProvider';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <StripeProvider>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/:userType" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Protected routes that require authentication but not onboarding */}
            <Route path="/onboarding" element={
              <ProtectedRoute requiresOnboarding={false}>
                <Onboarding />
              </ProtectedRoute>
            } />

            {/* Protected routes that require both authentication and completed onboarding */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } />
            <Route path="/advertisements" element={
              <ProtectedRoute>
                <Advertisements />
              </ProtectedRoute>
            } />
            <Route path="/influencers" element={
              <ProtectedRoute>
                <Influencers />
              </ProtectedRoute>
            } />
            <Route path="/campaigns/:id" element={
              <ProtectedRoute>
                <CampaignDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/payment-history" element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            } />
            <Route path="/payment-test" element={
              <ProtectedRoute>
                <PaymentTest />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </StripeProvider>
    </BrowserRouter>
  );
}

export default App;