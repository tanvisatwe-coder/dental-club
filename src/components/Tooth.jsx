import React from 'react';

const Tooth = ({
  num,
  status,
  bleedingLevel = 0,
  isSelected = false,
  onClick,
}) => {
  let bgStyleClass =
    "bg-emerald-500 hover:bg-emerald-600 border-emerald-600/10";

  // Cavity
  if (status === 1) {
    bgStyleClass =
      "bg-gradient-to-br from-pink-400 to-rose-500 border-rose-600/10";
  }

  // Filled
  else if (status === 2) {
    bgStyleClass =
      "bg-gradient-to-br from-sky-400 to-blue-500 border-blue-600/10";
  }

  // Bleeding colors override
  if (bleedingLevel === 1) {
    bgStyleClass =
      "bg-green-400 border-green-500";
  }

  if (bleedingLevel === 2) {
    bgStyleClass =
      "bg-lime-400 border-lime-500";
  }

  if (bleedingLevel === 3) {
    bgStyleClass =
      "bg-yellow-400 border-yellow-500 text-black";
  }

  if (bleedingLevel === 4) {
    bgStyleClass =
      "bg-orange-500 border-orange-600";
  }

  if (bleedingLevel === 5) {
    bgStyleClass =
      "bg-red-600 border-red-700";
  }

  return (
    <div
      onClick={onClick}
      className={`
        aspect-square
        flex
        items-center
        justify-center
        rounded-2xl
        font-bold
        text-lg
        cursor-pointer
        transition-all
        duration-150
        shadow-md
        border-2
        hover:scale-105
        active:scale-95
        ${bgStyleClass}
        ${isSelected ? "ring-4 ring-purple-500 scale-110" : ""}
      `}
    >
      {num}
    </div>
  );
};

export default Tooth;