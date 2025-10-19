// /components/chat/TypingIndicator.jsx
export default function TypingIndicator({ typingUsers }) {
  if (Object.keys(typingUsers).length === 0) return null;

  return (
    <div className="text-gray-500 text-sm p-2 bg-gray-100 border-t border-gray-200 italic">
      {Object.keys(typingUsers).length === 1
        ? "Friend is typing..."
        : "Several people are typing..."}
    </div>
  );
}
