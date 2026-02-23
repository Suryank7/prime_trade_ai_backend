import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { Layers, CheckCircle2, ListTodo, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/tasks');
        const tasks = response.data.data;
        
        setStats({
          total: tasks.length,
          completed: tasks.filter((t: any) => t.status === 'COMPLETED').length,
          pending: tasks.filter((t: any) => t.status === 'PENDING').length
        });
      } catch (error) {
        console.error("Failed to load task stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 bg-${color}-500 blur-2xl`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-prime-textMuted text-sm font-medium mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div>
          ) : (
            <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
          <p className="text-prime-textMuted text-sm">Real-time metrics for your assigned modules.</p>
        </div>
        
        <div className="glass-panel px-4 py-2 rounded-lg flex items-center space-x-3 w-fit border-prime-accent/20">
          <Activity className="text-prime-accent" size={16} />
          <span className="text-sm font-mono text-prime-accent">Status: Nominal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Total Modules" value={stats.total} icon={Layers} color="prime-accent" delay={0.1} />
            <StatCard title="Resolved" value={stats.completed} icon={CheckCircle2} color="green" delay={0.2} />
            <StatCard title="Active Pending" value={stats.pending} icon={ListTodo} color="orange" delay={0.3} />
          </div>
        </div>

        {/* Right Column: Profile */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6 border border-white/5 h-fit"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-prime-purple to-prime-accent rounded-full p-1 mb-4">
              <div className="w-full h-full bg-prime-dark rounded-full flex items-center justify-center">
                <UserIcon size={32} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${user?.role === 'ADMIN' ? 'bg-prime-accent/20 text-prime-accent' : 'bg-white/10 text-prime-textMuted'}`}>
              {user?.role} CLEARANCE
            </span>
          </div>
          
          <div className="space-y-4 mt-8 text-sm">
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <span className="block text-xs text-prime-textMuted mb-1">ID Badge</span>
              <span className="font-mono text-white break-all">{user?.id}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <span className="block text-xs text-prime-textMuted mb-1">Secure Contact</span>
              <span className="text-white break-all">{user?.email}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Extracted from Lucide manually to fix compilation without top import
import { User as UserIcon } from 'lucide-react';

export default Dashboard;
