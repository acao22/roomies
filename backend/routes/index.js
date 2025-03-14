import express from 'express'

// our routes imports
import userRoutes from './users.routes.js'

const router = express.Router();

// our routes
router.use('/users', userRoutes);

export default router;