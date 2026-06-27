import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { sendEmail } from "../config/mailer.js";
import { uploadResume } from "../middleware/upload.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const router = express.Router();

router.post("/", protect, authorize("candidate"), uploadResume.single("resume"), async (req, res, next) => {
  try {
    const { jobId, name, email, phone, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate("employer", "email name company");

    if (!job || job.status !== "open") {
      return res.status(404).json({ message: "This job is not accepting applications." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume upload is required." });
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      employer: job.employer._id,
      name,
      email,
      phone,
      coverLetter,
      resumeUrl: `/uploads/resumes/${req.file.filename}`
    });

    await Promise.all([
      sendEmail({
        to: email,
        subject: `Application received for ${job.title}`,
        html: `<p>Hi ${name},</p><p>Your application for <strong>${job.title}</strong> at ${job.company} was submitted successfully.</p>`
      }),
      sendEmail({
        to: job.employer.email,
        subject: `New application for ${job.title}`,
        html: `<p>${name} applied for <strong>${job.title}</strong>.</p><p>Review the candidate dashboard in TalentBridge.</p>`
      })
    ]);

    res.status(201).json({ application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already applied for this job." });
    }
    next(error);
  }
});

router.get("/mine", protect, authorize("candidate"), async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location type status")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

router.get("/received", protect, authorize("employer"), async (req, res, next) => {
  try {
    const applications = await Application.find({ employer: req.user._id })
      .populate("job", "title company")
      .populate("candidate", "name email headline location skills")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", protect, authorize("employer"), async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, employer: req.user._id }).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found." });

    application.status = req.body.status || application.status;
    await application.save();

    await sendEmail({
      to: application.email,
      subject: `Update for your ${application.job.title} application`,
      html: `<p>Hi ${application.name},</p><p>Your application status is now <strong>${application.status}</strong>.</p>`
    });

    res.json({ application });
  } catch (error) {
    next(error);
  }
});

export default router;

