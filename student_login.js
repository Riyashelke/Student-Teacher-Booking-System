document.getElementById('student-login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('student-login-email').value;
    const password = document.getElementById('student-login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'student_dashboard.html';
        })
        .catch((error) => {
            console.error('Error logging in: ', error);
            alert('Login failed: ' + error.message);
        });
});
