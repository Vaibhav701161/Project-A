import React from 'react';
import { Users, Building2, Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  name: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export function AuthForm({
  isLogin,
  email,
  password,
  name,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  onToggleMode
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        {isLogin ? 'Sign In' : 'Create Account'}
      </button>

      <button
        type="button"
        onClick={onToggleMode}
        className="w-full text-sm text-blue-600 hover:text-blue-800"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </form>
  );
}