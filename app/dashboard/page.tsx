'use client';
import React from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import DashboardContent from './DashboardContent';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;
