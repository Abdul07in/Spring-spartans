import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, CheckCircle, FileClock, Users, LogOut } from 'lucide-react';
import KPICard from './KPICard';
import ApplicationOwnerRequestsTable from './ApplicationOwnerRequestsTable';
import ApplicationOwnerApplications from './ApplicationOwnerApplications';
import { ReviewRequest, ApplicationSummary } from '../../types/dashboard';

interface AppOwnerStats {
    totalApplications: number;
    totalPendingRequests: number;
    totalCompletedApprovals: number;
    totalReportingManagers: number;
}

// Mock Data REMOVED

const ApplicationOwnerDashboard: React.FC = () => {
    const [stats, setStats] = useState<AppOwnerStats>({
        totalApplications: 0,
        totalPendingRequests: 0,
        totalCompletedApprovals: 0,
        totalReportingManagers: 0
    });
    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'dashboard' | 'applications'>('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const statsRes = await fetch('http://localhost:5000/api/dashboard/stats?role=app_owner');
                const statsData = await statsRes.json();
                setStats(statsData);

                const appsRes = await fetch('http://localhost:5000/api/applications?role=app_owner');
                const appsData = await appsRes.json();
                setApplications(appsData);

                const reqRes = await fetch('http://localhost:5000/api/requests?role=app_owner');
                const reqData = await reqRes.json();
                setRequests(reqData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handlers
    const handleApprove = (id: string) => {
        // API Call
        fetch(`http://localhost:5000/api/requests/${id}/approve`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRequests(prev => prev.filter(req => req.id !== id));
                    setStats(prev => ({
                        ...prev,
                        totalPendingRequests: prev.totalPendingRequests - 1,
                        totalCompletedApprovals: prev.totalCompletedApprovals + 1
                    }));
                }
            });
    };

    const handleReject = (id: string) => {
        fetch(`http://localhost:5000/api/requests/${id}/reject`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRequests(prev => prev.filter(req => req.id !== id));
                    setStats(prev => ({
                        ...prev,
                        totalPendingRequests: prev.totalPendingRequests - 1
                    }));
                }
            });
    };

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        setPage(newPage);
        setTimeout(() => setLoading(false), 400); // Simulate mock delay
    };

    const handlePageSizeChange = (newSize: number) => {
        setLoading(true);
        setPageSize(newSize);
        setPage(1);
    };

    const handleApplicationsClick = () => {
        setView('applications');
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/');
    };

    if (view === 'applications') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                                O
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">App Owner Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setView('dashboard')}
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ApplicationOwnerApplications
                        applications={applications}
                        onBack={() => setView('dashboard')}
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                            O
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">App Owner Dashboard</h1>
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
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div onClick={handleApplicationsClick} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="My Applications"
                            value={stats.totalApplications}
                            icon={<Layers size={24} />}
                            color="indigo"
                        />
                    </div>
                    <KPICard
                        title="Pending Reviews"
                        value={stats.totalPendingRequests}
                        icon={<FileClock size={24} />}
                        trend="+5"
                        trendDirection="down" // assuming pending increase is 'bad' backlog
                        color="orange"
                    />
                    <KPICard
                        title="Approvals This Month"
                        value={stats.totalCompletedApprovals}
                        icon={<CheckCircle size={24} />}
                        trend="+12%"
                        trendDirection="up"
                        color="green"
                    />
                    <KPICard
                        title="Reporting Managers"
                        value={stats.totalReportingManagers}
                        icon={<Users size={24} />}
                        color="blue"
                    />
                </div>

                {/* Requests Table */}
                <div className="space-y-4">
                    <ApplicationOwnerRequestsTable
                        requests={requests}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        totalCount={stats.totalPendingRequests + 5} // Mock total logic
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </main>
        </div>
    );
};

export default ApplicationOwnerDashboard;
