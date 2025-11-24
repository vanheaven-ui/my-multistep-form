'use client';
import React, { useEffect, useState } from 'react';

const DashboardContent = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading submissions...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Attachments</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.fullName}</td>
                <td className="border px-2 py-1">{s.email}</td>
                <td className="border px-2 py-1">{s.phone || '-'}</td>
                <td className="border px-2 py-1">{s.address || '-'}</td>
                <td className="border px-2 py-1">
                  {s.attachments.map((a: any) => (
                    <a
                      key={a.id}
                      href={a.url}
                      target="_blank"
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
  );
};

export default DashboardContent;
