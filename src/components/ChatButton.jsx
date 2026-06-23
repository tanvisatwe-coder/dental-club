export default function ChatButton({ openChat }) {
  return (
    <button
      onClick={openChat}
      className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
    >
      Chat 💬
    </button>
  );
}