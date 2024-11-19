import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, setDoc, getDocs, updateDoc, query, where, Timestamp, orderBy } from "firebase/firestore";

const teacherNameSpan = document.getElementById('teacher-name');
const scheduleAppointmentForm = document.getElementById('schedule-appointment-form');
const appointmentRequestsDiv = document.getElementById('appointment-requests');
const studentMessagesDiv = document.getElementById('student-messages');
const allAppointmentsDiv = document.getElementById('all-appointments');
const logoutButton = document.getElementById('logout-button');

// Fetch and display teacher name
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const teacherDocRef = doc(db, 'teachers', user.uid);
        const teacherDoc = await getDoc(teacherDocRef);
        if (teacherDoc.exists()) {
            teacherNameSpan.textContent = teacherDoc.data().name;
            loadAppointments();
            loadMessages();
        } else {
            console.log('No such teacher!');
        }
    } else {
        window.location.href = 'teacher_login.html'; // Redirect to login if not logged in
    }
});

// Schedule appointment
scheduleAppointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const time = document.getElementById('schedule-time').value;
    const purpose = document.getElementById('schedule-purpose').value;

    const user = auth.currentUser;
    if (user) {
        const appointmentRef = collection(db, 'appointments');
        await setDoc(doc(appointmentRef), {
            teacherId: user.uid,
            time: Timestamp.fromDate(new Date(time)),
            purpose: purpose,
            status: 'scheduled'
        });
        alert('Appointment scheduled successfully.');
        scheduleAppointmentForm.reset();
        loadAppointments();
    } else {
        alert('You must be logged in to schedule an appointment.');
    }
});

// Load appointment requests
async function loadAppointments() {
    const user = auth.currentUser;
    if (user) {
        const q = query(collection(db, 'appointments'), where('teacherId', '==', user.uid), orderBy('time', 'desc'));
        const querySnapshot = await getDocs(q);
        appointmentRequestsDiv.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const appointmentDiv = document.createElement('div');
            appointmentDiv.innerHTML = `
                <p>Time: ${appointment.time.toDate()}</p>
                <p>Purpose: ${appointment.purpose}</p>
                <p>Status: ${appointment.status}</p>
                <button onclick="approveAppointment('${doc.id}')">Approve</button>
                <button onclick="cancelAppointment('${doc.id}')">Cancel</button>
            `;
            appointmentRequestsDiv.appendChild(appointmentDiv);
        });
    }
}

// Approve appointment
async function approveAppointment(appointmentId) {
    const appointmentDocRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentDocRef, { status: 'approved' });
    alert('Appointment approved.');
    loadAppointments();
}

// Cancel appointment
async function cancelAppointment(appointmentId) {
    const appointmentDocRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentDocRef, { status: 'canceled' });
    alert('Appointment canceled.');
    loadAppointments();
}

// Load messages from students
async function loadMessages() {
    const user = auth.currentUser;
    if (user) {
        const q = query(collection(db, 'messages'), where('teacher', '==', user.uid), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        studentMessagesDiv.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const message = doc.data();
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `
                <p>From: ${message.studentId}</p>
                <p>Message: ${message.content}</p>
                <p>Time: ${message.timestamp.toDate()}</p>
            `;
            studentMessagesDiv.appendChild(messageDiv);
        });
    }
}

// Load all appointments
async function loadAllAppointments() {
    const user = auth.currentUser;
    if (user) {
        const q = query(collection(db, 'appointments'), where('teacherId', '==', user.uid), orderBy('time', 'desc'));
        const querySnapshot = await getDocs(q);
        allAppointmentsDiv.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            const appointmentDiv = document.createElement('div');
            appointmentDiv.innerHTML = `
                <p>Time: ${appointment.time.toDate()}</p>
                <p>Purpose: ${appointment.purpose}</p>
                <p>Status: ${appointment.status}</p>
            `;
            allAppointmentsDiv.appendChild(appointmentDiv);
        });
    }
}

// Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'teacher_login.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});
