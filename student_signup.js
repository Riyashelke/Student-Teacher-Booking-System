document.getElementById('student-signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('student-signup-email').value;
    const password = document.getElementById('student-signup-password').value;
    const confirmPassword = document.getElementById('student-signup-confirm-password').value;
    const mobile = document.getElementById('student-signup-mobile').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('students').doc(userCredential.user.uid).set({
                email: email,
                mobile: mobile
            });
        })
        .then(() => {
            alert('Student registered successfully');
            window.location.href = 'student_login.html';
        })
        .catch((error) => {
            console.error('Error registering: ', error);
            alert('Registration failed: ' + error.message);
        });
});
