import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Briefcase, Users, ShieldCheck, LogOut } from 'lucide-react';
import KPICard from './KPICard';
import ApplicationCard from './ApplicationCard';
import { ApplicationSummary } from '../../types/dashboard';

interface AdminStats {
    totalApplications: number;
    totalBusinessOwners: number;
    totalApplicationOwners: number;
    totalReportingManagers: number;
}

// Mock Data
const MOCK_STATS: AdminStats = {
    totalApplications: 156,
    totalBusinessOwners: 34,
    totalApplicationOwners: 89,
    totalReportingManagers: 245
};

const MOCK_APPLICATIONS: ApplicationSummary[] = Array.from({ length: 12 }, (_, i) => ({
    id: `APP-${5000 + i}`,
    applicationName: ['Jira Software', 'Salesforce CRM', 'AWS Production', 'GitHub Enterprise', 'Slack', 'Confluence', 'ServiceNow', 'Oracle ERP', 'Tableau', 'Zoom', 'Figma', 'Datadog'][i],
    userCount: Math.floor(Math.random() * 500) + 50,
    applicationOwnerName: ['Sarah Connor', 'John Doe', 'Ellen Ripley', 'Tony Stark', 'Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Peter Parker', 'Natasha Romanoff', 'Steve Rogers', 'Wanda Maximoff', 'Thor Odinson'][i],
    businessOwnerName: ['Robert California', 'David Wallace', 'Jan Levinson', 'Charles Miner', 'Jo Bennett', 'Robert California', 'David Wallace', 'Jan Levinson', 'Charles Miner', 'Jo Bennett', 'Nellie Bertram', 'Andy Bernard'][i],
    lastReviewDate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const AdminDashboard: React.FC = () => {
    const [stats] = useState<AdminStats>(MOCK_STATS);
    const [applications] = useState<ApplicationSummary[]>(MOCK_APPLICATIONS);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-800 rounded flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Applications"
                        value={stats.totalApplications}
                        icon={<Layers size={24} />}
                        color="indigo"
                    />
                    <KPICard
                        title="Business Owners"
                        value={stats.totalBusinessOwners}
                        icon={<Briefcase size={24} />}
                        color="purple"
                    />
                    <KPICard
                        title="App Owners"
                        value={stats.totalApplicationOwners}
                        icon={<ShieldCheck size={24} />}
                        color="blue"
                    />
                    <KPICard
                        title="Reporting Managers"
                        value={stats.totalReportingManagers}
                        icon={<Users size={24} />}
                        color="green"
                    />
                </div>

                {/* Applications Grid Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Application Overview</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage and monitor all applications across the organization.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add New Application
                        </button>
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {applications.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            applicationName={app.applicationName}
                            userCount={app.userCount}
                            applicationOwnerName={app.applicationOwnerName}
                            businessOwnerName={app.businessOwnerName}
                            lastReviewDate={app.lastReviewDate}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
