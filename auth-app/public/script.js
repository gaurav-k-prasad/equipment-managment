let currentUser = null;

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');
    if (token) showUserArea();
});

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.innerHTML = text;
    msg.style.color = type === 'error' ? 'red' : 'green';
}

function showUserArea() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline';
    document.getElementById('userInfo').style.display = 'block';

    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    document.getElementById('userInfo').innerHTML = `
        <h3>Welcome, ${user.name || user.email}!</h3>
        <p>Email: ${user.email}</p>
    `;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    showLogin();
    showMessage('Logged out successfully', 'success');
}

async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            showMessage('Login successful!', 'success');
            showUserArea();
        } else {
            showMessage(result.error || 'Login failed!', 'error');
        }
    } catch (error) {
        showMessage('Network error!', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            showMessage('Registration successful!', 'success');
            showUserArea();
        } else {
            showMessage(result.error || 'Registration failed!', 'error');
        }
    } catch (error) {
        showMessage('Network error!', 'error');
    }
}

// Called by Google One Tap / Button login
window.handleGoogleLogin = function (response) {
    fetch('/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            showMessage('Google login successful!', 'success');
            showUserArea();
        } else {
            showMessage(data.error || 'Google login failed!', 'error');
        }
    })
    .catch(() => showMessage('Network error!', 'error'));
}

function handleGoogleRegister() {
    google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            showMessage('Google sign-in was dismissed', 'error');
        }
    });
}
