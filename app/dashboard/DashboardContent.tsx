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
import { FiFileText, FiUsers, FiPaperclip, FiHome, FiEdit, FiDownload } from 'react-icons/fi';
import ChartCard from '../../components/layout/ChartCard'; // Assuming this component exists
import StatCard from '../../components/layout/StatCard';   // Assuming this component exists
import DashboardSkeleton from '../../components/layout/DashboardContentSkeleton';
import Link from 'next/link';

interface Submission {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  attachments: { id: string; name: string; url: string }[];
}

// Updated COLORS to use Emerald (matching the form theme) and other modern accents
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const PRIMARY_BAR_COLOR = '#059669'; // Darker Emerald for the main bar

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

  // --- Rendering States ---
  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && submissions.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg shadow-2xl shadow-gray-300/50 space-y-4 max-w-5xl mx-auto mt-10">
        <h1 className="text-3xl font-extrabold text-gray-800 border-l-4 border-red-500 pl-3">
          Dashboard Error
        </h1>
        <p
          className="text-red-600 p-4 bg-red-100 border border-red-400 rounded-lg shadow-sm font-medium"
          role="alert"
        >
          Error: {error}
        </p>
      </div>
    );
  }

  // --- Data Processing Logic ---
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-emerald-500 pb-3">
        Analytics Dashboard 📊
      </h1>
      
      {/* --- Action Buttons (Top Right) --- */}
      <div className="flex justify-end space-x-4">
          
        {/* Link to Home Page */}
        <Link href="/" passHref legacyBehavior>
          <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl border border-gray-300 shadow-sm transition duration-150">
            <FiHome className="w-5 h-5" />
            <span>Home</span>
          </button>
        </Link>
        
        {/* Link to Form Page */}
        <Link href="/form" passHref legacyBehavior> 
          <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-150">
            <FiEdit className="w-5 h-5" />
            <span>New Form</span>
          </button>
        </Link>
        
        {/* CSV Export Button (Modernized) */}
        {submissions.length > 0 && (
          <CSVLink
            data={submissions.map((s) => ({
              Name: s.fullName,
              Email: s.email,
              Phone: s.phone || '-',
              Address: s.address || '-',
              Attachments: s.attachments.map((a) => a.name).join(', '),
            }))}
            filename="submissions_export.csv"
            className="flex items-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition duration-150"
          >
            <FiDownload className="w-5 h-5" />
            <span>Export CSV</span>
          </CSVLink>
        )}
      </div>

      {/* --- Stats Cards (Using Emerald Theme) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={<FiUsers className="text-emerald-500 w-6 h-6" />}
          description="Total forms completed"
        />
        <StatCard
          title="Total Attachments"
          value={totalAttachments}
          icon={<FiPaperclip className="text-emerald-500 w-6 h-6" />}
          description="Files uploaded across all forms"
        />
        <StatCard
          title="Unique Email Domains"
          value={uniqueDomains}
          icon={<FiFileText className="text-emerald-500 w-6 h-6" />}
          description="Diversity of submitting organizations"
        />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bar Chart: Attachments per User */}
        <ChartCard title="Attachment Count by User" description="Number of files uploaded by each applicant.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={attachmentsChartData}
              margin={{ top: 20, right: 20, bottom: 5, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" angle={-15} textAnchor="end" height={50} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                 labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
              />
              {/* Using Emerald primary color for the bar */}
              <Bar dataKey="value" fill={PRIMARY_BAR_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart: Submissions per Email Domain */}
        <ChartCard title="Submission Domain Distribution" description="Breakdown of applicants by email provider/domain.">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={domainChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                fill="#4f46e5"
                // No label to prevent clutter, Legend handles identification
              >
                {domainChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="shadow-md"
                  />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value, name) => [`Count: ${value}`, name]}
                 contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* --- Submissions Table (Modernized) --- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-2xl shadow-gray-300/50 border border-gray-100 mt-8">
        <h3 className="text-xl font-bold text-gray-800 p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            Recent Submissions Log
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Attachments</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.address || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {s.attachments.length > 0 ? (
                      s.attachments.map((a) => (
                          <a
                              key={a.id}
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 underline transition truncate"
                              title={a.name}
                          >
                              {a.name}
                          </a>
                      ))
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                        No submissions found yet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-600 mt-4 p-2 font-medium">{error}</p>}
    </div>
  );
};

export default DashboardContent;