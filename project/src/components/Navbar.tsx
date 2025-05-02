import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, UserCircle, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const cartCount = getCartCount();
  
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/home" : "/login"} className="flex items-center">
              <Car size={24} className="mr-2" />
              <span className="font-bold text-xl">CruiseRentals</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  Cars
                </Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  My Bookings
                </Link>
                <Link to="/cart" className="px-3 py-2 rounded-md hover:bg-blue-700 transition relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group px-3 py-2">
                  <div className="flex items-center cursor-pointer">
                    <UserCircle size={20} className="mr-2" />
                    <span>{user?.name}</span>
                  </div>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-10 hidden group-hover:block">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/home" 
                  className="block px-3 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cars
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center px-3 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="border-t border-blue-700 my-2"></div>
                <div className="px-3 py-2">
                  Signed in as: {user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;