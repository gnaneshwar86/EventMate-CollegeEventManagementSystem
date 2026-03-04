import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import apiService from '../services/api';

const AdminAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const credentials = { username: formData.username, password: formData.password };
        const data = await apiService.adminLogin(credentials);

        console.log("JWT Token:", data.token);
        onAuthSuccess(data.token, data.admin);
        navigate('/admindashboard');
      } else {
        const payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        await apiService.adminRegister(payload);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center p-15">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#00809D]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">{isLogin ? 'Admin Login' : 'Register'}</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text" name="username" value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 py-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg" required />
              </div>
            </div>
          )}

          <div>
            <label>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-10 py-3 border rounded-lg" required />
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-[#00809D] text-white rounded-lg">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        {message && <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#FFD700] font-semibold hover:underline">
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [admin, setAdmin] = useState(null);

  const handleAuthSuccess = (token, adminData) => {
    setAdmin(adminData);
  };

  return !admin ? <AdminAuth onAuthSuccess={handleAuthSuccess} /> : <AdminDashboard admin={admin} />;
};

export default LoginPage;
