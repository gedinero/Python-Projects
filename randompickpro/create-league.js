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
                if (leagueMessage) {
                    leagueMessage.textContent = "Fill in all league fields.";
                    leagueMessage.style.color = "#ff5c5c";
                } else {
                    alert("Fill in all league fields.");
                }
                return;
            }

            const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

            const leagueExists = leagues.some(
                (league) => league.name.toLowerCase() === leagueName.toLowerCase()
            );

            if (leagueExists) {
                if (leagueMessage) {
                    leagueMessage.textContent = "League name already exists. Choose a different name.";
                    leagueMessage.style.color = "#ff5c5c";
                } else {
                    alert("League name already exists. Choose a different name.");
                }
                return;
            }

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

                draftOrder: [],
                userTeams: [],
                teamNameOverrides: {}
            };

            leagues.push(newLeague);
            localStorage.setItem("leagues", JSON.stringify(leagues));
            localStorage.setItem("selectedLeagueId", newLeague.id);

            if (leagueMessage) {
                leagueMessage.textContent = "League created successfully!";
                leagueMessage.style.color = "#00ff9f";
            }

            window.location.href = "league.html";
        });
    }
});