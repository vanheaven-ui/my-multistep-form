'use client';

import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  children: React.ReactNode; // should always be a Recharts chart
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`w-full h-80 md:h-96 bg-white p-4 rounded shadow ${className || ''}`}
      style={{ minWidth: 0 }} // ensures chart can compute width
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {/* ResponsiveContainer MUST wrap a Recharts chart component */}
      <div className="w-full h-[85%]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
