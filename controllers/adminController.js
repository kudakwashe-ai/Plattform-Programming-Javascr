const prisma = require('../prisma/client');

// --- Application Management ---

exports.getApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            include: {
                user: {
                    include: { profile: true }
                },
                job: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        res.render('admin/applications', {
            user: req.session.user,
            applications
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading applications', error });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await prisma.application.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error updating application status', error });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const jobCount = await prisma.job.count();
        const userCount = await prisma.user.count({ where: { role: 'USER' } });
        const applicationCount = await prisma.application.count();
        const pendingReviews = await prisma.application.count({ where: { status: 'PENDING' } });

        const recentApplications = await prisma.application.findMany({
            take: 5,
            orderBy: { appliedAt: 'desc' },
            include: {
                user: {
                    include: { profile: true }
                },
                job: true
            }
        });

        res.render('admin/dashboard', {
            user: req.session.user,
            stats: { jobCount, userCount, applicationCount, pendingReviews },
            recentApplications
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading dashboard', error });
    }
};

// --- Job Management ---

exports.getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.render('admin/jobs/index', {
            user: req.session.user,
            jobs
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading jobs', error });
    }
};

exports.getCreateJob = (req, res) => {
    res.render('admin/jobs/form', {
        user: req.session.user,
        job: null, // Indicates create mode
        action: '/admin/jobs'
    });
};

exports.postCreateJob = async (req, res) => {
    const { title, company, location, type, category, salaryMin, salaryMax, description, requirements, deadline } = req.body;

    try {
        await prisma.job.create({
            data: {
                title,
                company,
                location,
                type,
                category,
                salaryMin: salaryMin ? parseInt(salaryMin) : null,
                salaryMax: salaryMax ? parseInt(salaryMax) : null,
                description,
                requirements,
                deadline: new Date(deadline),
                isActive: true
            }
        });
        res.redirect('/admin/jobs');
    } catch (error) {
        console.error(error);
        res.render('admin/jobs/form', {
            user: req.session.user,
            job: req.body, // Preserve input
            action: '/admin/jobs',
            error: 'Failed to create job'
        });
    }
};

exports.getEditJob = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await prisma.job.findUnique({ where: { id: parseInt(id) } });
        if (!job) return res.status(404).render('error', { message: 'Job not found' });

        res.render('admin/jobs/form', {
            user: req.session.user,
            job,
            action: `/admin/jobs/${id}`
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading job', error });
    }
};

exports.postEditJob = async (req, res) => {
    const { id } = req.params;
    const { title, company, location, type, category, salaryMin, salaryMax, description, requirements, deadline, isActive } = req.body;

    try {
        await prisma.job.update({
            where: { id: parseInt(id) },
            data: {
                title,
                company,
                location,
                type,
                category,
                salaryMin: salaryMin ? parseInt(salaryMin) : null,
                salaryMax: salaryMax ? parseInt(salaryMax) : null,
                description,
                requirements,
                deadline: new Date(deadline),
                isActive: isActive === 'on' // Checkbox
            }
        });
        res.redirect('/admin/jobs');
    } catch (error) {
        console.error(error);
        res.render('admin/jobs/form', {
            user: req.session.user,
            job: { ...req.body, id },
            action: `/admin/jobs/${id}`,
            error: 'Failed to update job'
        });
    }
};

exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.job.delete({ where: { id: parseInt(id) } });
        res.redirect('/admin/jobs');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/jobs');
    }
};
