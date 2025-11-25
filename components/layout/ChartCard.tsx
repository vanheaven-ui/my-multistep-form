'use client';

import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode; // should always be a Recharts chart
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div
      // Applying modern shadow, rounded corners, and border consistent with the StatCard/Form steps
      className={`w-full h-96 bg-white p-6 rounded-xl border border-gray-100 shadow-2xl shadow-gray-300/50 ${className || ''}`}
      style={{ minWidth: 0 }} // Ensures chart responsiveness
    >
      <h2 className="text-xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-3 mb-2">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-gray-500 mb-4 border-b pb-2 border-gray-100">
          {description}
        </p>
      )}

      <div className="w-full h-[80%]">{children}</div>
    </div>
  );
};

export default ChartCard;
