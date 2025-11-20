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
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ------------------- Middleware -------------------
const allowedOrigins = [
  "http://localhost:5173",               // local frontend
  "http://localhost:3000",               // optional local port
  "https://samvad-live19.vercel.app",    // production frontend (Vercel)
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("❌ Blocked CORS request from:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ✅ Very important for cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- Routes -------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);



// ------------------- Server & Socket.io -------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});



// Initialize chat socket
initChatSocket(io);

// ------------------- Connect DB and Start Server -------------------
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to DB:", err));
