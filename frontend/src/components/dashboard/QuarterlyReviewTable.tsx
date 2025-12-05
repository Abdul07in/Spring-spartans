import React from 'react';
import { UserAccess } from '../../types/dashboard';
import { X, Trash2 } from 'lucide-react';

interface Props {
    users: UserAccess[];
    loading: boolean;
    onRemoveApp: (recordId: string) => void;
    onRemoveModule: (recordId: string, moduleToRemove: string) => void;
    onRevokeAll: (userName: string) => void;
}

const QuarterlyReviewTable: React.FC<Props> = ({ users, loading, onRemoveApp, onRemoveModule, onRevokeAll }) => {
    // Group users by UserName
    const groupedUsers = React.useMemo(() => {
        const groups: { [key: string]: UserAccess[] } = {};
        users.forEach(u => {
            if (!groups[u.userName]) {
                groups[u.userName] = [];
            }
            groups[u.userName].push(u);
        });
        return groups;
    }, [users]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (users.length === 0) {
        return <div className="p-8 text-center text-gray-500">No user access data found.</div>;
    }

    return (
        <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application Access
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modules Access
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revoke All Access
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(groupedUsers).map(([userName, records]) => (
                        <tr key={userName} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{userName}</div>
                                <div className="text-sm text-gray-500">{records.length} Application(s)</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {records.map(record => (
                                        <span
                                            key={record.id}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {record.applicationName}
                                            <button
                                                onClick={() => onRemoveApp(record.id)}
                                                className="ml-1.5 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-600 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                                            >
                                                <span className="sr-only">Remove {record.applicationName}</span>
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-2">
                                    {records.map(record => (
                                        <div key={record.id} className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-500 mr-1">
                                                {record.applicationName}:
                                            </span>
                                            {record.modules && record.modules.length > 0 ? (
                                                record.modules.map(module => (
                                                    <span
                                                        key={`${record.id}-${module}`}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                                                    >
                                                        {module}
                                                        <button
                                                            onClick={() => onRemoveModule(record.id, module)}
                                                            className="ml-1 text-purple-600 hover:text-purple-900 hover:scale-110 transition-transform"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No specific modules</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onRevokeAll(userName)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    <Trash2 size={14} className="mr-1.5" />
                                    Revoke All
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuarterlyReviewTable;
