const Application = require('../models/Application');
const Job = require('../models/Job');

// @route POST /api/applications/:jobId   (jobseeker only)
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({ application });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting application', error: err.message });
  }
};

// @route GET /api/applications/mine   (jobseeker only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .sort('-createdAt')
      .populate({ path: 'job', select: 'title company location type salaryMin salaryMax' });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching applications', error: err.message });
  }
};

// @route GET /api/applications/job/:jobId   (recruiter, owner of job only)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: job._id })
      .sort('-createdAt')
      .populate('applicant', 'name email phone skills resumeUrl');

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching applications', error: err.message });
  }
};

// @route GET /api/applications/recruiter/all   (recruiter only) - all applications across their jobs
exports.getAllApplicationsForRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .sort('-createdAt')
      .populate('applicant', 'name email skills')
      .populate('job', 'title company');

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching applications', error: err.message });
  }
};

// @route PUT /api/applications/:id/status   (recruiter, owner of job only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating application', error: err.message });
  }
};
