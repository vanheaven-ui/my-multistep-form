'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartComponentProps {
  data: { name: string; value: number }[];
  dataKey?: string; // default 'value'
  title?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  dataKey = 'value',
  title,
}) => {

    console.log(data);
  return (
    <div className="w-full h-64 md:h-80 lg:h-96 p-4 bg-white rounded shadow">
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
