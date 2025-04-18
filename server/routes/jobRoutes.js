import express from 'express';
import { check } from 'express-validator';
import { 
  getJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob, 
  getEmployerJobs 
} from '../controllers/jobController.js';
import { protect, isEmployer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post(
  '/',
  protect,
  isEmployer,
  [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('type', 'Type must be one of: Full-time, Part-time, Contract, Internship')
      .isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
    check('location', 'Location is required').notEmpty(),
    check('description', 'Description is required').notEmpty()
  ],
  createJob
);

router.put(
  '/:id',
  protect,
  isEmployer,
  [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('type', 'Type must be one of: Full-time, Part-time, Contract, Internship')
      .isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
    check('location', 'Location is required').notEmpty(),
    check('description', 'Description is required').notEmpty()
  ],
  updateJob
);

router.delete('/:id', protect, isEmployer, deleteJob);
router.get('/employer/jobs', protect, isEmployer, getEmployerJobs);

export default router;