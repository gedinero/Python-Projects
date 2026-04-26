fetch("/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5RWc2ioyBMUZW7JuSinxEaNu1_GIT3Ls",
  authDomain: "commish-central.firebaseapp.com",
  projectId: "commish-central",
  storageBucket: "commish-central.firebasestorage.app",
  messagingSenderId: "29514923176",
  appId: "1:29514923176:web:7fe2fa38287c7feaf2969d",
  measurementId: "G-FF5PY2HLH8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  loginBtn?.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        alert("User profile not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      localStorage.setItem("currentUser", JSON.stringify({
        uid: user.uid,
        username: userData.username || "",
        email: user.email,
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "",
        favoriteNFL: userData.favoriteNFL || "",
        favoriteCollege: userData.favoriteCollege || "",
        profilePicture: userData.profilePicture || ""
      }));

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  });
});