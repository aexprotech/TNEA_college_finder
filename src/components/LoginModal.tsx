// components/LoginModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserData } from '../types/auth';

// LoginModal.tsx
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: UserData) => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  if (!isOpen) return null;

    const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      const adminData: UserData = {
        id: 'admin',
        email: credentials.email,
        name: 'Administrator',
        type: 'admin'
      };
      onLogin(adminData);
      localStorage.setItem('userData', JSON.stringify(adminData));
      onClose();
    } else {
      alert('Invalid admin credentials');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            Admin Credentials:<br />
            Email: admin@example.com<br />
            Password: admin123
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;