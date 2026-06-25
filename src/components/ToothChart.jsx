import React from 'react';
import Tooth from './Tooth';

const ToothChart = ({
  teethStates,
  onToothClick,
  selectedTooth,
  bleedingMap,
}) => {
  const teethArray = Array.from(
    { length: 32 },
    (_, i) => i + 1
  );

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
      {teethArray.map((num) => (
        <Tooth
          key={num}
          num={num}
          status={teethStates[num] || 0}
          bleedingLevel={bleedingMap?.[num] || 0}
          isSelected={selectedTooth === num}
          onClick={() => onToothClick(num)}
        />
      ))}
    </div>
  );
};

export default ToothChart;