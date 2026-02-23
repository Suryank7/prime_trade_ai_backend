import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  LogOut, 
  Menu,
  X,
  User as UserIcon,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const { user } = useAuth();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <span className="text-xl font-bold neon-text">Prime</span>
          <button onClick={toggleSidebar} className="lg:hidden text-prime-textMuted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-prime-purple flex items-center justify-center text-white font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <div className="flex items-center mt-1">
                {user?.role === 'ADMIN' ? (
                  <span className="flex items-center text-[10px] uppercase font-bold text-prime-accent bg-prime-accent/10 px-2 py-0.5 rounded-full">
                    <ShieldAlert size={10} className="mr-1" /> Admin
                  </span>
                ) : (
                  <span className="flex items-center text-[10px] uppercase font-bold text-prime-textMuted bg-white/5 px-2 py-0.5 rounded-full">
                    <UserIcon size={10} className="mr-1" /> User
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          <div className="text-xs uppercase font-bold text-prime-textMuted tracking-wider mb-4 px-2">Main Menu</div>
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-prime-accent/10 text-prime-accent border border-prime-accent/20 font-medium' : 'text-prime-textMuted hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={18} className="mr-3" />
            Overview
          </NavLink>
          
          <NavLink 
            to="/dashboard/tasks"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-prime-accent/10 text-prime-accent border border-prime-accent/20 font-medium' : 'text-prime-textMuted hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <CheckSquare size={18} className="mr-3" />
            Assignments
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-fixed">
      <div className="absolute inset-0 bg-prime-dark/95 backdrop-blur-3xl z-0"></div>
      
      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Topbar */}
          <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-lg text-prime-textMuted hover:text-white transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Dynamic Back Button based on Route */}
              {!isHome && (
                <button 
                  onClick={() => navigate(-1)}
                  className="hidden sm:flex items-center text-sm font-medium text-prime-textMuted hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Go Back
                </button>
              )}

              <h2 className="text-xl font-medium text-white hidden md:block ml-4">
                Welcome back, <span className="text-prime-accent font-semibold">{user?.name.split(' ')[0]}</span>
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
               {/* Explicit Logout Button in Topbar */}
               <button 
                 onClick={logout}
                 className="flex items-center text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg transition-all"
               >
                 <LogOut size={16} className="mr-2 sm:mr-2" />
                 <span className="hidden sm:inline">Logout</span>
               </button>

               <div className="hidden sm:flex items-center ml-4 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                 <span className="text-xs text-green-400 uppercase tracking-wider font-semibold">Online</span>
               </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
