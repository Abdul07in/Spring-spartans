import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAccess } from '../../types/dashboard';
import QuarterlyReviewTable from './QuarterlyReviewTable';
import { ArrowLeft, UserCog, LogOut } from 'lucide-react';

const QuarterlyReviewPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserAccess[]>([]);
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
    const handleRemoveApp = async (id: string) => {
        // Optimistic Update
        const previousUsers = [...users];
        setUsers(prev => prev.filter(u => u.id !== id));

        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
        } catch (error) {
            console.error(error);
            alert('Failed to remove application access');
            setUsers(previousUsers); // Revert
        }
    };

    const handleRemoveModule = async (id: string, moduleToRemove: string) => {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return;
        const user = users[userIndex];
        const newModules = user.modules.filter(m => m !== moduleToRemove);

        // Optimistic Update
        const updatedUser = { ...user, modules: newModules };
        const newUsers = [...users];
        newUsers[userIndex] = updatedUser;
        setUsers(newUsers);

        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modules: newModules }) // Send ALL remaining modules
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
        } catch (error) {
            console.error(error);
            alert('Failed to remove module');
            setUsers(users); // Revert
            fetchUsers();
        }
    };

    const handleRevokeAll = async (userName: string) => {
        // Optimistic
        setUsers(prev => prev.filter(u => u.userName !== userName));

        try {
            const res = await fetch(`http://localhost:5000/api/users?userName=${encodeURIComponent(userName)}`, { method: 'DELETE' });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
        } catch (error) {
            console.error(error);
            alert('Failed to revoke all access');
            fetchUsers();
        }
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
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Quarterly Review</h1>
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
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">User Access Quarterly Review</h2>
                    <p className="mt-1 text-sm text-gray-500">Review and modify application and module access for all users.</p>
                </div>

                <QuarterlyReviewTable
                    users={users}
                    loading={loading}
                    onRemoveApp={handleRemoveApp}
                    onRemoveModule={handleRemoveModule}
                    onRevokeAll={handleRevokeAll}
                />
            </main>
        </div>
    );
};

export default QuarterlyReviewPage;
