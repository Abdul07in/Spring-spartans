import React from 'react';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ReviewRequest } from '../../types/dashboard';

interface MyRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requests: ReviewRequest[];
}

const MyRequestsModal: React.FC<MyRequestsModalProps> = ({ isOpen, onClose, requests }) => {
    if (!isOpen) return null;

    // Filter only requests initiated by the manager (if logic requires, but parent passes filtered list ideally)
    // Assuming 'requests' passed here are the ones we want to show.

    const getStepStatus = (reqStatus: string, step: 'app_owner' | 'business_owner') => {
        if (reqStatus === 'approved') return 'completed';
        if (reqStatus === 'rejected') return 'rejected';

        if (step === 'app_owner') {
            if (reqStatus === 'pending_app_owner') return 'current';
            if (reqStatus === 'pending_business_owner') return 'completed';
        }

        if (step === 'business_owner') {
            if (reqStatus === 'pending_app_owner') return 'waiting';
            if (reqStatus === 'pending_business_owner') return 'current';
        }

        return 'waiting';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-600">
                    <h3 className="text-lg font-bold text-white">My Raised Requests</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {requests.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No requests raised yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{req.userName}</h4>
                                            <p className="text-sm text-gray-500">{req.applicationName} • {new Date(req.submittedDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                            ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {req.status === 'pending_app_owner' ? 'Pending App Owner' :
                                                req.status === 'pending_business_owner' ? 'Pending Biz Owner' :
                                                    req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Progress Stepper */}
                                    <div className="relative flex items-center justify-between w-full mt-6 mb-2">
                                        {/* Line */}
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 rounded-full"></div>

                                        {/* Step 1: Raised */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white border-2 border-white shadow">
                                                <CheckCircle size={16} />
                                            </div>
                                            <span className="mt-2 text-xs font-medium text-gray-700">Raised</span>
                                        </div>

                                        {/* Step 2: App Owner */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <StepIcon status={getStepStatus(req.status, 'app_owner')} />
                                            <span className="mt-2 text-xs font-medium text-gray-700">App Owner</span>
                                        </div>

                                        {/* Step 3: Business Owner */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <StepIcon status={getStepStatus(req.status, 'business_owner')} />
                                            <span className="mt-2 text-xs font-medium text-gray-700">Biz Owner</span>
                                        </div>

                                        {/* Step 4: Final Status */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow 
                                                ${req.status === 'approved' ? 'bg-green-500' :
                                                    req.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'}`}>
                                                {req.status === 'approved' ? <CheckCircle size={16} /> :
                                                    req.status === 'rejected' ? <X size={16} /> :
                                                        <div className="w-3 h-3 bg-white rounded-full"></div>}
                                            </div>
                                            <span className="mt-2 text-xs font-medium text-gray-700">Completed</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const StepIcon = ({ status }: { status: 'completed' | 'current' | 'waiting' | 'rejected' }) => {
    if (status === 'completed') {
        return (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white border-2 border-white shadow">
                <CheckCircle size={16} />
            </div>
        );
    }
    if (status === 'current') {
        return (
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white border-2 border-white shadow animate-pulse">
                <Clock size={16} />
            </div>
        );
    }
    if (status === 'rejected') {
        return (
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white border-2 border-white shadow">
                <AlertCircle size={16} />
            </div>
        );
    }
    // Waiting
    return (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border-2 border-white shadow">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
    );
};

export default MyRequestsModal;
