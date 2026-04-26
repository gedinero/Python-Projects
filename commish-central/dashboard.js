document.addEventListener("DOMContentLoaded", () => {
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

  let currentUser;

  try {
    currentUser = JSON.parse(savedUser);
  } catch (error) {
    console.error("Bad currentUser data:", error);
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
    return;
  }

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
      dashboardProfileImage.alt = `${username}'s profile picture`;
      dashboardProfileImage.style.display = "block";
    } else {
      dashboardProfileImage.style.display = "none";
    }
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      window.location.href = "edit-profile.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("selectedLeagueId");
      window.location.href = "index.html";
    });
  }

  function renderUserLeagues() {
    if (!myLeaguesContainer) return;

    const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

    const userLeagues = leagues.filter((league) => {
      return league.commissioner === username || league.commissionerUid === currentUser.uid;
    });

    if (userLeagues.length === 0) {
      myLeaguesContainer.innerHTML = `
        <p class="empty-text">You haven’t created any leagues yet.</p>
      `;
      return;
    }

    myLeaguesContainer.innerHTML = userLeagues.map((league) => `
      <div class="league-preview-card">
        <h3>${league.name}</h3>
        <p>${league.game || ""} ${league.type ? "• " + league.type : ""}</p>
        <p>Commissioner: ${league.commissioner || username}</p>

        <div class="league-card-actions">
          <button class="card-btn view-league-btn" data-id="${league.id}">View League</button>
          <button class="delete-league-btn" data-id="${league.id}">Delete League</button>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".view-league-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const leagueId = button.dataset.id;
        localStorage.setItem("selectedLeagueId", leagueId);
        window.location.href = "league.html";
      });
    });

    document.querySelectorAll(".delete-league-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const leagueId = button.dataset.id;

        const confirmDelete = confirm("Are you sure you want to delete this league? This cannot be undone.");
        if (!confirmDelete) return;

        const leagues = JSON.parse(localStorage.getItem("leagues")) || [];
        const leagueToDelete = leagues.find((league) => String(league.id) === String(leagueId));

        if (!leagueToDelete) {
          alert("League not found.");
          return;
        }

        const isCommissioner =
          leagueToDelete.commissioner === username ||
          leagueToDelete.commissionerUid === currentUser.uid;

        if (!isCommissioner) {
          alert("Only the commissioner can delete this league.");
          return;
        }

        const updatedLeagues = leagues.filter((league) => String(league.id) !== String(leagueId));
        localStorage.setItem("leagues", JSON.stringify(updatedLeagues));

        const selectedLeagueId = localStorage.getItem("selectedLeagueId");
        if (String(selectedLeagueId) === String(leagueId)) {
          localStorage.removeItem("selectedLeagueId");
        }

        renderUserLeagues();
      });
    });
  }

  renderUserLeagues();
});