import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of atleast 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({ message: "Email already exists, use different email" });
    }

    const idx = Math.floor(Math.random()*100) +1;
    const randomAvatar= `https://avatar.iran.liara.run/public/${idx}.png` 

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // ------------------------------------------------------------------
    // REMOVED: Legacy Stream Chat/Video user creation logic
    // (This is no longer needed since you switched to Socket.io)
    // ------------------------------------------------------------------

    // JWT is JSON Web Token
    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
      expiresIn: "7d"
    })

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,
      httpOnly:true, // prevent XSS attacks
      sameSite:"strict", // prevent CSRF attacks
      secure:process.env.NODE_ENV==="production"
    });

    res.status(201).json({success:true, user:newUser})

  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export async function login(req, res) {
  try {
    const { email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findOne({email});
    if(!user) return res.status(401).json({message: "Invalid email or password"});

    const isPasswordCorrect = await user.matchPassword(password)
    if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});

    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
      expiresIn: "7d"
    })

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,
      httpOnly:true, // prevent XSS attacks
      sameSite:"strict", // prevent CSRF attacks
      secure:process.env.NODE_ENV==="production"
    });

    res.status(200).json({success:true, user});

  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({success:true, message:"logout Successful"});
}

export async function onboard(req,res){
  try {
    const userId = req.user._id;
    const {fullName,bio , location}= req.body;

    if(!fullName || !bio ||  !location){
      return res.status(400).json({
        message:"All fields are required",
        missingFields:[
          !fullName && "fullName",
          !bio && "bio",
          !location && "location",
        ].filter(Boolean),
      })
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded:true
    },{new:true})

    if(!updatedUser) return req.status(404).json({message:"User not found"});

    // ------------------------------------------------------------------
    // REMOVED: Legacy Stream Chat/Video user update logic
    // (This is no longer needed since you switched to Socket.io)
    // ------------------------------------------------------------------

    res.status(200).json({success:true,user:updatedUser});
  } catch (error) {
    console.error("Onboarding error", error);
    return req.status(500).json({message:"Internal Server Error"})
  }
}
