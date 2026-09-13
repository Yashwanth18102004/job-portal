const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getAllApplicationsForRecruiter,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:jobId', protect, authorize('jobseeker'), applyToJob);
router.get('/mine', protect, authorize('jobseeker'), getMyApplications);
router.get('/recruiter/all', protect, authorize('recruiter'), getAllApplicationsForRecruiter);
router.get('/job/:jobId', protect, authorize('recruiter'), getApplicationsForJob);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
