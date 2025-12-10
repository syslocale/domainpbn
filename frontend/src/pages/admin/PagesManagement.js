import React from 'react';

const PagesManagement = () => {
  return (
    <div data-testid="pages-management">
      <h1 className="text-3xl font-bold text-white mb-4">Pages Management</h1>
      <div className="glass-panel p-6">
        <p className="text-slate-300">Static pages CRUD management will be implemented here.</p>
        <p className="text-slate-400 text-sm mt-2">Manage About, TOS, Privacy Policy pages.</p>
      </div>
    </div>
  );
};

export default PagesManagement;