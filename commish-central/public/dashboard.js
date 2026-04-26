import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc
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
  const welcomeMessage = document.getElementById("welcomeMessage");
  const logoutBtn = document.getElementById("logoutBtn");
  const myLeaguesContainer = document.getElementById("myLeaguesContainer");

  const profileCity = document.getElementById("profileCity");
  const profileState = document.getElementById("profileState");
  const profileCountry = document.getElementById("profileCountry");
  const profileNFL = document.getElementById("profileNFL");
  const profileCollege = document.getElementById("profileCollege");
  const dashboardProfileImage = document.getElementById("dashboardProfileImage");
  const editProfileBtn = document.getElementById("editProfileBtn");

  const savedUser = localStorage.getItem("currentUser");

  if (!savedUser) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = JSON.parse(savedUser);
  const username = currentUser.username || "Commissioner";

  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${username}`;
  }

  if (profileCity) profileCity.textContent = currentUser.city || "";
  if (profileState) profileState.textContent = currentUser.state || "";
  if (profileCountry) profileCountry.textContent = currentUser.country || "";
  if (profileNFL) profileNFL.textContent = currentUser.favoriteNFL || "";
  if (profileCollege) profileCollege.textContent = currentUser.favoriteCollege || "";

  if (dashboardProfileImage) {
    if (currentUser.profilePicture) {
      dashboardProfileImage.src = currentUser.profilePicture;
      dashboardProfileImage.style.display = "block";
    } else {
      dashboardProfileImage.style.display = "none";
    }
  }

  editProfileBtn?.addEventListener("click", () => {
    window.location.href = "edit-profile.html";
  });

  logoutBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedLeagueId");
    window.location.href = "index.html";
  });

  async function loadMyLeagues() {
    if (!myLeaguesContainer) return;

    myLeaguesContainer.innerHTML = `<p class="empty-text">Loading leagues...</p>`;

    const myLeaguesQuery = query(
      collection(db, "leagues"),
      where("commissionerUid", "==", currentUser.uid)
    );

    const snapshot = await getDocs(myLeaguesQuery);

    const leagues = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    localStorage.setItem("leagues", JSON.stringify(leagues));

    renderMyLeagues(leagues);
  }

  function renderMyLeagues(leagues) {
    if (!myLeaguesContainer) return;

    if (!leagues.length) {
      myLeaguesContainer.innerHTML = `
        <p class="empty-text">You haven’t created any leagues yet.</p>
      `;
      return;
    }

    myLeaguesContainer.innerHTML = leagues.map((league) => `
      <div class="league-preview-card">
        <h3>${league.name}</h3>
        <p>${league.game} • ${league.type}</p>
        <p>Commissioner: ${league.commissioner}</p>

        <div class="league-card-actions">
          <button class="card-btn view-league-btn" data-id="${league.id}">
            View League
          </button>

          <button class="delete-league-btn" data-id="${league.id}">
            Delete League
          </button>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".view-league-btn").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem("selectedLeagueId", button.dataset.id);
        window.location.href = "league.html";
      });
    });

    document.querySelectorAll(".delete-league-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const leagueId = button.dataset.id;

        const confirmDelete = confirm(
          "Are you sure you want to delete this league? This cannot be undone."
        );

        if (!confirmDelete) return;

        try {
          button.textContent = "Deleting...";
          button.disabled = true;

          await deleteDoc(doc(db, "leagues", leagueId));

          let localLeagues = JSON.parse(localStorage.getItem("leagues")) || [];
          localLeagues = localLeagues.filter((league) => String(league.id) !== String(leagueId));
          localStorage.setItem("leagues", JSON.stringify(localLeagues));

          const selectedLeagueId = localStorage.getItem("selectedLeagueId");
          if (String(selectedLeagueId) === String(leagueId)) {
            localStorage.removeItem("selectedLeagueId");
          }

          await loadMyLeagues();

        } catch (error) {
          console.error("Delete league error:", error);
          alert(error.message);
          button.textContent = "Delete League";
          button.disabled = false;
        }
      });
    });
  }

  await loadMyLeagues();
});