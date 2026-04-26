import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
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

document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const leagueSearchInput = document.getElementById("leagueSearchInput");
  const leagueResults = document.getElementById("leagueResults");

  const savedUser = localStorage.getItem("currentUser");

  if (!savedUser) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = JSON.parse(savedUser);
  let allLeagues = [];

  logoutBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedLeagueId");
    window.location.href = "index.html";
  });

  async function loadLeaguesFromFirebase() {
    leagueResults.innerHTML = `<p class="empty-text">Loading leagues...</p>`;

    const snapshot = await getDocs(collection(db, "leagues"));

    allLeagues = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    localStorage.setItem("leagues", JSON.stringify(allLeagues));
    renderLeagues();
  }

  function isCurrentUserMember(league) {
    const memberUids = league.memberUids || [];
    const members = league.members || [];

    return (
      memberUids.includes(currentUser.uid) ||
      members.includes(currentUser.username)
    );
  }

  function renderLeagues(searchText = "") {
    const filteredLeagues = allLeagues.filter((league) =>
      (league.name || "").toLowerCase().includes(searchText.toLowerCase())
    );

    if (!filteredLeagues.length) {
      leagueResults.innerHTML = `<p class="empty-text">No leagues found.</p>`;
      return;
    }

    leagueResults.innerHTML = filteredLeagues.map((league) => {
      const isMember = isCurrentUserMember(league);

      return `
        <div class="league-preview-card">
          <h3>${league.name || "Untitled League"}</h3>
          <p>${league.game || "Game"} • ${league.type || "Type"}</p>
          <p>Commissioner: ${league.commissioner || "Unknown"}</p>
          <p>Members: ${league.memberUids?.length || league.members?.length || 0}</p>

          <div class="league-card-actions">
            <button class="card-btn browse-view-btn" data-id="${league.id}">
              View League
            </button>

            ${
              isMember
                ? `<button class="joined-btn" disabled>Joined</button>`
                : `<button class="join-league-btn" data-id="${league.id}">Join League</button>`
            }
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll(".browse-view-btn").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem("selectedLeagueId", button.dataset.id);
        window.location.href = "league.html";
      });
    });

    document.querySelectorAll(".join-league-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const leagueId = button.dataset.id;
        const leagueRef = doc(db, "leagues", leagueId);

        try {
          button.textContent = "Joining...";
          button.disabled = true;

          await updateDoc(leagueRef, {
            members: arrayUnion(currentUser.username),
            memberUids: arrayUnion(currentUser.uid),
            updatedAt: serverTimestamp()
          });

          allLeagues = allLeagues.map((league) => {
            if (league.id !== leagueId) return league;

            return {
              ...league,
              members: Array.from(new Set([...(league.members || []), currentUser.username])),
              memberUids: Array.from(new Set([...(league.memberUids || []), currentUser.uid]))
            };
          });

          localStorage.setItem("leagues", JSON.stringify(allLeagues));
          renderLeagues(leagueSearchInput?.value.trim() || "");

        } catch (error) {
          console.error("Join league error:", error);
          alert(error.message);
          button.textContent = "Join League";
          button.disabled = false;
        }
      });
    });
  }

  leagueSearchInput?.addEventListener("input", () => {
    renderLeagues(leagueSearchInput.value.trim());
  });

  await loadLeaguesFromFirebase();
});