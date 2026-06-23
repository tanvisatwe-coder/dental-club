import React from 'react';
import Tooth from './Tooth';

const ToothChart = ({ teethStates, onToothClick }) => {
  const teethArray = Array.from({ length: 32 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-4 pt-2">
      {teethArray.map((num) => (
        <Tooth 
          key={num} 
          num={num} 
          status={teethStates[num] || 0} 
          onClick={() => onToothClick(num)} 
        />
      ))}
    </div>
  );
};

export default ToothChart;