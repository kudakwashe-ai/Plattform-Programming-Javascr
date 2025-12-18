const http = require('http');

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const runVerification = async () => {
    const user = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
    };

    console.log('1. Testing Registration...');
    try {
        const regRes = await postRequest('/api/auth/register', JSON.stringify(user));
        console.log(`Status: ${regRes.status}`);
        console.log('Body:', regRes.body);

        if (regRes.status !== 201) {
            console.error('Registration failed');
            return;
        }
    } catch (e) {
        console.error('Registration error:', e);
        return;
    }

    console.log('\n2. Testing Login...');
    try {
        const loginRes = await postRequest('/api/auth/login', JSON.stringify({
            email: user.email,
            password: user.password,
        }));
        console.log(`Status: ${loginRes.status}`);
        console.log('Body:', loginRes.body);

        if (loginRes.status === 200 && loginRes.body.token) {
            console.log('\nSUCCESS: Authentication flow verified!');
        } else {
            console.error('\nFAILURE: Login failed or no token received');
        }
    } catch (e) {
        console.error('Login error:', e);
    }
};

// Wait for server to start (simple delay)
setTimeout(runVerification, 5000);
