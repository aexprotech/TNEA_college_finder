import React, { useState } from 'react';
import { GraduationCap, Menu, X, UserCircle, Chrome } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserData } from '../types/auth';
import LoginModal from './LoginModal';
interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isLoggedIn: boolean;
  userType: 'admin' | 'user' | null;
  onLogout: () => void;
  onLogin: (type: 'admin' | 'user') => void;  // Add this
}
const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection,
  isLoggedIn: propIsLoggedIn,
  userType: propUserType,
  onLogout: propOnLogout,
  onLogin: propOnLogin  // Add this
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
const getNavigationItems = () => {
  console.log('Current userType:', propUserType); // Add this for debugging
  
  const baseNavigation = [
    { name: 'Home', id: 'home' },
    { name: 'Search', id: 'search' }
  ];

  const userNavigation = [
    ...baseNavigation,
    { name: 'Wishlist', id: 'wishlist' }
  ];

  const adminNavigation = [
    ...baseNavigation,
    { name: 'Wishlist', id: 'wishlist' },
    { name: 'Debug', id: 'debug' },
    { name: 'Manage DB', id: 'manage' },
    { name: 'Analytics', id: 'analytics' }
  ];

  if (!propIsLoggedIn) return baseNavigation;
  return propUserType === 'admin' ? adminNavigation : userNavigation;
};
  const navigation = getNavigationItems();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      const newUserData: UserData = {
        id: googleUser.uid,
        email: googleUser.email || '',
        name: googleUser.displayName || '',
        photo: googleUser.photoURL || '',
        type: 'user'
      };
      
      setUserData(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));
      handleLogin('user');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
const handleLogin = (type: 'admin' | 'user') => {
    propOnLogin(type);  // Call the parent's login handler
    setIsLoginModalOpen(false);
  };


  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    setUserData(null);
    auth.signOut();
    propOnLogout();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tnea College Predictor</h1>
              <p className="text-sm text-gray-600">Tamil Nadu Engineering Colleges</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation */}
            <nav className="flex space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Auth Section */}
            {propIsLoggedIn ? (
              <div className="flex items-center space-x-3">
                {userData?.photo && propUserType === 'user' && (
                  <img
                    src={userData.photo}
                    alt={userData.name}
                    className="h-8 w-8 rounded-full border-2 border-gray-200"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {propUserType === 'admin' ? 'Admin' : userData?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Chrome className="h-5 w-5 text-red-500" />
                  <span>Sign in with Google</span>
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Login Button for Mobile */}
            {propIsLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center space-x-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Chrome className="h-4 w-4" />
                  <span>Sign in</span>
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm text-gray-600"
                >
                  Admin
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onLogin={(userData) => {
        handleLogin('admin');  // Always 'admin' for LoginModal
      }}
    />
    </header>
  );
};

export default Header;