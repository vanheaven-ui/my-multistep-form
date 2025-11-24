'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className,
}) => {
  return (
    <div
      className={`flex items-center justify-between bg-white p-4 rounded shadow ${className || ''}`}
    >
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  );
};

export default StatCard;
