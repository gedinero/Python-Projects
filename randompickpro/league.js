document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    const selectedLeagueId = Number(localStorage.getItem("selectedLeagueId"));
    const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

    const leagueTitle = document.getElementById("leagueTitle");
    const leagueMeta = document.getElementById("leagueMeta");
    const logoutBtn = document.getElementById("logoutBtn");

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    const chatBox = document.getElementById("chatBox");
    const chatInput = document.getElementById("chatInput");
    const sendChatBtn = document.getElementById("sendChatBtn");

    const scheduleBox = document.getElementById("scheduleBox");
    const scheduleInput = document.getElementById("scheduleInput");
    const sendScheduleBtn = document.getElementById("sendScheduleBtn");

    const tradeBox = document.getElementById("tradeBox");
    const tradeInput = document.getElementById("tradeInput");
    const sendTradeBtn = document.getElementById("sendTradeBtn");

    const rulesDisplay = document.getElementById("rulesDisplay");
    const rulesEditor = document.getElementById("rulesEditor");
    const rulesInput = document.getElementById("rulesInput");
    const saveRulesBtn = document.getElementById("saveRulesBtn");

    const newsDisplay = document.getElementById("newsDisplay");
    const newsEditor = document.getElementById("newsEditor");
    const newsInput = document.getElementById("newsInput");
    const saveNewsBtn = document.getElementById("saveNewsBtn");

    const draftStatusText = document.getElementById("draftStatusText");
    const draftControls = document.getElementById("draftControls");
    const startDraftBtn = document.getElementById("startDraftBtn");
    const redraftBtn = document.getElementById("redraftBtn");
    const draftUserSelect = document.getElementById("draftUserSelect");
    const draftTeamSelect = document.getElementById("draftTeamSelect");
    const assignTeamBtn = document.getElementById("assignTeamBtn");
    const availableTeamsList = document.getElementById("availableTeamsList");
    const draftResultsList = document.getElementById("draftResultsList");

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    let league = leagues.find((item) => item.id === selectedLeagueId);

    if (!league) {
        leagueTitle.textContent = "League Not Found";
        leagueMeta.textContent = "No league data was found.";
        return;
    }

    if (!league.chatMessages) league.chatMessages = [];
    if (!league.scheduleMessages) league.scheduleMessages = [];
    if (!league.tradeMessages) league.tradeMessages = [];
    if (!league.rulesText) league.rulesText = "";
    if (!league.newsText) league.newsText = "";
    if (!league.members) league.members = [league.commissioner];
    if (!league.draftStarted) league.draftStarted = false;
    if (!league.draftResults) league.draftResults = [];
    if (!league.draftTeams) league.draftTeams = [];

    const isCommish = league.commissioner === currentUser;

    leagueTitle.textContent = league.name;
    leagueMeta.textContent = `${league.game} • ${league.type} • Commissioner: ${league.commissioner}`;

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabPanels.forEach((panel) => panel.classList.remove("active"));

            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });

    function saveLeague() {
        const allLeagues = JSON.parse(localStorage.getItem("leagues")) || [];
        const updatedLeagues = allLeagues.map((item) =>
            item.id === league.id ? league : item
        );
        localStorage.setItem("leagues", JSON.stringify(updatedLeagues));
    }

    function renderMessages(box, messages) {
        if (!messages || messages.length === 0) {
            box.innerHTML = `<p class="empty-text">No messages yet.</p>`;
            return;
        }

        box.innerHTML = messages.map((message) => `
            <div class="messenger-row ${message.user === currentUser ? "own-message" : ""}">
                <div class="messenger-bubble">
                    <div class="messenger-user">${message.user}</div>
                    <div class="messenger-text">${message.text}</div>
                    <div class="messenger-time">${message.time}</div>
                </div>
            </div>
        `).join("");

        box.scrollTop = box.scrollHeight;
    }

    function getTimeStamp() {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function addMessage(input, arrayName, renderFn) {
        const text = input.value.trim();
        if (text === "") return;

        league[arrayName].push({
            user: currentUser,
            text,
            time: getTimeStamp()
        });

        saveLeague();
        input.value = "";
        renderFn();
    }

    function renderChat() {
        renderMessages(chatBox, league.chatMessages);
    }

    function renderSchedule() {
        renderMessages(scheduleBox, league.scheduleMessages);
    }

    function renderTrade() {
        renderMessages(tradeBox, league.tradeMessages);
    }

    function renderRules() {
        if (league.rulesText.trim() === "") {
            rulesDisplay.innerHTML = `<p class="empty-text">No rules posted yet.</p>`;
        } else {
            rulesDisplay.innerHTML = `<div class="formatted-text">${league.rulesText.replace(/\n/g, "<br>")}</div>`;
        }

        if (isCommish) {
            rulesEditor.style.display = "block";
            rulesInput.value = league.rulesText;
        }
    }

    function renderNews() {
        if (league.newsText.trim() === "") {
            newsDisplay.innerHTML = `<p class="empty-text">No league news yet.</p>`;
        } else {
            newsDisplay.innerHTML = `<div class="formatted-text">${league.newsText.replace(/\n/g, "<br>")}</div>`;
        }

        if (isCommish) {
            newsEditor.style.display = "block";
            newsInput.value = league.newsText;
        }
    }

    function getDefaultTeams(game) {
        if (game === "Madden") {
            return [
                "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
                "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
                "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
                "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
                "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
                "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
                "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
                "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
            ];
        }

        return [
            "Alabama", "Arizona", "Arizona State", "Arkansas", "Auburn", "Baylor", "Boise State",
            "Boston College", "BYU", "California", "Clemson", "Colorado", "Duke", "Florida",
            "Florida State", "Georgia", "Georgia Tech", "Houston", "Illinois", "Indiana", "Iowa",
            "Iowa State", "Kansas", "Kansas State", "Kentucky", "Louisville", "LSU", "Maryland",
            "Miami", "Michigan", "Michigan State", "Minnesota", "Mississippi State", "Missouri",
            "Nebraska", "North Carolina", "NC State", "Notre Dame", "Ohio State", "Oklahoma",
            "Oklahoma State", "Ole Miss", "Oregon", "Penn State", "Pitt", "Purdue",
            "South Carolina", "Stanford", "Syracuse", "TCU", "Tennessee", "Texas",
            "Texas A&M", "Texas Tech", "UCF", "UCLA", "USC", "Utah", "Vanderbilt",
            "Virginia", "Virginia Tech", "Washington", "West Virginia", "Wisconsin"
        ];
    }

    function renderDraft() {
        if (draftStatusText) {
            draftStatusText.textContent = league.draftStarted ? "Draft Active" : "Not started";
        }

        if (draftControls && isCommish) {
            draftControls.style.display = "block";
        }

        if (league.draftStarted && league.draftTeams.length === 0) {
            league.draftTeams = getDefaultTeams(league.game);
            saveLeague();
        }

        if (draftUserSelect) {
            draftUserSelect.innerHTML = `<option value="">Select User</option>`;
            league.members.forEach((member) => {
                const option = document.createElement("option");
                option.value = member;
                option.textContent = member;
                draftUserSelect.appendChild(option);
            });
        }

        if (draftTeamSelect) {
            draftTeamSelect.innerHTML = `<option value="">Select Team</option>`;
            league.draftTeams.forEach((team) => {
                const option = document.createElement("option");
                option.value = team;
                option.textContent = team;
                draftTeamSelect.appendChild(option);
            });
        }

        if (availableTeamsList) {
            if (!league.draftStarted) {
                availableTeamsList.innerHTML = `<p class="empty-text">Draft has not started yet.</p>`;
            } else if (league.draftTeams.length === 0) {
                availableTeamsList.innerHTML = `<p class="empty-text">No teams left.</p>`;
            } else {
                availableTeamsList.innerHTML = league.draftTeams
                    .map((team) => `<div class="draft-item">${team}</div>`)
                    .join("");
            }
        }

        if (draftResultsList) {
            if (!league.draftResults || league.draftResults.length === 0) {
                draftResultsList.innerHTML = `<p class="empty-text">No teams drafted yet.</p>`;
            } else {
                draftResultsList.innerHTML = league.draftResults
                    .map(
                        (pick, index) => `
                        <div class="draft-item">
                            <strong>${index + 1}.</strong> ${pick.user} → ${pick.team}
                        </div>
                    `
                    )
                    .join("");
            }
        }
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", () => {
            addMessage(chatInput, "chatMessages", renderChat);
        });
    }

    if (sendScheduleBtn) {
        sendScheduleBtn.addEventListener("click", () => {
            addMessage(scheduleInput, "scheduleMessages", renderSchedule);
        });
    }

    if (sendTradeBtn) {
        sendTradeBtn.addEventListener("click", () => {
            addMessage(tradeInput, "tradeMessages", renderTrade);
        });
    }

    if (saveRulesBtn && isCommish) {
        saveRulesBtn.addEventListener("click", () => {
            league.rulesText = rulesInput.value.trim();
            saveLeague();
            renderRules();
        });
    }

    if (saveNewsBtn && isCommish) {
        saveNewsBtn.addEventListener("click", () => {
            league.newsText = newsInput.value.trim();
            saveLeague();
            renderNews();
        });
    }

    if (startDraftBtn && isCommish) {
        startDraftBtn.addEventListener("click", () => {
            league.draftStarted = true;
            league.draftTeams = getDefaultTeams(league.game);
            league.draftResults = [];
            saveLeague();
            renderDraft();
        });
    }

    if (redraftBtn && isCommish) {
        redraftBtn.addEventListener("click", () => {
            const confirmed = confirm("Are you sure you want to reset the draft?");
            if (!confirmed) return;

            league.draftStarted = false;
            league.draftTeams = [];
            league.draftResults = [];
            saveLeague();
            renderDraft();
        });
    }

    if (assignTeamBtn && isCommish) {
        assignTeamBtn.addEventListener("click", () => {
            const selectedUser = draftUserSelect.value;
            const selectedTeam = draftTeamSelect.value;

            if (!league.draftStarted) {
                alert("Start the draft first.");
                return;
            }

            if (selectedUser === "" || selectedTeam === "") {
                alert("Select both a user and a team.");
                return;
            }

            const alreadyPicked = league.draftResults.some((pick) => pick.user === selectedUser);
            if (alreadyPicked) {
                alert("That user already has a team.");
                return;
            }

            league.draftResults.push({
                user: selectedUser,
                team: selectedTeam
            });

            league.draftTeams = league.draftTeams.filter((team) => team !== selectedTeam);

            saveLeague();
            renderDraft();
        });
    }

    renderChat();
    renderSchedule();
    renderTrade();
    renderRules();
    renderNews();
    renderDraft();
});