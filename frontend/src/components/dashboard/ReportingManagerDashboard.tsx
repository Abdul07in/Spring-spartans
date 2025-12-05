import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, FileClock, Layers, UserCog, LogOut, Plus } from 'lucide-react';
import KPICard from './KPICard';
import PendingRequestsTable from './PendingRequestsTable';
import RaiseRequestModal from './RaiseRequestModal';
import ReportingManagerApplications from './ReportingManagerApplications';
import { ApplicationSummary, DashboardStats, ReviewRequest } from '../../types/dashboard';

const ReportingManagerDashboard: React.FC = () => {
    // State
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalPendingRequests: 0,
        totalModifiedRequests: 0,
        totalApplications: 0
    });
    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'dashboard' | 'applications'>('dashboard');
    const [isRaiseRequestModalOpen, setIsRaiseRequestModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch Requests from API
    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:5000/api/dashboard/stats?role=manager');
                const statsData = await statsRes.json();
                setStats(statsData);

                // Fetch Applications
                const appsRes = await fetch('http://localhost:5000/api/applications?role=manager');
                const appsData = await appsRes.json();
                setApplications(appsData);

                // Fetch Requests
                const reqRes = await fetch('http://localhost:5000/api/requests?role=manager');
                const reqData = await reqRes.json();
                setRequests(reqData);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handlers
    const handleRaiseRequestSubmit = (data: any) => {
        // Send to Backend
        fetch('http://localhost:5000/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    alert('Request raised successfully!');
                    // Refresh requests
                    setRequests(prev => [response.request, ...prev]);
                } else {
                    alert('Failed to raise request');
                }
            })
            .catch(err => console.error("Error raising request:", err));
    };

    const handleApprove = (id: string) => {
        console.log(`Approving request ${id}`);
        // Can add API call here
        setRequests(prev => prev.filter(req => req.id !== id));
        setStats(prev => ({ ...prev, totalPendingRequests: prev.totalPendingRequests - 1 }));
    };

    const handleReject = (id: string) => {
        console.log(`Rejecting request ${id}`);
        setRequests(prev => prev.filter(req => req.id !== id));
        setStats(prev => ({ ...prev, totalPendingRequests: prev.totalPendingRequests - 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        setPage(newPage);
        setTimeout(() => setLoading(false), 500);
    };

    const handlePageSizeChange = (newSize: number) => {
        setLoading(true);
        setPageSize(newSize);
        setPage(1);
        setTimeout(() => setLoading(false), 500);
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
                            <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                                <UserCog size={18} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Access Manager</h1>
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
                    <ReportingManagerApplications
                        applications={applications}
                        onBack={() => setView('dashboard')}
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Top Header Placeholder */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                            <UserCog size={18} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Access Manager</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsRaiseRequestModalOpen(true)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Raise Request
                        </button>
                        <button
                            onClick={() => navigate('/manage-access')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <UserCog className="mr-2 h-4 w-4" />
                            Manage User Access
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300"></div>
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
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="mt-1 text-sm text-gray-500">Overview of your team's access and pending reviews.</p>
                </div>

                <RaiseRequestModal
                    isOpen={isRaiseRequestModalOpen}
                    onClose={() => setIsRaiseRequestModalOpen(false)}
                    onSubmit={handleRaiseRequestSubmit}
                />

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<Users size={24} />}
                        trend="+4%"
                        trendDirection="up"
                        color="blue"
                    />
                    <KPICard
                        title="Pending Requests"
                        value={stats.totalPendingRequests}
                        icon={<FileClock size={24} />}
                        trend="+12"
                        trendDirection="down"
                        color="orange"
                    />
                    <KPICard
                        title="Modified Access"
                        value={stats.totalModifiedRequests}
                        icon={<FileText size={24} />}
                        color="purple"
                    />
                    <div onClick={handleApplicationsClick} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="Applications"
                            value={stats.totalApplications}
                            icon={<Layers size={24} />}
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Requests Table Section */}
                <div className="space-y-4">
                    <PendingRequestsTable
                        requests={requests}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        totalCount={stats.totalPendingRequests + 20}
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

export default ReportingManagerDashboard;
