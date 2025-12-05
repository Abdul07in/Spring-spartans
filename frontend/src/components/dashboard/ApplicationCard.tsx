import React from 'react';
import { Briefcase, UserCheck, AlertCircle } from 'lucide-react';

interface ApplicationCardProps {
    applicationName: string;
    userCount: number;
    businessOwnerName?: string;
    applicationOwnerName?: string;
    pendingRequestsCount?: number;
    lastReviewDate?: string;
    onClick?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
    applicationName,
    userCount,
    businessOwnerName,
    applicationOwnerName,
    pendingRequestsCount,
    lastReviewDate,
    onClick
}) => {
    return (
        <div
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="px-5 py-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 truncate" title={applicationName}>
                        {applicationName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {userCount} Users
                    </span>
                </div>

                <div className="mt-4 space-y-3">
                    {applicationOwnerName && (
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <UserCheck className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="ml-2 text-sm">
                                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">App Owner</p>
                                <p className="text-gray-900 font-medium">{applicationOwnerName}</p>
                            </div>
                        </div>
                    )}

                    {businessOwnerName && (
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="ml-2 text-sm">
                                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Business Owner</p>
                                <p className="text-gray-900 font-medium">{businessOwnerName}</p>
                            </div>
                        </div>
                    )}

                    {pendingRequestsCount !== undefined && (
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="ml-2 text-sm">
                                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Pending Reviews</p>
                                <p className="text-orange-600 font-bold">{pendingRequestsCount}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                    {lastReviewDate ? `Last Review: ${new Date(lastReviewDate).toLocaleDateString()}` : 'No reviews yet'}
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ApplicationCard;
