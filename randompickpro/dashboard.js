document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const logoutBtn = document.getElementById("logoutBtn");
    const myLeaguesContainer = document.getElementById("myLeaguesContainer");

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    welcomeMessage.textContent = `Welcome back, ${currentUser}`;

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

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
            <button class="card-btn view-league-btn" data-id="${league.id}">View League</button>
        </div>
    `).join("");

    const viewLeagueButtons = document.querySelectorAll(".view-league-btn");

    viewLeagueButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const leagueId = Number(button.dataset.id);
            localStorage.setItem("selectedLeagueId", leagueId);
            window.location.href = "league.html";
        });
    });
});