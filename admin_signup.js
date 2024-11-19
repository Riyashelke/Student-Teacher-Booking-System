// admin_signup.js

// Import the necessary functions from Firebase SDK
import { auth, db } from './firebaseConfig.js';

// Admin Signup
document.getElementById('admin-signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const phone = document.getElementById('signup-phone').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('admins').doc(user.uid).set({
                email: email,
                phone: phone
            });
        })
        .then(() => {
            alert('Admin registered successfully.');
            window.location.href = 'admin_login.html';
        })
        .catch((error) => {
            console.error('Error signing up: ', error);
            alert('Failed to register. Please try again.');
        });
});
