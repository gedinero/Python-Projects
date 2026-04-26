import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
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
const db = getFirestore(app);

const saveProfileBtn = document.getElementById("saveProfileBtn");
const message = document.getElementById("profileMessage");

const usernameInput = document.getElementById("username");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const countrySelect = document.getElementById("country");
const otherCountryInput = document.getElementById("otherCountry");
const favoriteNFLSelect = document.getElementById("favoriteNFL");
const favoriteCollegeSelect = document.getElementById("favoriteCollege");

const profilePictureInput = document.getElementById("profilePicture");
const profilePreview = document.getElementById("profilePreview");
const cropControls = document.getElementById("cropControls");

const zoomRange = document.getElementById("zoomRange");
const moveXRange = document.getElementById("moveXRange");
const moveYRange = document.getElementById("moveYRange");

const savedUser = localStorage.getItem("currentUser");

if (!savedUser) {
  window.location.href = "index.html";
}

let currentUser = JSON.parse(savedUser);
let profilePictureData = currentUser.profilePicture || "";
let originalImage = null;

function showMessage(text, color = "") {
  if (!message) return;
  message.textContent = text;
  message.style.color = color;
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

  const baseSize = Math.min(img.width, img.height);
  const cropSize = baseSize / zoom;

  let sx = (img.width - cropSize) / 2 + Number(moveX);
  let sy = (img.height - cropSize) / 2 + Number(moveY);

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

function setCountryFields(countryValue) {
  const builtInCountries = [
    "United States",
    "Canada",
    "Mexico",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan"
  ];

  if (!countrySelect || !otherCountryInput) return;

  if (builtInCountries.includes(countryValue)) {
    countrySelect.value = countryValue;
    otherCountryInput.style.display = "none";
    otherCountryInput.value = "";
  } else if (countryValue) {
    countrySelect.value = "Other";
    otherCountryInput.style.display = "block";
    otherCountryInput.value = countryValue;
  } else {
    countrySelect.value = "";
    otherCountryInput.style.display = "none";
    otherCountryInput.value = "";
  }
}

async function usernameTakenBySomeoneElse(username) {
  const cleanUsername = username.trim();
  const usernameLower = normalizeUsername(cleanUsername);

  if (usernameLower === normalizeUsername(currentUser.username || "")) {
    return false;
  }

  const usernameQuery = query(
    collection(db, "users"),
    where("usernameLower", "==", usernameLower)
  );

  const snapshot = await getDocs(usernameQuery);

  let taken = false;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (docSnap.id !== currentUser.uid && data.uid !== currentUser.uid) {
      taken = true;
    }
  });

  return taken;
}

if (usernameInput) usernameInput.value = currentUser.username || "";
if (cityInput) cityInput.value = currentUser.city || "";
if (stateInput) stateInput.value = currentUser.state || "";
if (favoriteNFLSelect) favoriteNFLSelect.value = currentUser.favoriteNFL || "";
if (favoriteCollegeSelect) favoriteCollegeSelect.value = currentUser.favoriteCollege || "";

setCountryFields(currentUser.country || "");

if (profilePreview) {
  if (profilePictureData) {
    profilePreview.src = profilePictureData;
    profilePreview.style.display = "block";
  } else {
    profilePreview.style.display = "none";
  }
}

countrySelect?.addEventListener("change", () => {
  if (!otherCountryInput) return;

  if (countrySelect.value === "Other") {
    otherCountryInput.style.display = "block";
  } else {
    otherCountryInput.style.display = "none";
    otherCountryInput.value = "";
  }
});

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

saveProfileBtn?.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const city = cityInput.value.trim();
  const state = stateInput.value.trim();

  let country = countrySelect.value;

  if (country === "Other") {
    country = otherCountryInput.value.trim();
  }

  const favoriteNFL = favoriteNFLSelect.value;
  const favoriteCollege = favoriteCollegeSelect.value;

  if (!username || !city || !state || !country) {
    showMessage("Please fill in all required fields.", "#ff5c5c");
    return;
  }

  try {
    showMessage("Checking profile...");

    const usernameTaken = await usernameTakenBySomeoneElse(username);

    if (usernameTaken) {
      showMessage("Username already taken.", "#ff5c5c");
      return;
    }

    showMessage("Saving profile...");

    const cleanUsername = username.trim();
    const usernameLower = normalizeUsername(cleanUsername);

    const updatedUser = {
      ...currentUser,
      username: cleanUsername,
      usernameLower,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData
    };

    await updateDoc(doc(db, "users", currentUser.uid), {
      username: cleanUsername,
      usernameLower,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData,
      updatedAt: serverTimestamp()
    });

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    showMessage("Profile updated successfully.", "#00ff9f");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);

  } catch (error) {
    console.error("Edit profile error:", error);
    showMessage(error.message, "#ff5c5c");
  }
});