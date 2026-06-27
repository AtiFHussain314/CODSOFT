import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time"
    },
    salaryMin: Number,
    salaryMax: Number,
    description: {
      type: String,
      required: true
    },
    requirements: [String],
    benefits: [String],
    tags: [String],
    status: {
      type: String,
      enum: ["open", "paused", "closed"],
      default: "open"
    },
    featured: {
      type: Boolean,
      default: false
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", company: "text", location: "text", tags: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);

export default Job;

