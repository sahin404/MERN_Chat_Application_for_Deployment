import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../libs/cloudinary.js";

//Signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    // Password length validation
    if (password.length < 6) {
      return res.status(400).send("Password Length Must be Greater than 6");
    }

    // Email already exists check
    const isEmailExist = await User.findOne({ email: email });
    if (isEmailExist) {
      return res.status(400).send("User is Already Exists");
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create New User Instance and save to database
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    //generate Token
    try {
      generateToken(savedUser._id, res);
      console.log("New user is created successfully!");
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } catch (tokenError) {
      //token Error so delete the user from database
      await User.findByIdAndDelete(savedUser._id);
      console.error("Token generation failed:", tokenError.message);
      res.status(500).send("Account creation failed due to internal error.");
    }
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(500).json({ message: "Internal Servel Error" });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //user not found
    if (!user) {
      return res.status(404).send("Incorrect Credential!");
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(404).send("Incorrect Credential!");
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ message: "Internal Servel Error" });
  }
};

//logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).send("Logged out successfully.");
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ message: "Internal Servel Error" });
  }
};

//Update
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ Message: "Profile pic is required!" });
    }

    //upload image into cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    //Uploaded image link should set into database
    const userID = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Internal Servel Error" });
  }
};

//check
export const checkAuth = (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({ message: "Internal Servel Error" });
  }
};
