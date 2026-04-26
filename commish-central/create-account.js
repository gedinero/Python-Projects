import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const form = document.getElementById("createAccountForm");
const accountMessage = document.getElementById("accountMessage");

const profilePictureInput = document.getElementById("profilePicture");
const profilePreview = document.getElementById("profilePreview");
const countrySelect = document.getElementById("country");
const otherCountryInput = document.getElementById("otherCountry");

let profilePictureData = "";

if (profilePictureInput) {
  profilePictureInput.addEventListener("change", () => {
    const file = profilePictureInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      profilePictureData = reader.result;
      profilePreview.src = profilePictureData;
      profilePreview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });
}

if (countrySelect && otherCountryInput) {
  countrySelect.addEventListener("change", () => {
    otherCountryInput.style.display = countrySelect.value === "Other" ? "block" : "none";
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const country = countrySelect.value === "Other"
    ? otherCountryInput.value.trim()
    : countrySelect.value;

  const favoriteNFL = document.getElementById("favoriteNFL").value;
  const favoriteCollege = document.getElementById("favoriteCollege").value;

  if (!username || !email || !password) {
    accountMessage.textContent = "Please enter username, email, and password.";
    return;
  }

  if (password.length < 6) {
    accountMessage.textContent = "Password must be at least 6 characters.";
    return;
  }

  try {
    accountMessage.textContent = "Creating account...";

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      email,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData,
      createdAt: serverTimestamp()
    });

    localStorage.setItem("currentUser", JSON.stringify({
      uid: user.uid,
      username,
      email,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData
    }));

    accountMessage.textContent = "Account created successfully!";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

  } catch (error) {
    console.error("Create account error:", error);
    accountMessage.textContent = error.message;
  }
});