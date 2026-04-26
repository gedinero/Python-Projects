import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const cropControls = document.getElementById("cropControls");

const zoomRange = document.getElementById("zoomRange");
const moveXRange = document.getElementById("moveXRange");
const moveYRange = document.getElementById("moveYRange");

const countrySelect = document.getElementById("country");
const otherCountryInput = document.getElementById("otherCountry");

let profilePictureData = "";
let originalImage = null;

function showMessage(text) {
  if (accountMessage) accountMessage.textContent = text;
}

function normalizeUsername(username) {
  return username.trim().toLowerCase().replace(/\s+/g, " ");
}

function cropImage(img, zoom = 1, moveX = 0, moveY = 0) {
  const canvas = document.createElement("canvas");
  const size = 400;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  const scale = zoom;
  const baseSize = Math.min(img.width, img.height);
  const cropSize = baseSize / scale;

  let sx = (img.width - cropSize) / 2;
  let sy = (img.height - cropSize) / 2;

  sx += Number(moveX);
  sy += Number(moveY);

  sx = Math.max(0, Math.min(sx, img.width - cropSize));
  sy = Math.max(0, Math.min(sy, img.height - cropSize));

  ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, size, size);

  return canvas.toDataURL("image/jpeg", 0.92);
}

function updateProfilePreview() {
  if (!originalImage || !profilePreview) return;

  const zoom = parseFloat(zoomRange?.value || "1");
  const moveX = parseFloat(moveXRange?.value || "0");
  const moveY = parseFloat(moveYRange?.value || "0");

  profilePictureData = cropImage(originalImage, zoom, moveX, moveY);

  profilePreview.src = profilePictureData;
  profilePreview.style.display = "block";
}

async function usernameAlreadyExists(username) {
  const usernameLower = normalizeUsername(username);

  const usernameLowerQuery = query(
    collection(db, "users"),
    where("usernameLower", "==", usernameLower)
  );

  const usernameExactQuery = query(
    collection(db, "users"),
    where("username", "==", username.trim())
  );

  const [lowerSnapshot, exactSnapshot] = await Promise.all([
    getDocs(usernameLowerQuery),
    getDocs(usernameExactQuery)
  ]);

  return !lowerSnapshot.empty || !exactSnapshot.empty;
}

profilePictureInput?.addEventListener("change", () => {
  const file = profilePictureInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();

    img.onload = () => {
      originalImage = img;

      if (cropControls) cropControls.style.display = "block";

      if (zoomRange) zoomRange.value = "1";
      if (moveXRange) moveXRange.value = "0";
      if (moveYRange) moveYRange.value = "0";

      updateProfilePreview();
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

zoomRange?.addEventListener("input", updateProfilePreview);
moveXRange?.addEventListener("input", updateProfilePreview);
moveYRange?.addEventListener("input", updateProfilePreview);

countrySelect?.addEventListener("change", () => {
  if (!otherCountryInput) return;

  otherCountryInput.style.display = countrySelect.value === "Other" ? "block" : "none";

  if (countrySelect.value !== "Other") {
    otherCountryInput.value = "";
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();

  const country = countrySelect?.value === "Other"
    ? otherCountryInput.value.trim()
    : countrySelect.value;

  const favoriteNFL = document.getElementById("favoriteNFL").value;
  const favoriteCollege = document.getElementById("favoriteCollege").value;

  if (!username || !email || !password) {
    showMessage("Please enter username, email, and password.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  try {
    showMessage("Checking username...");

    const usernameTaken = await usernameAlreadyExists(username);

    if (usernameTaken) {
      showMessage("Username already taken.");
      return;
    }

    showMessage("Creating account...");

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const cleanUsername = username.trim();
    const usernameLower = normalizeUsername(cleanUsername);

    const newUser = {
      uid: user.uid,
      username: cleanUsername,
      usernameLower,
      email,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData
    };

    await setDoc(doc(db, "users", user.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    showMessage("Account created successfully!");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

  } catch (error) {
    console.error("Create account error:", error);
    showMessage(error.message);
  }
});