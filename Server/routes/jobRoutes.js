import express from 'express'
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router()

// route to get all job data
router.get('/',getJobs)


// Route to get a single job by id

router.get('/:id',getJobById)

export default router;
