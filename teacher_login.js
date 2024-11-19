document.getElementById('teacher-login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('teacher-login-email').value;
    const password = document.getElementById('teacher-login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'teacher.html';
        })
        .catch((error) => {
            console.error('Error logging in: ', error);
            alert('Login failed: ' + error.message);
        });
});
