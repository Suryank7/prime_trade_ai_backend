import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.user, response.data.accessToken);
      
      toast.success('Successfully logged in!', { theme: 'dark' });
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Invalid credentials.', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1635830625698-3b9bd74671ca?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-prime-dark/80 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 glass-panel p-8 rounded-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold neon-text mb-2">PRIME TRADE</h1>
          <p className="text-prime-textMuted">Welcome back. Authenticate to access dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-prime-textMuted mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" 
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-prime-textMuted mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center py-3 mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-prime-textMuted mt-8">
          Don't have an account? <Link to="/register" className="text-prime-accent hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
