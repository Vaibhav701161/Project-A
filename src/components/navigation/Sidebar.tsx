import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const userType = useAuthStore((state) => state.userType);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      path: userType === 'business' ? '/influencers' : '/advertisements',
      label: userType === 'business' ? 'Influencers' : 'Advertisements',
      icon: Users
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: UserCircle
    },
    {
      path: '/support',
      label: 'Help & Support',
      icon: HelpCircle
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-xl",
          isExpanded ? "w-64" : "w-16",
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className={cn(
            "text-xl font-bold text-gray-900 transition-all duration-300",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}>
            LocAD
          </h2>
          <ChevronRight className={cn(
            "w-6 h-6 text-gray-400 transition-transform duration-300",
            isExpanded ? "rotate-180" : "rotate-0"
          )} />
        </div>
        
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-lg transition-all duration-200",
                "hover:bg-blue-50 hover:scale-105 transform",
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 min-w-[1.25rem] transition-transform duration-200",
                location.pathname === item.path && "scale-110"
              )} />
              <span className={cn(
                "transition-all duration-300",
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-2 w-full p-3 text-gray-600",
              "hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200",
              "hover:scale-105 transform"
            )}
          >
            <LogOut className="w-5 h-5 min-w-[1.25rem]" />
            <span className={cn(
              "transition-all duration-300",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Content margin */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "ml-64" : "ml-16"
      )} />
    </>
  );
}