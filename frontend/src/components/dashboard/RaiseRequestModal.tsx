import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { ApplicationSummary } from '../../types/dashboard';

interface RaiseRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const RaiseRequestModal: React.FC<RaiseRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        employeeId: '',
        department: '',
        applicationName: '',
        modules: [] as string[]
    });

    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [availableModules, setAvailableModules] = useState<string[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);

    // Fetch applications on mount (or when modal opens)
    useEffect(() => {
        if (isOpen) {
            setLoadingApps(true);
            fetch('http://localhost:5000/api/applications?role=manager')
                .then(res => res.json())
                .then(data => {
                    setApplications(data);
                    setLoadingApps(false);
                })
                .catch(err => {
                    console.error("Failed to fetch apps", err);
                    setLoadingApps(false);
                });
        }
    }, [isOpen]);

    // Update available modules when application is selected
    useEffect(() => {
        if (formData.applicationName) {
            const app = applications.find(a => a.applicationName === formData.applicationName);
            setAvailableModules(app?.modules || []);
            setFormData(prev => ({ ...prev, modules: [] })); // Reset modules
        } else {
            setAvailableModules([]);
        }
    }, [formData.applicationName, applications]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModuleToggle = (module: string) => {
        setFormData(prev => {
            const currentModules = prev.modules;
            if (currentModules.includes(module)) {
                return { ...prev, modules: currentModules.filter(m => m !== module) };
            } else {
                return { ...prev, modules: [...currentModules, module] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        // Reset form
        setFormData({
            userName: '',
            userEmail: '',
            employeeId: '',
            department: '',
            applicationName: '',
            modules: []
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-600">
                    <h3 className="text-lg font-bold text-white">Raise Access Request</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                            <input
                                type="text"
                                name="userName"
                                required
                                value={formData.userName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                required
                                value={formData.employeeId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="E12345"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="userEmail"
                                required
                                value={formData.userEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Engineering"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
                        <select
                            name="applicationName"
                            required
                            value={formData.applicationName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loadingApps}
                        >
                            <option value="">Select Application</option>
                            {applications.map(app => (
                                <option key={app.id} value={app.applicationName}>{app.applicationName}</option>
                            ))}
                        </select>
                    </div>

                    {formData.applicationName && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modules (Select required)</label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                                {availableModules.length > 0 ? availableModules.map(module => (
                                    <div
                                        key={module}
                                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${formData.modules.includes(module) ? 'bg-indigo-100 border-indigo-300' : 'hover:bg-gray-200'}`}
                                        onClick={() => handleModuleToggle(module)}
                                    >
                                        <div className={`w-4 h-4 mr-2 rounded border flex items-center justify-center ${formData.modules.includes(module) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 bg-white'}`}>
                                            {formData.modules.includes(module) && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-700">{module}</span>
                                    </div>
                                )) : (
                                    <p className="text-xs text-gray-500 col-span-2 text-center">No explicit modules defined for this app.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                        >
                            <Plus size={16} className="mr-2" />
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RaiseRequestModal;
