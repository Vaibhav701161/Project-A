import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { UserTypeSelector } from '../components/auth/UserTypeSelector';
import { useAuthStore } from '../store/authStore';
import { signIn, signUp } from '../services/auth';

export function Auth() {
  const { userType: initialUserType } = useParams<{ userType: 'influencer' | 'business' }>();
  const [isLogin, setIsLogin] = useState(true);
  const [showTypeSelector, setShowTypeSelector] = useState(!isLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setUserType = useAuthStore((state) => state.setUserType);

  const handleUserTypeSelect = (type: 'influencer' | 'business') => {
    setUserType(type);
    setShowTypeSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = isLogin 
        ? await signIn(email, password, initialUserType!)
        : await signUp(email, password, name, initialUserType!);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.user) {
        setUser(result.user);
        setUserType(result.userType);
        
        // For new sign ups or users who haven't completed onboarding, redirect to onboarding
        if (!isLogin || !result.hasCompletedOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowTypeSelector(!isLogin);
    setError('');
  };

  return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {showTypeSelector ? (
          <UserTypeSelector onSelect={handleUserTypeSelect} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isLogin ? 'Sign in to continue to LocAD' : 'Join LocAD today'}
              </p>
            </div>

            <AuthForm
              isLogin={isLogin}
              email={email}
              password={password}
              name={name}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onNameChange={(e) => setName(e.target.value)}
              onSubmit={handleSubmit}
              onToggleMode={() => setIsLogin(!isLogin)}
            />
          </>
        )}
      </div>
    </div>
  );
}