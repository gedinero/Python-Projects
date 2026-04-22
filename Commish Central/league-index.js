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

    function getLeagues() {
        return JSON.parse(localStorage.getItem("leagues")) || [];
    }

    function saveLeagues(leagues) {
        localStorage.setItem("leagues", JSON.stringify(leagues));
    }

    function renderLeagues(searchText = "") {
        const leagues = getLeagues();

        const filteredLeagues = leagues.filter((league) =>
            league.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filteredLeagues.length === 0) {
            leagueResults.innerHTML = `<p class="empty-text">No leagues found.</p>`;
            return;
        }

        leagueResults.innerHTML = filteredLeagues.map((league) => {
            const isMember = league.members && league.members.includes(currentUser);

            return `
                <div class="league-preview-card">
                    <h3>${league.name}</h3>
                    <p>${league.game} • ${league.type}</p>
                    <p>Commissioner: ${league.commissioner}</p>
                    <p>Members: ${league.members ? league.members.length : 0}</p>

                    <div class="league-card-actions">
                        <button class="card-btn browse-view-btn" data-id="${league.id}">View League</button>
                        ${
                            isMember
                                ? `<button class="joined-btn" disabled>Joined</button>`
                                : `<button class="join-league-btn" data-id="${league.id}">Join League</button>`
                        }
                    </div>
                </div>
            `;
        }).join("");

        const viewButtons = document.querySelectorAll(".browse-view-btn");
        const joinButtons = document.querySelectorAll(".join-league-btn");

        viewButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const leagueId = Number(button.dataset.id);
                localStorage.setItem("selectedLeagueId", leagueId);
                window.location.href = "league.html";
            });
        });

        joinButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const leagueId = Number(button.dataset.id);
                const leagues = getLeagues();

                const updatedLeagues = leagues.map((league) => {
                    if (league.id === leagueId) {
                        if (!league.members) league.members = [];

                        if (!league.members.includes(currentUser)) {
                            league.members.push(currentUser);
                        }
                    }
                    return league;
                });

                saveLeagues(updatedLeagues);
                renderLeagues(leagueSearchInput.value.trim());
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