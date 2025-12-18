const prisma = require('./utils/prisma');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:' + (process.env.PORT || 3000) + '/api';

async function setup() {
    try {
        // Clean up
        await prisma.article.deleteMany({});
        await prisma.user.deleteMany({});
        console.log('Cleaned up collections');

        // Create Users (Prisma)
        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                name: 'Admin User'
            }
        });

        const member = await prisma.user.create({
            data: {
                email: 'member@example.com',
                password: 'password123',
                role: 'member',
                name: 'Member User'
            }
        });

        console.log('Users created');

        const adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET);
        const memberToken = jwt.sign({ id: member.id, role: member.role }, process.env.JWT_SECRET);

        return { admin, member, adminToken, memberToken };

    } catch (error) {
        console.error('Setup failed', error);
        process.exit(1);
    }
}

async function runTests() {
    let setupData;
    try {
        setupData = await setup();
    } catch (e) {
        console.error("Setup Error", e);
        return;
    }

    const { admin, member, adminToken, memberToken } = setupData;
    const client = axios.create({ validateStatus: () => true });

    try {
        console.log('--- STARTING TESTS (Prisma v6 + SQLite) ---');

        // 1. Public Get Articles
        let res = await client.get(`${BASE_URL}/articles`);
        console.log(`1. Public Get Articles: ${res.status} ${res.status === 200 ? 'PASS' : 'FAIL'}`);

        // 2. Member Create Article
        res = await client.post(`${BASE_URL}/articles`, {
            title: 'Member Article',
            content: 'Content by member'
        }, { headers: { Authorization: `Bearer ${memberToken}` } });
        console.log(`2. Member Create Article: ${res.status} ${res.status === 201 ? 'PASS' : 'FAIL'}`);
        if (res.status !== 201) console.log(res.data);
        const memberArticleId = res.data.data?.id;

        // 3. Admin Create Article
        res = await client.post(`${BASE_URL}/articles`, {
            title: 'Admin Article',
            content: 'Content by admin'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`3. Admin Create Article: ${res.status} ${res.status === 201 ? 'PASS' : 'FAIL'}`);
        const adminArticleId = res.data.data?.id;

        if (memberArticleId) {
            // 4. Member Update Own Article
            res = await client.put(`${BASE_URL}/articles/${memberArticleId}`, {
                title: 'Member Article Updated',
                content: 'Updated content'
            }, { headers: { Authorization: `Bearer ${memberToken}` } });
            console.log(`4. Member Update Own Article: ${res.status} ${res.status === 200 ? 'PASS' : 'FAIL'}`);

            // 6. Admin Update Member Article
            res = await client.put(`${BASE_URL}/articles/${memberArticleId}`, {
                title: 'Member Article Moderated by Admin',
                content: 'Moderated content'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            console.log(`6. Admin Update Member Article: ${res.status} ${res.status === 200 ? 'PASS' : 'FAIL'}`);

            // 8. Admin Delete Member Article
            res = await client.delete(`${BASE_URL}/articles/${memberArticleId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`8. Admin Delete Member Article: ${res.status} ${res.status === 200 ? 'PASS' : 'FAIL'}`);
        }

        if (adminArticleId) {
            // 5. Member Update Admin Article (Should Fail)
            res = await client.put(`${BASE_URL}/articles/${adminArticleId}`, {
                title: 'Hacked by Member',
                content: 'Hacked content'
            }, { headers: { Authorization: `Bearer ${memberToken}` } });
            console.log(`5. Member Update Admin Article (Should Fail): ${res.status} ${res.status === 403 ? 'PASS' : 'FAIL'}`);

            // 7. Member Delete Admin Article (Should Fail)
            res = await client.delete(`${BASE_URL}/articles/${adminArticleId}`, {
                headers: { Authorization: `Bearer ${memberToken}` }
            });
            console.log(`7. Member Delete Admin Article (Should Fail): ${res.status} ${res.status === 403 ? 'PASS' : 'FAIL'}`);
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: Server is not running. Please start the server on port 3000.');
        } else {
            console.error('Test failed', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

runTests();
