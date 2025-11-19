import User from "../models/User.js";
import jwt from "jsonwebtoken";

// -------------------- SIGNUP --------------------
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, use a different email" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // ------------------ COOKIE ------------------
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production", // only HTTPS
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------- LOGIN --------------------
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------- LOGOUT --------------------
export async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logout Successful" });
}

// -------------------- ONBOARD --------------------
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, location } = req.body;

    if (!fullName || !bio || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarded: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
