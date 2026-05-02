import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Discover Kazakhstan</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/hotels" className="text-gray-700! hover:text-blue-600 transition">
            Hotels
          </Link>
          <Link to="/destinations" className="text-gray-700! hover:text-blue-600 transition">
            Destinations
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/bookings" className="text-gray-700! hover:text-blue-600 transition">
                My Bookings
              </Link>
              <div className="text-sm text-gray-600!">{user.email}</div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-700! hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-800 text-white! rounded hover:from-blue-700 hover:to-blue-900 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-4">
            <Link to="/hotels" className="block text-gray-700 hover:text-blue-600">
              Hotels
            </Link>
            <Link to="/destinations" className="block text-gray-700 hover:text-blue-600">
              Destinations
            </Link>
            {user ? (
              <>
                <Link to="/bookings" className="block text-gray-700 hover:text-blue-600">
                  My Bookings
                </Link>
                <div className="text-sm text-gray-600">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
