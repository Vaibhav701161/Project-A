import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Megaphone, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../lib/firebase';
import { UserTypeModal } from '../modals/UserTypeModal';

export function PublicHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setUserType = useAuthStore((state) => state.setUserType);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserType(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Megaphone className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LocAD</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <UserCircle className="h-8 w-8 text-blue-600" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <UserTypeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}