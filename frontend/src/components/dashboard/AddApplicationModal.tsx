import React, { useState } from 'react';
import { X, Plus, Layers, Trash2 } from 'lucide-react';

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        applicationName: '',
        owner: '',
        businessOwner: '',
        modules: [] as string[]
    });

    const [newModule, setNewModule] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddModule = () => {
        if (newModule.trim()) {
            setFormData(prev => ({ ...prev, modules: [...prev.modules, newModule.trim()] }));
            setNewModule('');
        }
    };

    const handleRemoveModule = (moduleToRemove: string) => {
        setFormData(prev => ({ ...prev, modules: prev.modules.filter(m => m !== moduleToRemove) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        // Reset
        setFormData({
            applicationName: '',
            owner: '',
            businessOwner: '',
            modules: []
        });
        setNewModule('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-600">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={20} />
                        Add New Application
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                        <input
                            type="text"
                            name="applicationName"
                            required
                            value={formData.applicationName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Jira, Salesforce"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Application Owner</label>
                            <input
                                type="text"
                                name="owner"
                                required
                                value={formData.owner}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Owner Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Owner</label>
                            <input
                                type="text"
                                name="businessOwner"
                                required
                                value={formData.businessOwner}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Business Owner Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modules</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newModule}
                                onChange={(e) => setNewModule(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Add module (e.g. Reporting)"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddModule();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddModule}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {formData.modules.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                                {formData.modules.map((mod, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {mod}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveModule(mod)}
                                            className="ml-1.5 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        {formData.modules.length === 0 && (
                            <p className="text-xs text-gray-400 mt-1">No modules added yet.</p>
                        )}
                    </div>

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
                            Create Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddApplicationModal;
