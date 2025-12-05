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

// Mock Data REMOVED

const BusinessOwnerDashboard: React.FC = () => {
    const [stats, setStats] = useState<BusinessOwnerStats>({
        totalApplications: 0,
        totalAppOwners: 0,
        totalPendingRequests: 0
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
                const statsRes = await fetch('http://localhost:5000/api/dashboard/stats?role=business_owner');
                const statsData = await statsRes.json();
                setStats(statsData);

                const appsRes = await fetch('http://localhost:5000/api/applications?role=business_owner');
                const appsData = await appsRes.json();
                setApplications(appsData);

                const reqRes = await fetch('http://localhost:5000/api/requests?role=business_owner');
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
