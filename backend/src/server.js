import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { initChatSocket } from "./socket/chat.socket.js";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ------------------- Middleware -------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- Routes -------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ------------------- Server & Socket.io -------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Initialize chat socket
initChatSocket(io);

// ------------------- Connect DB and Start Server -------------------
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to DB:", err));
