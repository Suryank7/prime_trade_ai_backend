import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Simple password strength check
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length > 7) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', { name, email, password });
      
      toast.success('Profile initialized! Please log in with your new credentials.', { theme: 'dark' });
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1635830625698-3b9bd74671ca?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-prime-dark/90 backdrop-blur-md"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 glass-panel p-8 rounded-2xl border-t border-prime-accent/30"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-prime-textMuted text-sm">Join the Prime Trade ecosystem</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-prime-textMuted mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field" 
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-prime-textMuted mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" 
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-prime-textMuted mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              placeholder="Create a strong password"
            />
            
            {/* Password Strength Meter */}
            <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-300 ${strength > 75 ? 'bg-green-500' : strength > 50 ? 'bg-yellow-500' : strength > 25 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <p className="text-xs text-prime-textMuted mt-1">Requires 8+ chars, uppercase, number & symbol</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || strength !== 100}
            className="w-full btn-primary flex items-center justify-center py-3 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Initialize Profile
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-prime-textMuted mt-6">
          Already registered? <Link to="/login" className="text-prime-purple hover:text-prime-accent transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
