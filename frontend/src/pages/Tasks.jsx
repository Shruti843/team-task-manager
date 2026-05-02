import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Calendar, User } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);

      if (user.role === 'Admin') {
        const [projRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/users')
        ]);
        setProjects(projRes.data);
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        project: projectId,
        assignedTo,
        dueDate
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setProjectId('');
      setAssignedTo('');
      setDueDate('');
      fetchData();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchData(); // refresh tasks
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const statusColumns = ['Todo', 'In Progress', 'Completed'];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">Manage and track task progress</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        {statusColumns.map((status) => (
          <div key={status} className="flex-1 min-w-[300px] bg-slate-100 rounded-2xl p-4 flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-700">{status}</h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {task.project?.name || 'No Project'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-rose-500">
                        <Calendar size={14} />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <select
                      className="text-sm border border-slate-200 rounded p-1 w-full bg-slate-50"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
