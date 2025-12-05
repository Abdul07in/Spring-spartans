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

// Mock Data
const MOCK_STATS: AppOwnerStats = {
    totalApplications: 15,
    totalPendingRequests: 28,
    totalCompletedApprovals: 145,
    totalReportingManagers: 8
};

const MOCK_REQUESTS: ReviewRequest[] = Array.from({ length: 28 }, (_, i) => ({
    id: `APP-REQ-${2000 + i}`,
    userName: ['John Doe', 'Sarah Connor', 'Kyle Reese', 'Ellen Ripley', 'James Holden'][i % 5],
    userEmail: ['john@example.com', 'sarah@skynet.com', 'kyle@resistance.org', 'ripley@weyland.com', 'hmc@expanse.org'][i % 5],
    role: ['Developer', 'DevOps', 'Product Owner', 'Analyst', 'Admin'][i % 5],
    applicationName: ['Payment Gateway', 'Customer Portal', 'Inventory System', 'HRMS', 'Analytics Suite'][i % 5],
    requestedAction: (['retain', 'revoke', 'modify'] as const)[i % 3],
    reportingManagerName: ['Manager Mike', 'Director Diana', 'Lead Larry'][i % 3],
    submittedDate: new Date(Date.now() - Math.random() * 500000000).toISOString(),
    status: 'pending'
}));

const MOCK_APPLICATIONS: ApplicationSummary[] = Array.from({ length: 15 }, (_, i) => ({
    id: `APP-OWN-${2000 + i}`,
    applicationName: ['Payment Gateway', 'Customer Portal', 'Inventory System', 'HRMS', 'Analytics Suite', 'Mobile App', 'Website', 'Intranet'][i % 8],
    userCount: Math.floor(Math.random() * 100) + 10,
    applicationOwnerName: 'John Doe',
    businessOwnerName: ['Michael Scott', 'David Wallace', 'Jan Levinson'][i % 3],
    pendingRequestsCount: Math.floor(Math.random() * 10),
    lastReviewDate: new Date(Date.now() - Math.random() * 500000000).toISOString()
}));

const ApplicationOwnerDashboard: React.FC = () => {
    const [stats, setStats] = useState<AppOwnerStats>(MOCK_STATS);
    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [applications] = useState<ApplicationSummary[]>(MOCK_APPLICATIONS);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'dashboard' | 'applications'>('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/requests?role=app_owner')
            .then(res => res.json())
            .then(data => {
                setRequests(data);
                // Also update stats if needed
                setStats(prev => ({ ...prev, totalPendingRequests: data.length }));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
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
