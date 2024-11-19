// js/admin_login.js

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        alert('Login successful.');
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Error logging in: ', error);
        alert('Error logging in: ' + error.message);
    }
});
