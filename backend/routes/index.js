import express from 'express'

// our routes imports
import userRoutes from './users.routes.js'
import taskRoutes from './tasks.routes.js'

const router = express.Router();

// our routes
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

export default router;