const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, createJob, updateJob,
  deleteJob, applyToJob, getMyJobs, getJobApplicants,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/myjobs', protect, getMyJobs);
router.get('/:id', getJob);
router.get('/:id/applicants', protect, getJobApplicants);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
