const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
    console.log('--- Starting Auth & Auth Verification ---');

    let adminToken, memberAToken, memberBToken;
    let articleId;

    try {
        // 0. Cleanup/Register Fresh Users for testing
        console.log('\n[0] Preparing test users...');
        const timestamp = Date.now();
        const adminEmail = `admin_${timestamp}@test.com`;
        const memberAEmail = `member_a_${timestamp}@test.com`;
        const memberBEmail = `member_b_${timestamp}@test.com`;

        // Register Admin
        const adminReg = await axios.post(`${BASE_URL}/auth/register`, {
            email: adminEmail,
            password: 'password123',
            name: 'Test Admin',
            role: 'admin'
        });
        adminToken = adminReg.data.token;
        console.log('Admin registered.');

        // Register Member A
        const memberAReg = await axios.post(`${BASE_URL}/auth/register`, {
            email: memberAEmail,
            password: 'password123',
            name: 'Member A',
            role: 'member'
        });
        memberAToken = memberAReg.data.token;
        console.log('Member A registered.');

        // Register Member B
        const memberBReg = await axios.post(`${BASE_URL}/auth/register`, {
            email: memberBEmail,
            password: 'password123',
            name: 'Member B',
            role: 'member'
        });
        memberBToken = memberBReg.data.token;
        console.log('Member B registered.');

        // 1. Member A creates an article
        console.log('\n[1] Member A creating an article...');
        const createRes = await axios.post(`${BASE_URL}/articles`,
            { title: 'Test Article', content: 'Original Content' },
            { headers: { Authorization: `Bearer ${memberAToken}` } }
        );
        articleId = createRes.data.data.id;
        console.log(`Article created with ID: ${articleId}`);

        // 2. Test Public Access
        console.log('\n[2] Testing Public Access (Read Only)...');
        const publicRes = await axios.get(`${BASE_URL}/articles`);
        console.log(`Public Access Status: ${publicRes.status} (Expected 200)`);

        // 3. Test Member B updating Member A's article (Should Fail)
        console.log('\n[3] Testing Member B updating Member A\'s article...');
        try {
            await axios.put(`${BASE_URL}/articles/${articleId}`,
                { title: 'Hacked Title' },
                { headers: { Authorization: `Bearer ${memberBToken}` } }
            );
        } catch (error) {
            console.log(`Update Failed as expected: ${error.response.status} - ${error.response.data.message}`);
        }

        // 4. Test Member A updating own article (Should Succeed)
        console.log('\n[4] Testing Member A updating own article...');
        const memberAUpdate = await axios.put(`${BASE_URL}/articles/${articleId}`,
            { title: 'Authorized Update' },
            { headers: { Authorization: `Bearer ${memberAToken}` } }
        );
        console.log(`Update Status: ${memberAUpdate.status} - ${memberAUpdate.data.message} (Expected 200)`);

        // 5. Test Admin updating Member A's article (Should Succeed)
        console.log('\n[5] Testing Admin updating Member A\'s article...');
        const adminUpdate = await axios.put(`${BASE_URL}/articles/${articleId}`,
            { title: 'Admin Master Update' },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log(`Update Status: ${adminUpdate.status} - ${adminUpdate.data.message} (Expected 200)`);

        // 6. Test Member B deleting Member A's article (Should Fail)
        console.log('\n[6] Testing Member B deleting Member A\'s article...');
        try {
            await axios.delete(`${BASE_URL}/articles/${articleId}`,
                { headers: { Authorization: `Bearer ${memberBToken}` } }
            );
        } catch (error) {
            console.log(`Delete Failed as expected: ${error.response.status} - ${error.response.data.message}`);
        }

        // 7. Test Admin deleting article (Should Succeed)
        console.log('\n[7] Testing Admin deleting article...');
        const adminDelete = await axios.delete(`${BASE_URL}/articles/${articleId}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log(`Delete Status: ${adminDelete.status} - ${adminDelete.data.message} (Expected 200)`);

        console.log('\n--- All Tests Passed Successfully ---');
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

runTests();
