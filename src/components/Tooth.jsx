import React from 'react';

const Tooth = ({ num, status, onClick }) => {
  let bgStyleClass = "bg-emerald-500 hover:bg-emerald-600 border-emerald-600/10"; // State 0
  
  if (status === 1) {
    bgStyleClass = "bg-gradient-to-br from-pink-400 to-rose-500 border-rose-600/10 shadow-rose-200"; // State 1
  } else if (status === 2) {
    bgStyleClass = "bg-gradient-to-br from-sky-400 to-blue-500 border-blue-600/10 shadow-sky-200"; // State 2
  }

  return (
    <div 
      onClick={onClick}
      className={`aspect-square text-white font-bold flex items-center justify-center rounded-2xl shadow-md border hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 text-xl select-none ${bgStyleClass}`}
    >
      {num}
    </div>
  );
};

export default Tooth;