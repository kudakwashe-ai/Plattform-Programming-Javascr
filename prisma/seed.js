const prisma = require('./client');
const bcrypt = require('bcrypt');

async function main() {
    // 1. Clean up
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();

    console.log('Deleted existing data...');

    // 2. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@jobit.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'USER',
            profile: {
                create: {
                    headline: 'Full Stack Developer',
                    skills: 'JavaScript, Node.js, React, SQL',
                    experience: '3 years of experience building web applications.',
                    // No CV initially to test logic
                }
            }
        }
    });

    console.log('Created Users:');
    console.log('- admin@jobit.com / password123');
    console.log('- john@example.com / password123');

    // 3. Create Jobs
    const jobs = await prisma.job.createMany({
        data: [
            {
                title: 'Senior Frontend Engineer',
                company: 'TechCorp',
                location: 'Remote',
                type: 'FULL_TIME',
                category: 'Engineering',
                salaryMin: 80000,
                salaryMax: 120000,
                description: 'We are looking for an experienced Frontend Engineer to lead our UI team.',
                requirements: '- 5+ years React experience\n- TypeScript proficiency',
                deadline: new Date('2026-12-31')
            },
            {
                title: 'Product Designer',
                company: 'Creative Studio',
                location: 'New York, NY',
                type: 'FULL_TIME',
                category: 'Design',
                salaryMin: 70000,
                salaryMax: 100000,
                description: 'Join our award-winning design team.',
                requirements: '- Portfolio required\n- Figma expert',
                deadline: new Date('2026-06-30')
            },
            {
                title: 'Marketing Intern',
                company: 'GrowthStart',
                location: 'San Francisco, CA',
                type: 'INTERNSHIP',
                category: 'Marketing',
                salaryMin: 30000,
                salaryMax: 40000,
                description: 'Learn from the best in the industry.',
                requirements: '- Strong communication skills',
                deadline: new Date('2026-03-15')
            }
        ]
    });

    console.log(`Created ${jobs.count} sample jobs.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
