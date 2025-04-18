import express from 'express';
import { check } from 'express-validator';
import { 
  createApplication, 
  getUserApplications, 
  getJobApplications, 
  updateApplicationStatus 
} from '../controllers/applicationController.js';
import { protect, isEmployer, isEmployee } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  protect,
  isEmployee,
  [
    check('jobId', 'Job ID is required').notEmpty(),
    check('resume', 'Resume link is required').notEmpty()
  ],
  createApplication
);

router.get('/', protect, isEmployee, getUserApplications);
router.get('/job/:jobId', protect, isEmployer, getJobApplications);

router.put(
  '/:id',
  protect,
  isEmployer,
  [
    check('status', 'Status must be one of: pending, reviewing, accepted, rejected')
      .isIn(['pending', 'reviewing', 'accepted', 'rejected'])
  ],
  updateApplicationStatus
);

export default router;