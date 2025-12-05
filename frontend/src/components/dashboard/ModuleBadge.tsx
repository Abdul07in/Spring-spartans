import React from 'react';

interface ModuleBadgeProps {
    name: string;
    color?: 'blue' | 'green' | 'purple' | 'gray';
}

const ModuleBadge: React.FC<ModuleBadgeProps> = ({ name, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        purple: 'bg-purple-100 text-purple-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color]} mr-1 mb-1`}>
            {name}
        </span>
    );
};

export default ModuleBadge;
