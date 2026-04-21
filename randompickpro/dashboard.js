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

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser}`;
    }

    const storedUser = localStorage.getItem(currentUser);

    if (storedUser) {
        const userData = JSON.parse(storedUser);

        if (profileCity) profileCity.textContent = userData.city || "";
        if (profileState) profileState.textContent = userData.state || "";
        if (profileCountry) profileCountry.textContent = userData.country || "";
        if (profileNFL) profileNFL.textContent = userData.favoriteNFL || "";
        if (profileCollege) profileCollege.textContent = userData.favoriteCollege || "";

        if (dashboardProfileImage && userData.profilePicture) {
            dashboardProfileImage.src = userData.profilePicture;
            dashboardProfileImage.style.display = "block";
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
            window.location.href = "index.html";
        });
    }

    function renderUserLeagues() {
        const leagues = JSON.parse(localStorage.getItem("leagues")) || [];
        const userLeagues = leagues.filter((league) => league.commissioner === currentUser);

        if (!myLeaguesContainer) return;

        if (userLeagues.length === 0) {
            myLeaguesContainer.innerHTML = `<p class="empty-text">You haven’t created any leagues yet.</p>`;
            return;
        }

        myLeaguesContainer.innerHTML = userLeagues.map((league) => `
            <div class="league-preview-card">
                <h3>${league.name}</h3>
                <p>${league.game} • ${league.type}</p>
                <p>Commissioner: ${league.commissioner}</p>

                <div class="league-card-actions">
                    <button class="card-btn view-league-btn" data-id="${league.id}">View League</button>
                    <button class="delete-league-btn" data-id="${league.id}">Delete League</button>
                </div>
            </div>
        `).join("");

        const viewLeagueButtons = document.querySelectorAll(".view-league-btn");
        const deleteLeagueButtons = document.querySelectorAll(".delete-league-btn");

        viewLeagueButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const leagueId = Number(button.dataset.id);
                localStorage.setItem("selectedLeagueId", leagueId);
                window.location.href = "league.html";
            });
        });

        deleteLeagueButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const leagueId = Number(button.dataset.id);

                const confirmDelete = confirm("Are you sure you want to delete this league? This cannot be undone.");
                if (!confirmDelete) return;

                const leagues = JSON.parse(localStorage.getItem("leagues")) || [];
                const leagueToDelete = leagues.find((league) => league.id === leagueId);

                if (!leagueToDelete) {
                    alert("League not found.");
                    return;
                }

                if (leagueToDelete.commissioner !== currentUser) {
                    alert("Only the commissioner can delete this league.");
                    return;
                }

                const updatedLeagues = leagues.filter((league) => league.id !== leagueId);
                localStorage.setItem("leagues", JSON.stringify(updatedLeagues));

                const selectedLeagueId = Number(localStorage.getItem("selectedLeagueId"));
                if (selectedLeagueId === leagueId) {
                    localStorage.removeItem("selectedLeagueId");
                }

                renderUserLeagues();
            });
        });
    }

    renderUserLeagues();
});