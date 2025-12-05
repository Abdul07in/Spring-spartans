import React from 'react';
import ApplicationCard from './ApplicationCard';
import { ApplicationSummary } from '../../types/dashboard';

interface ApplicationOwnerApplicationsProps {
    applications: ApplicationSummary[];
    onBack: () => void;
}

const ApplicationOwnerApplications: React.FC<ApplicationOwnerApplicationsProps> = ({ applications, onBack }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
                    &larr; Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {applications.map((app) => (
                    <ApplicationCard
                        key={app.id}
                        applicationName={app.applicationName}
                        userCount={app.userCount}
                        businessOwnerName={app.businessOwnerName}
                        pendingRequestsCount={app.pendingRequestsCount}
                        lastReviewDate={app.lastReviewDate}
                    />
                ))}
            </div>
        </div>
    );
};

export default ApplicationOwnerApplications;
