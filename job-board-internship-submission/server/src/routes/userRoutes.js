import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

const cleanUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  headline: user.headline,
  location: user.location,
  company: user.company,
  skills: user.skills,
  resumeUrl: user.resumeUrl
});

router.put("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const allowed = ["name", "headline", "location", "company", "skills", "resumeUrl"];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    if (typeof req.body.skills === "string") {
      user.skills = req.body.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    await user.save();
    res.json({ user: cleanUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;

