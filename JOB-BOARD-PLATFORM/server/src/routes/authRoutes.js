import express from "express";
import { createToken } from "../utils/token.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

const sanitizeUser = (user) => ({
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

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      company: role === "employer" ? { name: companyName || "" } : undefined
    });

    res.status(201).json({ user: sanitizeUser(user), token: createToken(user._id) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({ user: sanitizeUser(user), token: createToken(user._id) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export default router;

