const express = require('express');
const router = express.Router();
const { checkRole } = require('../../middleware/roles');
const adminController = require('../../controllers/adminController');

// Protect all admin routes
router.use(checkRole('ADMIN'));

router.get('/', adminController.getDashboard);

// Job Management
router.get('/jobs', adminController.getJobs);
router.get('/jobs/new', adminController.getCreateJob);
router.post('/jobs', adminController.postCreateJob);
router.get('/jobs/:id/edit', adminController.getEditJob);
router.post('/jobs/:id', adminController.postEditJob);
router.post('/jobs/:id/delete', adminController.deleteJob);

// Application Management
router.get('/applications', adminController.getApplications);
router.post('/applications/:id/status', adminController.updateApplicationStatus);

// User Management (Placeholder)
router.get('/users', (req, res) => res.send('User Management Coming Soon'));

module.exports = router;
