// /components/chat/ReplyBar.jsx
export default function ReplyBar({ replyingTo, cancelReply }) {
  if (!replyingTo) return null;

  return (
    <div className="p-2 bg-blue-50 border-t border-blue-200 flex justify-between items-center shadow-inner">
      <div className="text-sm truncate">
        Replying to:
        <span className="font-semibold ml-1 text-gray-700">
          {replyingTo.text || (replyingTo.fileUrl ? "File Message" : "Original Message")}
        </span>
      </div>
      <button
        onClick={cancelReply}
        className="text-gray-500 hover:text-red-500 text-lg font-bold"
      >
        ×
      </button>
    </div>
  );
}
