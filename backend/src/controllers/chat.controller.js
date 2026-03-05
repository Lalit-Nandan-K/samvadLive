import Message from "../models/Message.js";
import { canUserAccessRoom } from "../lib/chat-room.js";

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!canUserAccessRoom(req.user, roomId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
