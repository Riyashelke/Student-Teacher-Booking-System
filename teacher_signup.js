document.getElementById('teacher-signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('teacher-signup-email').value;
    const password = document.getElementById('teacher-signup-password').value;
    const confirmPassword = document.getElementById('teacher-signup-confirm-password').value;
    const mobile = document.getElementById('teacher-signup-mobile').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('teachers').doc(userCredential.user.uid).set({
                email: email,
                mobile: mobile
            });
        })
        .then(() => {
            alert('Teacher registered successfully');
            window.location.href = 'teacher_login.html';
        })
        .catch((error) => {
            console.error('Error registering: ', error);
            alert('Registration failed: ' + error.message);
        });
});
