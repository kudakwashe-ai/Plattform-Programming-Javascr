const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testRequest(name, url, expectedStatus) {
    try {
        await axios.get(url);
        console.log(`[FAIL] ${name}: Expected status ${expectedStatus}, but got 200 OK.`);
    } catch (error) {
        if (error.response) {
            if (error.response.status === expectedStatus) {
                console.log(`[PASS] ${name}: Got expected status ${expectedStatus}. Error: "${error.response.data.error}"`);
            } else {
                console.log(`[FAIL] ${name}: Expected status ${expectedStatus}, but got ${error.response.status}.`);
            }
        } else {
            console.log(`[ERROR] ${name}: Connection failed. Is server running?`);
        }
    }
}

async function runTests() {
    console.log("--- Testing Joi Validation ---");

    // 1. Valid Search (Should Pass / 200)
    await testRequest('Valid Search', `${BASE_URL}/search?query=Batman`, 200);

    // 2. Invalid Genre (Should Fail / 400) - Genre must be numbers
    await testRequest('Invalid Genre (Text)', `${BASE_URL}/search?genre=action`, 400);

    // 3. Valid Trailer (Should Pass / 200) - Assuming ID 550 (Fight Club) exists
    // Note: This might fail 404 if no trailer found, or 200 if found. But NOT 400.
    // Let's test checking the ID validation specifically.

    // 4. Invalid Trailer ID (Should Fail / 400) - ID must be integer
    await testRequest('Invalid Trailer ID (String)', `${BASE_URL}/trailer/abc`, 400);

    // 5. Invalid Trailer Type (Should Fail / 400) - Type must be 'movie' or 'tv'
    await testRequest('Invalid Trailer Type', `${BASE_URL}/trailer/123?type=game`, 400);
}

runTests();
