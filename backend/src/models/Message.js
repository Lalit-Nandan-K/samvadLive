import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, default: "" },
  fileUrl: { type: String, default: null },

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },

  reactions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      emoji: { type: String },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
