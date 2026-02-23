import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, Filter, Search } from 'lucide-react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  user?: { name: string, email: string };
}

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [status, setStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Failed to load tasks', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('PENDING');
    setEditingTask(null);
  };

  const openModalForCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModalForEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setStatus(task.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await apiClient.put(`/tasks/${editingTask.id}`, {
          title, description, priority, status
        });
        toast.success('Task updated successfully', { theme: 'dark' });
      } else {
        await apiClient.post('/tasks', {
          title, description, priority
        });
        toast.success('Task created successfully', { theme: 'dark' });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save task', { theme: 'dark' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiClient.delete(`/tasks/${id}`);
      toast.success('Task deleted', { theme: 'dark' });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task', { theme: 'dark' });
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update status', { theme: 'dark' });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (user?.role === 'ADMIN' && task.user?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'LOW': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
          <p className="text-prime-textMuted text-sm">
             {user?.role === 'ADMIN' ? 'Manage all organizational assignments globally.' : 'Manage your personal active assignments.'}
          </p>
        </div>
        
        <button onClick={openModalForCreate} className="btn-primary flex items-center shrink-0">
          <Plus size={18} className="mr-2" />
          Create Context
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-prime-textMuted" size={18} />
          <input 
            type="text" 
            placeholder={user?.role === 'ADMIN' ? "Search tasks or users..." : "Search assignments..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-prime-dark/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-prime-textMuted focus:outline-none focus:border-prime-accent transition-colors"
          />
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="text-prime-textMuted" size={18} />
          <select 
            value={filterStatus} 
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="bg-prime-dark/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-prime-accent appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel h-48 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-white/5">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckSquare size={32} className="text-prime-textMuted" />
           </div>
           <h3 className="text-xl text-white font-medium mb-2">No tasks found</h3>
           <p className="text-prime-textMuted mb-6">Create a new assignment to get started.</p>
           <button onClick={openModalForCreate} className="btn-secondary">Initialize Context</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`glass-panel p-6 rounded-xl relative group transition-all duration-300 hover:border-prime-accent/30 ${
                  task.status === 'COMPLETED' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModalForEdit(task)} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-blue-400 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-1.5 bg-white/10 rounded hover:bg-red-500/20 text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 transition-colors ${task.status === 'COMPLETED' ? 'line-through text-prime-textMuted' : 'text-white'}`}>
                  {task.title}
                </h3>
                
                <p className="text-sm text-prime-textMuted mb-6 line-clamp-2 min-h-[40px]">
                  {task.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center text-xs text-prime-textMuted">
                    {user?.role === 'ADMIN' && task.user ? (
                       <span className="flex items-center bg-white/5 px-2 py-1 rounded truncate max-w-[120px]">
                         <UserIcon size={10} className="mr-1 shrink-0" /> 
                         <span className="truncate">{task.user.name}</span>
                       </span>
                    ) : (
                       <>
                         <Clock size={14} className="mr-1.5" />
                         {new Date(task.createdAt).toLocaleDateString()}
                       </>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => toggleStatus(task)}
                    className={`flex items-center text-sm font-medium transition-colors ${
                      task.status === 'COMPLETED' ? 'text-green-400 hover:text-white' : 'text-prime-textMuted hover:text-green-400'
                    }`}
                  >
                    {task.status === 'COMPLETED' ? (
                      <><CheckCircle2 size={18} className="mr-1.5" /> done</>
                    ) : (
                      <><Circle size={18} className="mr-1.5" /> mark done</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-2xl relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white">
                  {editingTask ? 'Edit Context' : 'Initialize Context'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-prime-textMuted hover:text-white p-1">
                   <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-prime-textMuted mb-2">Title <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field bg-black/20" 
                    placeholder="E.g. Refactor API module"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-prime-textMuted mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field bg-black/20 min-h-[100px] resize-y" 
                    placeholder="Add details regarding this assignment..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-prime-textMuted mb-2">Priority Layer</label>
                    <select 
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                      className="input-field bg-black/20 appearance-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High (Critical)</option>
                    </select>
                  </div>
                  
                  {editingTask && (
                    <div>
                      <label className="block text-sm font-medium text-prime-textMuted mb-2">Status Node</label>
                      <select 
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value)}
                        className="input-field bg-black/20 appearance-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTask ? 'Commit Changes' : 'Execute Creation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Extracted from Lucide manually to fix compilation without top import
import { CheckSquare, User as UserIcon, X } from 'lucide-react';

export default Tasks;
