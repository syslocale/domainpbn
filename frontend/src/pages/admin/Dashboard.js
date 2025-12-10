import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Package, FileText, HelpCircle, TrendingUp, DollarSign } from 'lucide-react';
import { pbnAPI, packagesAPI, blogAPI, faqAPI } from '../../api/client';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPBN: 0,
    totalPackages: 0,
    totalBlog: 0,
    totalFAQ: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pbnRes, pkgRes, blogRes, faqRes] = await Promise.all([
          pbnAPI.getAll(),
          packagesAPI.getAll(),
          blogAPI.getAll(),
          faqAPI.getAll(),
        ]);
        setStats({
          totalPBN: pbnRes.data.length,
          totalPackages: pkgRes.data.length,
          totalBlog: blogRes.data.length,
          totalFAQ: faqRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total PBN Sites',
      value: stats.totalPBN,
      icon: <Globe className="text-blue-400" size={24} />,
      link: '/admin/pbn',
      color: 'blue',
    },
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: <Package className="text-green-400" size={24} />,
      link: '/admin/packages',
      color: 'green',
    },
    {
      title: 'Total Blog Posts',
      value: stats.totalBlog,
      icon: <FileText className="text-purple-400" size={24} />,
      link: '/admin/blog',
      color: 'purple',
    },
    {
      title: 'Total FAQ',
      value: stats.totalFAQ,
      icon: <HelpCircle className="text-yellow-400" size={24} />,
      link: '/admin/faq',
      color: 'yellow',
    },
  ];

  const quickActions = [
    { title: 'Add PBN Site', link: '/admin/pbn', color: 'blue' },
    { title: 'Add Package', link: '/admin/packages', color: 'green' },
    { title: 'Add Blog Post', link: '/admin/blog', color: 'purple' },
    { title: 'Edit Page Content', link: '/admin/page-content', color: 'cyan' },
    { title: 'Update Settings', link: '/admin/settings', color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome to DomainPBN Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="glass-panel p-6 card-hover group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-600/20 flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.title}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`bg-${action.color}-600/10 hover:bg-${action.color}-600/20 border border-${action.color}-500/30 rounded-lg p-4 text-center transition-all`}
            >
              <span className="text-white font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Update</span>
              <span className="text-white font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
              <div>
                <div className="text-white">PBN sites updated</div>
                <div className="text-slate-400 text-xs">Just now</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
              <div>
                <div className="text-white">New package added</div>
                <div className="text-slate-400 text-xs">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <div>
                <div className="text-white">Blog post published</div>
                <div className="text-slate-400 text-xs">5 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;