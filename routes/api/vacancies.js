const express = require('express');
const router = express.Router();

const prisma = require('../../prisma/client');

// Public Job Board / Homepage
const renderJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.render('jobs/index', {
            title: 'Jobit - Find Your Dream Job',
            jobs: jobs,
            user: req.session.user || null
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error fetching jobs', error });
    }
};

router.get('/', renderJobs);
router.get('/jobs', renderJobs);

// Job Details
router.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) }
        });
        if (!job) return res.status(404).render('error', { message: 'Job not found', error: { status: 404 } });

        res.render('jobs/show', {
            title: job.title,
            job,
            user: req.session.user || null
        });
    } catch (error) {
        res.render('error', { message: 'Error fetching job', error });
    }
});

module.exports = router;
