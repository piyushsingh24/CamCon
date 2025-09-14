import mongoose from 'mongoose';
import express from 'express';
import Message from "../models/message.js";
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.get("/getMessage", async (req, res) => {
  try {
    const { senderId, mentorId } = req.query;

    if (!senderId || !mentorId)
      return res.status(402).json({ error: "senderId and mentorId are required" });

    const messages = await Message.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(senderId), receiverId: new mongoose.Types.ObjectId(mentorId) },
        { senderId: new mongoose.Types.ObjectId(mentorId), receiverId: new mongoose.Types.ObjectId(senderId) },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/sendMessage", async (req, res) => {
  try {
    const { text, image, senderId, receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({ error: "senderId and receiverId are required" });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      text: text || null,
      image: imageUrl || null,
    });

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
