import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Layers, Users, LogOut } from 'lucide-react';
import KPICard from './KPICard';
import BusinessOwnerRequestsTable from './BusinessOwnerRequestsTable';
import BusinessOwnerApplications from './BusinessOwnerApplications';
import { ReviewRequest, ApplicationSummary } from '../../types/dashboard';

interface BusinessOwnerStats {
    totalApplications: number;
    totalAppOwners: number;
    totalPendingRequests: number;
}

// Mock Data
const MOCK_STATS: BusinessOwnerStats = {
    totalApplications: 45,
    totalAppOwners: 12,
    totalPendingRequests: 67
};

const MOCK_REQUESTS: ReviewRequest[] = Array.from({ length: 67 }, (_, i) => ({
    id: `BUS-REQ-${3000 + i}`,
    userName: ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Stanley Hudson'][i % 5],
    userEmail: ['michael@dundermifflin.com', 'jim@dundermifflin.com', 'pam@dundermifflin.com', 'dwight@dundermifflin.com', 'stanley@dundermifflin.com'][i % 5],
    role: ['Branch Manager', 'Sales', 'Admin', 'Assistant to RM', 'Sales'][i % 5],
    applicationName: ['Salesforce', 'NetSuite', 'Outlook', 'Slack', 'SharePoint'][i % 5],
    requestedAction: (['retain', 'revoke', 'modify'] as const)[i % 3],
    applicationOwnerName: ['David Wallace', 'Jan Levinson', 'Ryan Howard'][i % 3],
    submittedDate: new Date(Date.now() - Math.random() * 800000000).toISOString(),
    status: 'pending'
}));

const MOCK_APPLICATIONS: ApplicationSummary[] = Array.from({ length: 15 }, (_, i) => ({
    id: `APP-BUS-${3000 + i}`,
    applicationName: ['Salesforce', 'NetSuite', 'Outlook', 'Slack', 'SharePoint', 'Teams', 'Zoom', 'Workday'][i % 8],
    userCount: Math.floor(Math.random() * 200) + 20,
    applicationOwnerName: ['David Wallace', 'Jan Levinson', 'Ryan Howard'][i % 3],
    businessOwnerName: 'Michael Scott',
    pendingRequestsCount: Math.floor(Math.random() * 15),
    lastReviewDate: new Date(Date.now() - Math.random() * 800000000).toISOString()
}));

const BusinessOwnerDashboard: React.FC = () => {
    const [stats, setStats] = useState<BusinessOwnerStats>(MOCK_STATS);
    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [applications] = useState<ApplicationSummary[]>(MOCK_APPLICATIONS);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'dashboard' | 'applications'>('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/requests?role=business_owner')
            .then(res => res.json())
            .then(data => {
                setRequests(data);
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
        fetch(`http://localhost:5000/api/requests/${id}/approve`, { method: 'POST' })
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
        setTimeout(() => setLoading(false), 300);
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
                            <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                                B
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Business Owner Dashboard</h1>
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
                    <BusinessOwnerApplications
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
                        <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Business Owner Dashboard</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div onClick={handleApplicationsClick} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="Total Applications"
                            value={stats.totalApplications}
                            icon={<Layers size={24} />}
                            color="indigo"
                        />
                    </div>
                    <KPICard
                        title="Application Owners"
                        value={stats.totalAppOwners}
                        icon={<Users size={24} />}
                        trend="Active"
                        trendDirection="neutral"
                        color="blue"
                    />
                    <KPICard
                        title="Pending Approvals"
                        value={stats.totalPendingRequests}
                        icon={<Briefcase size={24} />}
                        trend="+24"
                        trendDirection="down"
                        color="purple"
                    />
                </div>

                {/* Requests Table */}
                <div className="space-y-4">
                    <BusinessOwnerRequestsTable
                        requests={requests}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        totalCount={stats.totalPendingRequests + 15} // Mock total
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

export default BusinessOwnerDashboard;
