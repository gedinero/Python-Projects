// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC5RWc2ioyBMUZW7JuSinxEaNu1_GIT3Ls",
  authDomain: "commish-central.firebaseapp.com",
  projectId: "commish-central",
  storageBucket: "commish-central.firebasestorage.app",
  messagingSenderId: "29514923176",
  appId: "1:29514923176:web:7fe2fa38287c7feaf2969d",
  measurementId: "G-FF5PY2HLH8"
};


// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form submit
document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    console.log("🔥 User created:", user);

    // Redirect after success
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("❌ Error:", error.message);
    alert(error.message);
  }
});