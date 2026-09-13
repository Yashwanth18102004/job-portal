const Job = require('../models/Job');

// @route GET /api/jobs
// Supports: search keyword, location, type, experience, salary range, pagination
exports.getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      type,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const query = { status: 'Active' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (minSalary) query.salaryMax = { $gte: Number(minSalary) };
    if (maxSalary) query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(maxSalary) };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(Number(limit)).populate('recruiter', 'name company'),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching jobs', error: err.message });
  }
};

// @route GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching job', error: err.message });
  }
};

// @route POST /api/jobs   (recruiter only)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user._id });
    res.status(201).json({ job });
  } catch (err) {
    res.status(400).json({ message: 'Error creating job', error: err.message });
  }
};

// @route PUT /api/jobs/:id   (recruiter who owns the job only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ job });
  } catch (err) {
    res.status(400).json({ message: 'Error updating job', error: err.message });
  }
};

// @route DELETE /api/jobs/:id   (recruiter who owns the job only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting job', error: err.message });
  }
};

// @route GET /api/jobs/recruiter/mine   (recruiter only)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort('-createdAt');
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching your jobs', error: err.message });
  }
};

// @route PUT /api/jobs/:id/save   (jobseeker only) - toggle saved job
exports.toggleSaveJob = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = req.user;
    const jobId = req.params.id;

    const alreadySaved = user.savedJobs.some((id) => id.toString() === jobId);
    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();

    res.json({ savedJobs: user.savedJobs, saved: !alreadySaved });
  } catch (err) {
    res.status(500).json({ message: 'Server error saving job', error: err.message });
  }
};
