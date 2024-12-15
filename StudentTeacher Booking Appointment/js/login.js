function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user);
            // Redirect based on user role
            user.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.role === "Teacher") {
                    window.location.href = "teacher-dashboard.html";
                } else if (idTokenResult.claims.role === "Student") {
                    window.location.href = "student-dashboard.html";
                } else if (idTokenResult.claims.role === "Admin") {
                    window.location.href = "admin-dashboard.html";
                }
            });
        })
        .catch((error) => {
            console.error("Error logging in:", error);
        });
}
