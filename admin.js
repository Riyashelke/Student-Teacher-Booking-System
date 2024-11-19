// Import the functions you need from the SDKs you need
import { auth, db } from './firebaseConfig.js';

// Admin Login
document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Redirect to admin dashboard
            window.location.href = 'admin_dashboard.html';
        })
        .catch((error) => {
            console.error('Error logging in: ', error);
            alert('Failed to login. Please check your credentials.');
        });
});

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

// Add Teacher
document.getElementById('add-teacher-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('teacher-name').value;
    const department = document.getElementById('teacher-department').value;
    const subject = document.getElementById('teacher-subject').value;

    db.collection('teachers').add({
        name: name,
        department: department,
        subject: subject
    }).then(() => {
        alert('Teacher added successfully.');
        // Clear form fields
        document.getElementById('add-teacher-form').reset();
    }).catch((error) => {
        console.error('Error adding teacher: ', error);
        alert('Failed to add teacher. Please try again.');
    });
});

// Update/Delete Teacher
document.getElementById('update-teacher-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const teacherId = document.getElementById('update-teacher-id').value;
    const newName = document.getElementById('update-teacher-name').value;
    const newDepartment = document.getElementById('update-teacher-department').value;
    const newSubject = document.getElementById('update-teacher-subject').value;

    db.collection('teachers').doc(teacherId).update({
        name: newName,
        department: newDepartment,
        subject: newSubject
    }).then(() => {
        alert('Teacher updated successfully.');
        // Clear form fields
        document.getElementById('update-teacher-form').reset();
    }).catch((error) => {
        console.error('Error updating teacher: ', error);
        alert('Failed to update teacher. Please try again.');
    });
});

// Approve/Reject Student Registration
document.getElementById('approve-student-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const studentId = document.getElementById('student-id').value;
    const action = document.querySelector('input[name="approval-action"]:checked').value; // 'approve' or 'reject'

    db.collection('students').doc(studentId).update({
        approved: action === 'approve'
    }).then(() => {
        alert(`Student ${action}d successfully.`);
        // Clear form fields
        document.getElementById('approve-student-form').reset();
    }).catch((error) => {
        console.error('Error approving/rejecting student: ', error);
        alert('Failed to process student registration. Please try again.');
    });
});
