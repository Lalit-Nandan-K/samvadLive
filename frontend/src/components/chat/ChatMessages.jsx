// /components/chat/ChatMessages.jsx
import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages, authUser, handleReply, showReactions, setShowReactions, sendReaction, messagesEndRef }) {
  return (
    <div
      ref={messagesEndRef}
      className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          msg={msg}
          authUser={authUser}
          handleReply={handleReply}
          showReactions={showReactions}
          setShowReactions={setShowReactions}
          sendReaction={sendReaction}
          messages={messages}
        />
      ))}
    </div>
  );
}
