'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string; 
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description, 
  className,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-100 shadow-xl shadow-gray-300/50 transition duration-300 hover:shadow-2xl ${className || ''}`}
    >
      <div className="flex items-start justify-between">

        <div className="flex flex-col">

          <h3 className="text-sm font-medium uppercase text-gray-500">
            {title}
          </h3>

          <p className="text-4xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 flex-shrink-0 shadow-inner">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
