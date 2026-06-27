import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    coverLetter: {
      type: String,
      required: true
    },
    resumeUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "shortlisted", "rejected", "hired"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;

