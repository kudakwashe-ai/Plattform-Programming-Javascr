/**
 * CineVault Auth Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const errorMsg = document.getElementById('errorMsg');
    const switchToRegister = document.getElementById('switchToRegister');

    // Tab Switching
    const showLogin = () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        errorMsg.style.display = 'none';
    };

    const showRegister = () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        errorMsg.style.display = 'none';
    };

    loginTab.addEventListener('click', showLogin);
    registerTab.addEventListener('click', showRegister);
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailOrUsername = document.getElementById('loginId').value;
        const password = document.getElementById('loginPass').value;

        const btn = loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Signing in...';
        btn.disabled = true;

        try {
            const result = await window.api.auth.login(emailOrUsername, password);
            // Save user role and name to local storage for quick access
            localStorage.setItem('user', JSON.stringify(result.data.user));

            // Redirect based on role
            if (result.data.user.role === 'ADMIN') {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/dashboard.html';
            }
        } catch (error) {
            errorMsg.innerText = error.message;
            errorMsg.style.display = 'block';
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUser').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        const btn = registerForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Creating account...';
        btn.disabled = true;

        try {
            const result = await window.api.auth.register({ username, email, password });
            localStorage.setItem('user', JSON.stringify(result.data.user));
            window.location.href = '/dashboard.html';
        } catch (error) {
            errorMsg.innerText = error.message;
            errorMsg.style.display = 'block';
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});
