function registerStudent() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Store user info in Firestore
            firebase.firestore().collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: "Student" // You can set role based on your needs
            })
            .then(() => {
                console.log("User registered successfully");
                window.location.href = "login.html"; // Redirect to login page
            });
        })
        .catch((error) => {
            console.error("Error registering user:", error);
        });
}
