// /hooks/useChat.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
});



export default function useChat(authUser, targetUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const roomId =
    authUser && targetUserId
      ? [authUser._id, targetUserId].sort().join("-")
      : null;

  // Fetch messages & setup socket listeners
  useEffect(() => {
    if (!authUser || !targetUserId || !roomId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    socket.emit("join_room", roomId);

    const handleReceiveMessage = (msg) =>
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));

    const handleMessageUpdated = (updatedMsg) =>
      setMessages((prev) => prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)));

    const handleTypingStart = ({ senderId }) => {
      if (senderId !== authUser._id)
        setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
    };

    const handleTypingStop = ({ senderId }) => {
      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[senderId];
        return newState;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("typing_start", handleTypingStart);
    socket.on("typing_stop", handleTypingStop);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("typing_start", handleTypingStart);
      socket.off("typing_stop", handleTypingStop);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [authUser, targetUserId, roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  return { messages, setMessages, loading, typingUsers, messagesEndRef, socket, roomId, typingTimeout };
}

