import React from 'react';

const PackagesManagement = () => {
  return (
    <div data-testid="packages-management">
      <h1 className="text-3xl font-bold text-white mb-4">Packages Management</h1>
      <div className="glass-panel p-6">
        <p className="text-slate-300">Packages CRUD management will be implemented here.</p>
        <p className="text-slate-400 text-sm mt-2">You can add, edit, and delete packages from this panel.</p>
      </div>
    </div>
  );
};

export default PackagesManagement;