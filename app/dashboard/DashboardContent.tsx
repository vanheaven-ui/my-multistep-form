'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CSVLink } from 'react-csv';
import ChartCard from '../../components/layout/ChartCard';
import StatCard from '../../components/layout/StatCard';
import { FiFileText, FiUsers, FiPaperclip } from 'react-icons/fi';

interface Submission {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  attachments: { id: string; name: string; url: string }[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardContent = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/submissions');
        const data = await res.json();
        if (data.ok) setSubmissions(data.submissions);
        else setError('Failed to fetch submissions');
      } catch {
        setError('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const attachmentsChartData = submissions.map((s) => ({
    name: s.fullName,
    value: s.attachments.length,
  }));

  const domainCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    const domain = s.email.split('@')[1] || 'unknown';
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });
  const domainChartData = Object.entries(domainCounts).map(
    ([domain, count]) => ({
      name: domain,
      value: count,
    }),
  );

  // Stats
  const totalSubmissions = submissions.length;
  const totalAttachments = submissions.reduce(
    (acc, s) => acc + s.attachments.length,
    0,
  );
  const uniqueDomains = Object.keys(domainCounts).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Submissions" value={totalSubmissions} icon={<FiUsers />} />
        <StatCard title="Total Attachments" value={totalAttachments} icon={<FiPaperclip />} />
        <StatCard title="Unique Email Domains" value={uniqueDomains} icon={<FiFileText />} />
      </div>

      {/* CSV Export */}
      {submissions.length > 0 && (
        <div className="flex justify-end mb-4">
          <CSVLink
            data={submissions.map((s) => ({
              Name: s.fullName,
              Email: s.email,
              Phone: s.phone || '-',
              Address: s.address || '-',
              Attachments: s.attachments.map((a) => a.name).join(', '),
            }))}
            filename="submissions.csv"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Attachments per User">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attachmentsChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Submissions per Email Domain">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={domainChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#4f46e5"
                label
              >
                {domainChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        {loading ? (
          <p>Loading submissions...</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">Address</th>
                <th className="border px-2 py-1">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{s.fullName}</td>
                  <td className="border px-2 py-1">{s.email}</td>
                  <td className="border px-2 py-1">{s.phone || '-'}</td>
                  <td className="border px-2 py-1">{s.address || '-'}</td>
                  <td className="border px-2 py-1">
                    {s.attachments.map((a) => (
                      <a
                        key={a.id}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline"
                      >
                        {a.name}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default DashboardContent;
