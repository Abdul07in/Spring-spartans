import React, { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    color?: string; // Optional accent color
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    color = 'blue'
}) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
            <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md bg-${color}-50 text-${color}-600`}>
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-lg font-bold text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            {trend && (
                <div className="bg-gray-50 px-5 py-3 -mx-5 -mb-5 mt-4 border-t border-gray-100">
                    <div className="text-sm">
                        <span className={`font-medium ${trendDirection === 'up' ? 'text-green-600' :
                                trendDirection === 'down' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            {trend}
                        </span>
                        <span className="text-gray-500"> from last month</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPICard;
