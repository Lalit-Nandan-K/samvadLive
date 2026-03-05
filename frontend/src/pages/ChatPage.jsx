import { useState, useRef } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useChat from "../hooks/useChat";
import ChatLoader from "../components/ChatLoader";
import ChatMessages from "../components/chat/ChatMessages";
import TypingIndicator from "../components/chat/TypingIndicator";
import ReplyBar from "../components/chat/ReplyBar";
import ChatInput from "../components/chat/ChatInput";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const { messages, loading, typingUsers, messagesEndRef, socket, roomId, typingTimeout } = useChat(authUser, targetUserId);

  const cancelReply = () => setReplyingTo(null);

  const handleReply = (msg) => {
    setReplyingTo(msg);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);

    if (text.length > 0) socket.emit("typing_start", { roomId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", { roomId });
    }, 3000);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  const sendMessage = () => {
    if (!newMessage.trim() || !roomId || !authUser) return;

    socket.emit("send_message", {
      roomId,
      text: newMessage,
      replyTo: replyingTo?._id || null
    });

    setNewMessage("");
    cancelReply();
    socket.emit("typing_stop", { roomId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!roomId || !authUser) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`/chat/upload/${roomId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.fileUrl;

      socket.emit("send_message", {
        roomId,
        fileUrl: fileUrl,
        replyTo: replyingTo?._id || null,
      });

      cancelReply();
      toast.success("File uploaded");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };


  const sendReaction = (messageId, emoji) => {
    socket.emit("add_reaction", { messageId, emoji, roomId });
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
        sendMessage={sendMessage}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleFileChange={handleFileChange}
        inputRef={inputRef}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ChatPage;
