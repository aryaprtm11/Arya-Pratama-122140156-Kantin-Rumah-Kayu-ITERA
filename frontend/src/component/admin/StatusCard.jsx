import React from 'react';
import { Icon } from '@iconify/react';

const StatusCard = ({ 
  title, 
  value, 
  icon, 
  iconColor, 
  valueColor, 
  bgColor 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon icon={icon} className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
