import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { canUserAccessRoom } from "../lib/chat-room.js";

function getSocketToken(socket) {
  const cookieHeader = socket.handshake.headers?.cookie;
  if (!cookieHeader) return null;
  const cookies = parseCookie(cookieHeader);
  return cookies.jwt || null;
}

export const initChatSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = getSocketToken(socket);
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return next(new Error("Unauthorized"));

      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const hasJoinedRoom = (roomId) => Boolean(roomId && socket.rooms.has(roomId));

    const canJoinRoom = async (roomId) => {
      try {
        const freshUser = await User.findById(socket.user._id).select("friends");
        if (!freshUser) return false;
        return canUserAccessRoom(
          { _id: socket.user._id, friends: freshUser.friends || [] },
          roomId
        );
      } catch (err) {
        console.error("Error validating room access:", err);
        return false;
      }
    };

    const ensureJoinedRoom = async (roomId) => {
      if (hasJoinedRoom(roomId)) return true;
      if (!(await canJoinRoom(roomId))) return false;
      socket.join(roomId);
      console.log(`Socket ${socket.id} auto-joined room ${roomId}`);
      return true;
    };

    socket.on("join_room", async (roomId) => {
      if (!(await ensureJoinedRoom(roomId))) return;
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", async (data) => {
      const { roomId, text, fileUrl, replyTo } = data || {};
      const senderId = socket.user._id;
      const trimmedText = typeof text === "string" ? text.trim() : "";

      if (!(await ensureJoinedRoom(roomId))) return;
      if (!trimmedText && !fileUrl) return;

      try {
        const newMsg = new Message({
          roomId,
          senderId,
          text: trimmedText,
          fileUrl: fileUrl || null,
          replyTo: replyTo || null,
          createdAt: new Date(),
        });

        const savedMsg = await newMsg.save();
        io.to(roomId).emit("receive_message", savedMsg);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("typing_start", async ({ roomId } = {}) => {
      if (!(await ensureJoinedRoom(roomId))) return;
      socket.to(roomId).emit("typing_start", { senderId: socket.user._id.toString() });
    });

    socket.on("typing_stop", async ({ roomId } = {}) => {
      if (!(await ensureJoinedRoom(roomId))) return;
      socket.to(roomId).emit("typing_stop", { senderId: socket.user._id.toString() });
    });

    socket.on("add_reaction", async ({ messageId, emoji, roomId } = {}) => {
      if (!messageId || !emoji || typeof emoji !== "string") return;
      if (!(await ensureJoinedRoom(roomId))) return;

      try {
        await Message.findOneAndUpdate(
          { _id: messageId, roomId },
          { $pull: { reactions: { userId: socket.user._id } } }
        );

        const updatedMsg = await Message.findOneAndUpdate(
          { _id: messageId, roomId },
          { $push: { reactions: { userId: socket.user._id, emoji } } },
          { new: true }
        );

        if (updatedMsg) io.to(roomId).emit("message_updated", updatedMsg);
      } catch (err) {
        console.error("Error adding reaction:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
