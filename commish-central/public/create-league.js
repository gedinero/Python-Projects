import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
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

const form = document.getElementById("createLeagueForm");
const leagueMessage = document.getElementById("leagueMessage");

const savedUser = localStorage.getItem("currentUser");

if (!savedUser) {
  window.location.href = "index.html";
}

const currentUser = JSON.parse(savedUser);

function showMessage(text, color = "") {
  if (!leagueMessage) return;
  leagueMessage.textContent = text;
  leagueMessage.style.color = color;
}

function normalizeLeagueName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

async function leagueNameAlreadyExists(name) {
  const nameLower = normalizeLeagueName(name);

  const leagueQuery = query(
    collection(db, "leagues"),
    where("nameLower", "==", nameLower)
  );

  const snapshot = await getDocs(leagueQuery);

  return !snapshot.empty;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const leagueName = document.getElementById("leagueName").value.trim();
  const leagueGame = document.getElementById("leagueGame").value;
  const leagueType = document.getElementById("leagueType").value;
  const isCommissioner = document.getElementById("isCommissioner").value;

  if (!leagueName || !leagueGame || !leagueType || !isCommissioner) {
    showMessage("Please fill in all league fields.", "#ff5c5c");
    return;
  }

  if (isCommissioner !== "yes") {
    showMessage("Only commissioners can create leagues. Use League Index to join as a player.", "#ff5c5c");
    return;
  }

  try {
    showMessage("Checking league name...");

    const leagueTaken = await leagueNameAlreadyExists(leagueName);

    if (leagueTaken) {
      showMessage("League name already taken.", "#ff5c5c");
      return;
    }

    showMessage("Creating league...");

    const newLeague = {
      name: leagueName,
      nameLower: normalizeLeagueName(leagueName),
      game: leagueGame,
      type: leagueType,

      commissioner: currentUser.username,
      commissionerUid: currentUser.uid,

      members: [currentUser.username],
      memberUids: [currentUser.uid],

      chatMessages: [],
      scheduleMessages: [],
      tradeMessages: [],

      rulesText: "",
      newsText: "",

      draftOrder: [],
      userTeams: [],
      teamNameOverrides: {},

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "leagues"), newLeague);

    const localLeague = {
      id: docRef.id,
      ...newLeague,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const localLeagues = JSON.parse(localStorage.getItem("leagues")) || [];
    localLeagues.push(localLeague);

    localStorage.setItem("leagues", JSON.stringify(localLeagues));
    localStorage.setItem("selectedLeagueId", docRef.id);

    showMessage("League created successfully.", "#00ff9f");

    setTimeout(() => {
      window.location.href = "league.html";
    }, 700);

  } catch (error) {
    console.error("Create league error:", error);
    showMessage(error.message, "#ff5c5c");
  }
});