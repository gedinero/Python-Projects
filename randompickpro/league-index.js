document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const leagueSearchInput = document.getElementById("leagueSearchInput");
    const leagueResults = document.getElementById("leagueResults");

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

    function renderLeagues(searchText = "") {
        const filteredLeagues = leagues.filter((league) =>
            league.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filteredLeagues.length === 0) {
            leagueResults.innerHTML = `<p class="empty-text">No leagues found.</p>`;
            return;
        }

        leagueResults.innerHTML = filteredLeagues.map((league) => `
            <div class="league-preview-card">
                <h3>${league.name}</h3>
                <p>${league.game} • ${league.type}</p>
                <p>Commissioner: ${league.commissioner}</p>
                <button class="card-btn browse-view-btn" data-id="${league.id}">View League</button>
            </div>
        `).join("");

        const viewButtons = document.querySelectorAll(".browse-view-btn");

        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const leagueId = Number(button.dataset.id);
                localStorage.setItem("selectedLeagueId", leagueId);
                window.location.href = "league.html";
            });
        });
    }

    if (leagueSearchInput) {
        leagueSearchInput.addEventListener("input", () => {
            renderLeagues(leagueSearchInput.value.trim());
        });
    }

    renderLeagues();
});