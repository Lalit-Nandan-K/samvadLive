import { useState, useRef } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useChat from "../hooks/useChat";
import ChatLoader from "../components/ChatLoader";
import ChatMessages from "../components/chat/ChatMessages";
import TypingIndicator from "../components/chat/TypingIndicator";
import ReplyBar from "../components/chat/ReplyBar";
import ChatInput from "../components/chat/ChatInput";
import toast from "react-hot-toast";
import axios from "../lib/axios.js"; // <--- ADDED: You need to import axios to use it here.

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const inputRef = useRef(null);

  const { messages, setMessages, loading, typingUsers, messagesEndRef, socket, roomId, typingTimeout } = useChat(authUser, targetUserId);

  const cancelReply = () => setReplyingTo(null);

  const handleReply = (msg) => {
    setReplyingTo(msg);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);

    if (text.length > 0) socket.emit("typing_start", { roomId, senderId: authUser._id });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", { roomId, senderId: authUser._id });
    }, 3000);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  const sendMessage = () => {
    if (!newMessage.trim() || !roomId || !authUser) return;

    socket.emit("send_message", {
      roomId,
      senderId: authUser._id,
      text: newMessage,
      replyTo: replyingTo?._id || null
    });

    setNewMessage("");
    cancelReply();
    socket.emit("typing_stop", { roomId, senderId: authUser._id });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log("Selected file:", file);   // 🧪 check file select

  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file...");   // 🧪 before upload

    const res = await axios.post("/chat/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("UPLOAD RESPONSE:", res.data);  // 🧪 backend response

    const fileUrl = res.data.fileUrl;
    console.log("File URL received:", fileUrl); // 🧪 url check

    socket.emit("send_message", {
      roomId,
      senderId: authUser._id,
      fileUrl: fileUrl,
    });

    console.log("Message emitted to socket");  // 🧪 socket check

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
};


  const sendReaction = (messageId, emoji) => {
    socket.emit("add_reaction", { messageId, userId: authUser._id, emoji, roomId });
    setShowReactions(null);
  };

  if (loading) return <ChatLoader />;

  return (
    <div className="h-[93vh] flex flex-col">
      <ChatMessages
        messages={messages}
        authUser={authUser}
        handleReply={handleReply}
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        sendReaction={sendReaction}
        messagesEndRef={messagesEndRef}
      />

      <TypingIndicator typingUsers={typingUsers} />

      <ReplyBar replyingTo={replyingTo} cancelReply={cancelReply} />

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleFileChange={handleFileChange}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ChatPage;
