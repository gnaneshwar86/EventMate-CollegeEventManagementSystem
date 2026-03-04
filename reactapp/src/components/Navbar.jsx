import React from 'react';
import { Calendar, Search, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const isAuthenticated = !!localStorage.getItem('adminToken');

  const handleLogout = () => {
    showNotification(
      'confirm',
      'Logout',
      'Are you sure you want to log out from the Admin Dashboard?',
      () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/');
      }
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[15vh] z-50 text-white shadow-lg"
      style={{ background: 'linear-gradient(90deg, #00809D, #006B7A)' }}>
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-[#FFD700]">
            <Calendar className="w-6 h-6" style={{ color: '#00809D' }} />
          </div>
          <h1 className="text-2xl font-bold">EventMate</h1>
        </div>

        <div className="flex items-center space-x-4">
          {location.pathname !== '/admindashboard' && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#00809D' }} />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 text-gray-800"
                style={{ backgroundColor: '#FFD700' }}
              />
            </div>
          )}

          {!isAuthenticated ? (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg font-semibold bg-[#FFD700] text-[#00809D] hover:opacity-90">
              Admin Login
            </button>
          ) : location.pathname === '/admindashboard' ? (
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 bg-[#FFD700] text-[#00809D] hover:opacity-90"
                onClick={() => navigate('/addEvent')}
              >
                <Plus className="w-4 h-4" />
                <span>New Event</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 bg-red-500 text-white hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/admindashboard')}
              className="px-4 py-2 rounded-lg font-semibold bg-[#FFD700] text-[#00809D] hover:opacity-90">
              Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
