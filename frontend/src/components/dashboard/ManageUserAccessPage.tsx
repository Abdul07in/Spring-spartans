import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAccess } from '../../types/dashboard';
import UserAccessTable from './UserAccessTable';
import { ArrowLeft, UserCog, LogOut } from 'lucide-react';

const ManageUserAccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserAccess[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleDelete = (id: string) => {
        console.log("Delete clicked for", id);
        if (window.confirm('Are you sure you want to remove access for this user?')) {
            console.log("Confirmation accepted for", id);
            // Optimistic update
            setUsers(prev => prev.filter(user => user.id !== id));

            fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        // Revert if failed
                        fetchUsers();
                        alert('Failed to delete user');
                    } else {
                        console.log("Delete successful on backend");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert(`Network Error: ${err.message}`);
                    fetchUsers();
                });
        } else {
            console.log("Confirmation cancelled");
        }
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
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                            <UserCog size={18} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Manage User Access</h1>
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">User Access Management</h2>
                        <p className="mt-1 text-sm text-gray-500">View and revoke access for users within your hierarchy.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <UserAccessTable
                        users={users.slice((page - 1) * pageSize, page * pageSize)}
                        loading={loading}
                        page={page}
                        pageSize={pageSize}
                        totalCount={users.length}
                        onDelete={handleDelete}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </main>
        </div>
    );
};

export default ManageUserAccessPage;
