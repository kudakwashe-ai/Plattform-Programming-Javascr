const prisma = require('../prisma/client');

// Dashboard: Show Profile Summary & Applications
exports.getDashboard = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.user.id },
            include: {
                profile: true,
                applications: {
                    include: { job: true },
                    orderBy: { appliedAt: 'desc' }
                }
            }
        });

        res.render('member/dashboard', {
            user: user,
            // Check if profile is "complete" (has CV)
            isProfileComplete: !!(user.profile && user.profile.cvPath)
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading dashboard', error });
    }
};

// Profile: Edit Form
exports.getEditProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.user.id },
            include: { profile: true }
        });
        res.render('member/profile', { user, profile: user.profile || {} });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error loading profile', error });
    }
};

// Profile: Update Action
exports.postUpdateProfile = async (req, res) => {
    const { headline, skills, experience } = req.body;
    const cvFile = req.file; // From Multer

    try {
        const updateData = {
            headline,
            skills,
            experience
        };

        if (cvFile) {
            updateData.cvPath = '/uploads/cvs/' + cvFile.filename;
        }

        await prisma.userProfile.upsert({
            where: { userId: req.session.user.id },
            update: updateData,
            create: {
                userId: req.session.user.id,
                ...updateData
            }
        });

        res.redirect('/member/dashboard');
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error updating profile', error });
    }
};

// Application: Apply Action
exports.postApply = async (req, res) => {
    const { id: jobId } = req.params;
    const userId = req.session.user.id;

    try {
        // Check if already applied
        const existingApplication = await prisma.application.findUnique({
            where: {
                userId_jobId: { userId, jobId: parseInt(jobId) }
            }
        });

        if (existingApplication) {
            return res.status(400).render('error', { message: 'You have already applied for this job.' });
        }

        // Check if user has a CV
        const profile = await prisma.userProfile.findUnique({ where: { userId } });
        if (!profile || !profile.cvPath) {
            return res.redirect('/member/profile/edit?message=Please upload your CV before applying.');
        }

        await prisma.application.create({
            data: {
                userId,
                jobId: parseInt(jobId)
            }
        });

        res.redirect('/member/dashboard');
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Application failed', error });
    }
};
