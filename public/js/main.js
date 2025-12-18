document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorDiv = document.getElementById('error');

    const showError = (message) => {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            alert(message);
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user)); // Save user info
                    // alert('Login successful! Role: ' + data.user.role);
                    const debugDiv = document.createElement('div');
                    debugDiv.style.position = 'fixed';
                    debugDiv.style.top = '0';
                    debugDiv.style.left = '0';
                    debugDiv.style.background = 'red';
                    debugDiv.style.color = 'white';
                    debugDiv.style.padding = '20px';
                    debugDiv.style.zIndex = '9999';
                    debugDiv.innerText = 'Login Role: ' + data.user.role;
                    document.body.appendChild(debugDiv);

                    // Delay redirect to see the message
                    setTimeout(() => {
                        if (data.user.role === 'admin') {
                            window.location.href = '/admin-dashboard.html';
                        } else {
                            window.location.href = '/user-dashboard.html';
                        }
                    }, 3000);


                } else {
                    showError(data.message || 'Login failed');
                }
            } catch (err) {
                showError('An error occurred. Please try again.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Registration successful!');
                    window.location.href = '/dashboard.html';
                } else {
                    showError(data.message || 'Registration failed');
                }
            } catch (err) {
                showError('An error occurred. Please try again.');
            }
        });
    }

    // Dashboard Logic
    const logoutBtn = document.getElementById('logoutBtn');
    const usersTableBody = document.querySelector('#usersTable tbody');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        });
    }

    if (usersTableBody) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    return;
                }

                const result = await response.json();
                const users = result.data; // Access data property from controller response

                usersTableBody.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                `).join('');
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };

        fetchUsers();
    }
});
