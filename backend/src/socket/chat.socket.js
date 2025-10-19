import Message from "../models/Message.js";

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ------------------ CHAT EVENTS ------------------
    socket.on("join_room", (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", async (data) => {
      const { roomId, senderId, text, fileUrl, replyTo } = data;
      if (!roomId || !senderId || (!text && !fileUrl)) return;

      try {
        const newMsg = new Message({
          roomId,
          senderId,
          text,
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

    socket.on("typing_start", ({ roomId, senderId }) => {
      socket.to(roomId).emit("typing_start", { senderId });
    });

    socket.on("typing_stop", ({ roomId, senderId }) => {
      socket.to(roomId).emit("typing_stop", { senderId });
    });

    socket.on("add_reaction", async ({ messageId, userId, emoji, roomId }) => {
      try {
        const updatedMsg = await Message.findByIdAndUpdate(
          messageId,
          { $push: { reactions: { userId, emoji } } },
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
