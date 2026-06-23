function Tooth({ tooth, onClick }) {
  const colors = {
    healthy:
      "bg-gradient-to-r from-green-400 to-emerald-500",

    cavity:
      "bg-gradient-to-r from-red-400 to-pink-500",

    filled:
      "bg-gradient-to-r from-blue-400 to-cyan-500",

    missing:
      "bg-gradient-to-r from-gray-400 to-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-16 h-16
        rounded-2xl
        text-white
        font-bold
        text-lg
        shadow-xl
        hover:scale-110
        hover:rotate-3
        transition-all
        duration-300
        ${colors[tooth.status]}
      `}
    >
      {tooth.id}
    </button>
  );
}

export default Tooth;