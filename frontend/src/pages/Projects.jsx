import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Users } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New project state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        user.role === 'Admin' ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        name,
        description,
        members: selectedMembers
      });
      setShowModal(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      fetchData();
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your team's projects</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{project.description}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-slate-500 text-sm">
                <Users size={16} />
                <span>{project.members?.length || 0} Members</span>
              </div>
              <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                By {project.createdBy?.name || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No projects found. {user?.role === 'Admin' ? 'Create one to get started!' : 'Wait for an admin to assign you to a project.'}</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Team Members</label>
                <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-2">
                  {users.map(u => (
                    <div key={u._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => toggleMember(u._id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{u.name} ({u.email})</span>
                    </div>
                  ))}
                </div>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
