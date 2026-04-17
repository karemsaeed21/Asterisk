import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import MultiPurposeForm from './components/Forms/MultiPurposeForm';
import ExceptionalBookingForm from './components/Forms/ExceptionalBookingForm';
import RequestTypeSelector from './pages/RequestTypeSelector';
import AdminSettings from './pages/Admin/Settings';
import Users from './pages/Admin/Users';

import History from './pages/Dashboard/History';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<UserDashboard />} />
          <Route path="admin/requests" element={<AdminDashboard />} />
          <Route path="schedule" element={<AdminDashboard />} />
          <Route path="request/new" element={<RequestTypeSelector />} />
          <Route path="request/multi-purpose" element={<MultiPurposeForm />} />
          <Route path="request/exceptional" element={<ExceptionalBookingForm />} />
          <Route path="history" element={<History />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
