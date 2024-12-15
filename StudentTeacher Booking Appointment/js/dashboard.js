// Fetch appointments for the teacher
function fetchAppointments() {
    const user = firebase.auth().currentUser; // Get the current logged-in teacher
    firebase.firestore().collection('appointments')
        .where("teacherId", "==", user.uid) // Query appointments for the logged-in teacher
        .get()
        .then(snapshot => {
            const appointmentsList = document.getElementById("appointments-list");
            appointmentsList.innerHTML = ''; // Clear previous list
            snapshot.forEach(doc => {
                const appointment = doc.data();
                appointmentsList.innerHTML += `<div>
                    ${appointment.studentName} - ${appointment.appointmentTime} 
                    <button onclick="updateAppointmentStatus('${doc.id}', 'Approved')">Approve</button>
                    <button onclick="updateAppointmentStatus('${doc.id}', 'Cancelled')">Cancel</button>
                </div>`;
            });
        })
        .catch((error) => {
            console.error("Error fetching appointments:", error);
        });
}

// Fetch appointments for the student (to see their booked appointments)
function fetchStudentAppointments() {
    const user = firebase.auth().currentUser; // Get the current logged-in student
    firebase.firestore().collection('appointments')
        .where("studentId", "==", user.uid) // Query appointments for the logged-in student
        .get()
        .then(snapshot => {
            const appointmentsList = document.getElementById("appointments-list");
            appointmentsList.innerHTML = ''; // Clear previous list
            snapshot.forEach(doc => {
                const appointment = doc.data();
                appointmentsList.innerHTML += `<div>
                    ${appointment.teacherName} - ${appointment.appointmentTime} 
                    <button onclick="cancelAppointment('${doc.id}')">Cancel Appointment</button>
                </div>`;
            });
        })
        .catch((error) => {
            console.error("Error fetching appointments:", error);
        });
}

// Handle searching for a teacher
function searchTeacher() {
    const searchTerm = document.getElementById('search-teacher').value;
    firebase.firestore().collection('teachers').where("name", "==", searchTerm).get()
        .then(snapshot => {
            const teacherList = document.getElementById('teacher-list');
            teacherList.innerHTML = ''; // Clear previous list
            snapshot.forEach(doc => {
                const teacher = doc.data();
                teacherList.innerHTML += `<div id="teacher-${doc.id}">
                    ${teacher.name} - ${teacher.subject}
                    <button onclick="selectTeacher('${doc.id}', '${teacher.name}')">Select</button>
                </div>`;
            });
        })
        .catch((error) => {
            console.error("Error searching teachers:", error);
        });
}

// Book an appointment (student)
function bookAppointment(teacherId, studentName, appointmentTime) {
    const user = firebase.auth().currentUser; // Get the current logged-in student
    const appointmentRef = firebase.firestore().collection('appointments'); // Reference to Firestore appointments collection
    
    // Add the new appointment to Firestore
    appointmentRef.add({
        teacherId: teacherId, // Teacher's ID
        studentId: user.uid,  // Student's ID (current user)
        studentName: studentName, // Student's name
        appointmentTime: appointmentTime, // Appointment time
        status: "Booked", // Default status
        teacherName: "", // Will be filled in later when teacher is selected
    })
    .then(() => {
        console.log("Appointment booked successfully");
        alert("Appointment booked successfully!");
    })
    .catch((error) => {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment. Please try again.");
    });
}

// Update appointment status (teacher can approve or cancel)
function updateAppointmentStatus(appointmentId, status) {
    const appointmentRef = firebase.firestore().collection('appointments').doc(appointmentId);
    
    appointmentRef.update({
        status: status
    })
    .then(() => {
        console.log(`Appointment ${status}`);
        alert(`Appointment ${status}`);
        fetchAppointments(); // Refresh the appointment list
    })
    .catch((error) => {
        console.error("Error updating appointment status:", error);
        alert("Error updating appointment status. Please try again.");
    });
}

// Cancel appointment (student can cancel their booked appointment)
function cancelAppointment(appointmentId) {
    const appointmentRef = firebase.firestore().collection('appointments').doc(appointmentId);
    
    appointmentRef.delete()
    .then(() => {
        console.log("Appointment cancelled successfully");
        alert("Appointment cancelled successfully");
        fetchStudentAppointments(); // Refresh the student's appointment list
    })
    .catch((error) => {
        console.error("Error cancelling appointment:", error);
        alert("Error cancelling appointment. Please try again.");
    });
}

// Schedule an appointment (called when student submits the form)
function scheduleAppointment() {
    const teacherId = document.getElementById("teacher-id").value; // Get the teacher ID from the form
    const studentName = firebase.auth().currentUser.displayName; // Get current student's name
    const appointmentTime = document.getElementById("appointment-time").value; // Get appointment time from form

    // Call the bookAppointment function
    bookAppointment(teacherId, studentName, appointmentTime);
}

// Admin logic to manage teachers (add teacher)
function addTeacher() {
    const name = document.getElementById("teacher-name").value;
    const subject = document.getElementById("teacher-subject").value;
    const department = document.getElementById("teacher-department").value;
    
    // Add new teacher to Firestore
    firebase.firestore().collection('teachers').add({
        name: name,
        subject: subject,
        department: department
    })
    .then(() => {
        console.log("Teacher added successfully");
        alert("Teacher added successfully!");
    })
    .catch((error) => {
        console.error("Error adding teacher:", error);
        alert("Error adding teacher. Please try again.");
    });
}

// Example form event listener for scheduling appointments
document.getElementById("appointment-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload on form submission
    scheduleAppointment(); // Trigger appointment scheduling
});

// Example form event listener for adding teachers (admin)
document.getElementById("add-teacher-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload on form submission
    addTeacher(); // Trigger teacher addition
});
