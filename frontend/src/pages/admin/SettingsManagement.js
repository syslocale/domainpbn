import React from 'react';

const SettingsManagement = () => {
  return (
    <div data-testid="settings-management">
      <h1 className="text-3xl font-bold text-white mb-4">Settings Management</h1>
      <div className="glass-panel p-6">
        <p className="text-slate-300">Global settings management will be implemented here.</p>
        <p className="text-slate-400 text-sm mt-2">Update site name, WhatsApp, Telegram, and other global configurations.</p>
      </div>
    </div>
  );
};

export default SettingsManagement;