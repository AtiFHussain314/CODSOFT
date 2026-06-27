import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import Job from "../models/Job.js";

const router = express.Router();

const splitList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

router.get("/", async (req, res, next) => {
  try {
    const { q, location, type, featured, status = "open" } = req.query;
    const query = {};

    if (status !== "all") query.status = status;
    if (featured === "true") query.featured = true;
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, "i");
    if (q) query.$text = { $search: q };

    const jobs = await Job.find(query)
      .populate("employer", "name company email")
      .sort({ featured: -1, createdAt: -1 })
      .limit(100);

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", protect, authorize("employer"), async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name company email");
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorize("employer"), async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      employer: req.user._id,
      company: req.body.company || req.user.company?.name || req.user.name,
      requirements: splitList(req.body.requirements),
      benefits: splitList(req.body.benefits),
      tags: splitList(req.body.tags)
    };

    const job = await Job.create(payload);
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, authorize("employer"), async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found." });

    Object.assign(job, {
      ...req.body,
      requirements: req.body.requirements ? splitList(req.body.requirements) : job.requirements,
      benefits: req.body.benefits ? splitList(req.body.benefits) : job.benefits,
      tags: req.body.tags ? splitList(req.body.tags) : job.tags
    });

    await job.save();
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, authorize("employer"), async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ message: "Job deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;

