import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <ListTodo size={24} className="text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: <CheckCircle2 size={24} className="text-emerald-500" />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdueTasks,
      icon: <Clock size={24} className="text-rose-500" />,
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
