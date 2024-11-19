import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, setDoc, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

const studentNameSpan = document.getElementById('student-name');
const searchQueryInput = document.getElementById('search-query');
const searchButton = document.getElementById('search-button');
const teacherResultsDiv = document.getElementById('teacher-results');
const bookAppointmentForm = document.getElementById('book-appointment-form');
const sendMessageForm = document.getElementById('send-message-form');

// Fetch and display student name
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const studentDocRef = doc(db, 'students', user.uid);
        const studentDoc = await getDoc(studentDocRef);
        if (studentDoc.exists()) {
            studentNameSpan.textContent = studentDoc.data().name;
        } else {
            console.log('No such student!');
        }
    } else {
        window.location.href = 'student_login.html'; // Redirect to login if not logged in
    }
});

// Search for teachers
searchButton.addEventListener('click', async () => {
    const searchQuery = searchQueryInput.value.toLowerCase();
    const teachersRef = collection(db, 'teachers');
    const q = query(teachersRef, where('name', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    teacherResultsDiv.innerHTML = '';
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const teacher = doc.data();
            const teacherDiv = document.createElement('div');
            teacherDiv.textContent = `${teacher.name} - ${teacher.department} - ${teacher.subject}`;
            teacherResultsDiv.appendChild(teacherDiv);
        });
    } else {
        teacherResultsDiv.textContent = 'No teachers found';
    }
});

// Book appointment
bookAppointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teacher = document.getElementById('appointment-teacher').value;
    const time = document.getElementById('appointment-time').value;
    const purpose = document.getElementById('appointment-purpose').value;

    const user = auth.currentUser;
    if (user) {
        const appointmentRef = collection(db, 'appointments');
        await addDoc(appointmentRef, {
            studentId: user.uid,
            teacher: teacher,
            time: Timestamp.fromDate(new Date(time)),
            purpose: purpose
        });
        alert('Appointment booked successfully.');
        bookAppointmentForm.reset();
    } else {
        alert('You must be logged in to book an appointment.');
    }
});

// Send message
sendMessageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teacher = document.getElementById('message-teacher').value;
    const content = document.getElementById('message-content').value;

    const user = auth.currentUser;
    if (user) {
        const messageRef = collection(db, 'messages');
        await addDoc(messageRef, {
            studentId: user.uid,
            teacher: teacher,
            content: content,
            timestamp: Timestamp.now()
        });
        alert('Message sent successfully.');
        sendMessageForm.reset();
    } else {
        alert('You must be logged in to send a message.');
    }
});
