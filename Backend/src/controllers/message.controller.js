import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from 'cloudinary';
import {getUserSocketId }from '../libs/socket.js';
import { io } from "../libs/socket.js";

//Load users for Sidebar Showing
export const getUsersForSideBar = async (req, res) => {
  try {
    const myId = req.user._id;

    const users = await User.find({
      _id: { $ne: myId }, //ne=>not equal
    }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("Sidebar Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get message between me and Other users

export const getMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: receiverId } = req.params;
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (err) {
    console.error("Get Message Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Send message to other user

export const sendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    //image uploading in coudinary
    let cloudinaryImageLink;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      cloudinaryImageLink = uploadResult.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      image: cloudinaryImageLink,
    });

    await newMessage.save();

    //This message send to the client by socket
   const receiverSocketId = getUserSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("sendNewMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Message sending failed" });
  }
};
