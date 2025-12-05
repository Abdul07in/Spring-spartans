
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Briefcase, Users, ShieldCheck, LogOut, Plus } from 'lucide-react';
import KPICard from './KPICard';
import ApplicationCard from './ApplicationCard';
import AddApplicationModal from './AddApplicationModal';
import { ApplicationSummary } from '../../types/dashboard';

interface AdminStats {
    totalApplications: number;
    totalBusinessOwners: number;
    totalApplicationOwners: number;
    totalReportingManagers: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        totalApplications: 0,
        totalBusinessOwners: 0,
        totalApplicationOwners: 0,
        totalReportingManagers: 0
    });
    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Stats
            const statsRes = await fetch('http://localhost:5000/api/dashboard/stats?role=admin');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch Applications
            const appsRes = await fetch('http://localhost:5000/api/applications?role=admin');
            const appsData = await appsRes.json();
            setApplications(appsData);
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleAddApplication = async (data: any) => {
        try {
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert('Application created successfully!');
                // Refresh list
                fetchDashboardData();
            } else {
                alert('Failed to create application: ' + result.message);
            }
        } catch (error) {
            console.error("Error creating application:", error);
            alert('Error creating application');
        }
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
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus size={16} className="mr-2" />
                            Add New Application
                        </button>
                    </div>
                </div>

                {/* Applications Grid */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading data...</p>
                    </div>
                ) : (
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
                )}

                <AddApplicationModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddApplication}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;
