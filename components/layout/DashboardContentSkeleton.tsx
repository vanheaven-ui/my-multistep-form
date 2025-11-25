import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse space-y-6">
        {/* 1. Header Area Skeleton */}
        <div className="flex justify-between items-center mb-6">
          {/* Dashboard Title Placeholder */}
          <div className="h-8 w-56 bg-gray-200 rounded"></div>
          {/* CSV Export Button Placeholder */}
          <div className="h-9 w-28 bg-gray-200 rounded"></div>
        </div>

        {/* 2. Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-28">
            <div className="h-4 w-3/4 mb-3 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/2 bg-gray-300 rounded-full"></div>
          </div>
          {/* Stat Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-28">
            <div className="h-4 w-3/4 mb-3 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/2 bg-gray-300 rounded-full"></div>
          </div>
          {/* Stat Card 3 */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-28">
            <div className="h-4 w-3/4 mb-3 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/2 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* 3. Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Card 1 Placeholder (Bar Chart) */}
          <div className="bg-white p-4 rounded-xl shadow-lg h-80">
            <div className="h-6 w-1/3 mb-4 bg-gray-200 rounded"></div>{' '}
            {/* Chart Title */}
            <div className="h-64 w-full bg-gray-100 rounded"></div>{' '}
            {/* Chart Body */}
          </div>
          {/* Chart Card 2 Placeholder (Pie Chart) */}
          <div className="bg-white p-4 rounded-xl shadow-lg h-80">
            <div className="h-6 w-1/3 mb-4 bg-gray-200 rounded"></div>{' '}
            {/* Chart Title */}
            <div className="h-64 w-full bg-gray-100 rounded"></div>{' '}
            {/* Chart Body */}
          </div>
        </div>

        {/* 4. Table Skeleton */}
        <div className="bg-white p-4 rounded shadow-lg overflow-x-auto">
          {/* Table Header Placeholder */}
          <div className="flex bg-gray-100 py-3 mb-2 rounded">
            <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
            <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
            <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
            <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
            <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
          </div>

          {/* Table Rows Placeholder */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex py-3 border-b border-gray-100">
              <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
              <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
              <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
              <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
              <div className="h-4 w-1/5 bg-gray-200 mx-2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
