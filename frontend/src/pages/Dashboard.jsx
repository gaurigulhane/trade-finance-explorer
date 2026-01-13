import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RiskGauge from '../components/RiskGauge';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/v1/analytics/dashboard', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, [user]);

    const downloadReport = async () => {
        if (!user) return;

        try {
            const response = await axios.get('/api/v1/analytics/export', {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ComplianceReport.txt`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        }
    };

    if (!stats) return <div className="p-6">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-gradient-to-br from-white to-blue-50 overflow-hidden shadow-lg rounded-lg border border-blue-100">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-blue-600 truncate">Total Documents</dt>
                        <dd className="mt-1 text-3xl font-semibold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">{stats.total_documents}</dd>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-white to-cyan-50 overflow-hidden shadow-lg rounded-lg border border-cyan-100">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-cyan-600 truncate">Active Trades</dt>
                        <dd className="mt-1 text-3xl font-semibold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">{stats.active_trades}</dd>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-white to-blue-50 overflow-hidden shadow-lg rounded-lg border border-blue-100">
                    <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
                        <div>
                            <dt className="text-sm font-medium text-blue-600 truncate">Risk Score</dt>
                            <dd className="mt-1 text-3xl font-semibold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">{stats.risk_score}</dd>
                        </div>
                        <RiskGauge score={stats.risk_score} />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg sm:rounded-lg border border-blue-100">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50">
                    <h3 className="text-lg leading-6 font-medium text-blue-900">Recent Activity</h3>
                    <button onClick={downloadReport} className="text-sm text-cyan-600 hover:text-cyan-800 font-medium transition-colors">Download Compliance Report</button>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {stats.recent_activity.map((log, idx) => (
                            <li key={idx} className="px-4 py-4 sm:px-6 text-sm text-gray-600">
                                {log}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
