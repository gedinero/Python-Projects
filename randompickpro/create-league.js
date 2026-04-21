document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const createLeagueBtn = document.getElementById("createLeagueBtn");

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
                alert("Fill in all league fields.");
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
                members: [currentUser],

                chatMessages: [],
                scheduleMessages: [],
                tradeMessages: [],

                rulesText: "",
                newsText: "",

                draftStarted: false,
                draftOrder: [],
                userTeams: []
            };

            leagues.push(newLeague);
            localStorage.setItem("leagues", JSON.stringify(leagues));
            localStorage.setItem("selectedLeagueId", newLeague.id);

            window.location.href = "league.html";
        });
    }
});