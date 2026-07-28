import React from 'react';
import AdminRoute from '@/routes/AdminRoute';
import AdminSidebar from './AdminSidebar';

function AdminShell({ children }) {
  return (
    <AdminRoute>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
        }}
      >
        <AdminSidebar />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <main
            style={{
              flex: 1,
              padding: '2rem',
              overflowY: 'auto',
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}

export default AdminShell;
