// /components/chat/MessageBubble.jsx
import { Paperclip, Reply } from "lucide-react";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : import.meta.env.VITE_BACKEND_URL;


const availableEmojis = ["👍", "❤️", "😂", "😡", "😢"];

export default function MessageBubble({ msg, authUser, handleReply, showReactions, setShowReactions, sendReaction, messages }) {
  const isOwn = msg.senderId === authUser._id;
  const repliedMsg = messages.find((m) => m._id === msg.replyTo);

  return (
    <div className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <button
          onClick={() => handleReply(msg)}
          className="text-gray-500 hover:text-blue-600 p-1 rounded transition"
          title="Reply"
        >
          <Reply size={16} />
        </button>
      )}

      <div className="flex flex-col max-w-[75%]">
        {msg.replyTo && (
          <div className={`text-sm bg-white border border-blue-200 rounded-lg px-3 py-1 mb-1 shadow-sm ${isOwn ? "ml-auto" : "mr-auto"}`}>
            <p className="text-xs text-blue-600 font-semibold mb-0.5">Replying to:</p>
            <p className="truncate text-gray-700">
              {repliedMsg?.text || (repliedMsg?.fileUrl ? "File Message" : "Original Message")}
            </p>
          </div>
        )}

        <div
          className={`relative px-4 py-2 rounded-2xl shadow-sm ${isOwn ? "bg-blue-500 text-white rounded-br-none self-end" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"}`}
          onDoubleClick={() => setShowReactions(msg._id)}
        >
          {msg.fileUrl && msg.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
  <img
    src={msg.fileUrl}
    alt="Sent file"
    className="rounded-lg max-w-[250px] max-h-[250px] object-cover border border-gray-200"
  />
) : msg.fileUrl ? (
  <a
    href={msg.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md"
  >
    ⬇️ Download File
  </a>
) : (
  <p>{msg.text}</p>
)}


          {showReactions === msg._id && (
            <div className={`absolute -top-10 bg-white border shadow-md rounded-full flex gap-1 p-1 ${isOwn ? "right-0" : "left-0"}`}>
              {availableEmojis.map((emoji) => (
                <button key={emoji} onClick={() => sendReaction(msg._id, emoji)} className="hover:bg-gray-100 p-1 rounded-full text-lg">{emoji}</button>
              ))}
            </div>
          )}

          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`absolute bottom-0 p-1 text-xs bg-white rounded-full shadow-md ${isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"}`}>
              {[...new Set(msg.reactions.map((r) => r.emoji))].map((emoji, i) => <span key={i} className="mr-0.5">{emoji}</span>)}
            </div>
          )}
        </div>
      </div>

      {isOwn && (
        <button onClick={() => handleReply(msg)} className="text-gray-500 hover:text-blue-600 p-1 rounded transition" title="Reply">
          <Reply size={16} />
        </button>
      )}
    </div>
  );
}
