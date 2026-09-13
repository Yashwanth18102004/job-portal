const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract'],
      default: 'Full Time',
    },
    experience: { type: String, default: 'Fresher' },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    skills: [{ type: String }],
    qualifications: [{ type: String }],
    status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
