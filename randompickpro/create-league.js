document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const createLeagueBtn = document.getElementById("createLeagueBtn");
    const leagueMessage = document.getElementById("leagueMessage");

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

    if (createLeagueBtn) {
        createLeagueBtn.addEventListener("click", () => {
            const leagueName = document.getElementById("leagueName").value.trim();
            const gameType = document.getElementById("gameType").value;
            const leagueType = document.getElementById("leagueType").value;
            const isCommissioner = document.getElementById("isCommissioner").value;

            if (
                leagueName === "" ||
                gameType === "" ||
                leagueType === "" ||
                isCommissioner === ""
            ) {
                leagueMessage.textContent = "Fill in all league fields.";
                return;
            }

            const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

            const newLeague = {
                id: Date.now(),
                name: leagueName,
                game: gameType,
                type: leagueType,
                commissioner: currentUser,
                isCommissioner: isCommissioner,
                chatMessages: [],
                rules: [],
                news: [],
                schedule: [],
                tradeTalk: []
            };

            leagues.push(newLeague);
            localStorage.setItem("leagues", JSON.stringify(leagues));
            localStorage.setItem("selectedLeagueId", newLeague.id);

            leagueMessage.innerHTML = `
                League created successfully.
                <br>
                <a href="league.html" class="view-league-link">View League</a>
            `;

            document.getElementById("leagueName").value = "";
            document.getElementById("gameType").value = "";
            document.getElementById("leagueType").value = "";
            document.getElementById("isCommissioner").value = "";
        });
    }
});