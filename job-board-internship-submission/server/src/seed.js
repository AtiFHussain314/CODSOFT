import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Application from "./models/Application.js";
import Job from "./models/Job.js";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([Application.deleteMany({}), Job.deleteMany({}), User.deleteMany({})]);

  const [employer, candidate] = await User.create([
    {
      name: "Maya Chen",
      email: "employer@example.com",
      password: "Password123",
      role: "employer",
      company: {
        name: "Northstar Labs",
        website: "https://northstarlabs.example",
        size: "51-200",
        description: "Product studio building workflow tools for distributed teams."
      },
      location: "Austin, TX"
    },
    {
      name: "Jordan Rivera",
      email: "candidate@example.com",
      password: "Password123",
      role: "candidate",
      headline: "Full-stack engineer focused on React and Node.js",
      location: "Remote",
      skills: ["React", "Node.js", "MongoDB"]
    }
  ]);

  await Job.create([
    {
      title: "Senior Frontend Engineer",
      company: "Northstar Labs",
      location: "Remote - US",
      type: "Remote",
      salaryMin: 135000,
      salaryMax: 170000,
      description: "Lead the build-out of a polished workflow product used by operations teams.",
      requirements: ["5+ years with React", "Strong accessibility instincts", "Experience mentoring engineers"],
      benefits: ["Remote-first culture", "Equity package", "Learning stipend"],
      tags: ["React", "TypeScript", "Design Systems"],
      featured: true,
      employer: employer._id
    },
    {
      title: "Backend API Developer",
      company: "Northstar Labs",
      location: "Austin, TX",
      type: "Full-time",
      salaryMin: 120000,
      salaryMax: 150000,
      description: "Design secure, observable APIs for job matching and notifications.",
      requirements: ["Node.js and Express", "MongoDB or PostgreSQL", "Authentication and security fundamentals"],
      benefits: ["Hybrid schedule", "Health coverage", "401k match"],
      tags: ["Node.js", "Express", "MongoDB"],
      featured: true,
      employer: employer._id
    },
    {
      title: "Product Operations Analyst",
      company: "Northstar Labs",
      location: "Chicago, IL",
      type: "Contract",
      salaryMin: 70000,
      salaryMax: 90000,
      description: "Help customers turn hiring data into better decisions and smoother processes.",
      requirements: ["Strong spreadsheet skills", "Customer-facing experience", "Clear writing"],
      benefits: ["Flexible schedule", "Remote Fridays"],
      tags: ["Operations", "Analytics", "Customer Success"],
      employer: employer._id
    }
  ]);

  console.log("Seed complete");
  console.log("Employer login: employer@example.com / Password123");
  console.log("Candidate login: candidate@example.com / Password123");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

