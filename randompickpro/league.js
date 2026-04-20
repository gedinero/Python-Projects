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

    renderChat();
    renderSchedule();
    renderTrade();
    renderRules();
    renderNews();
});