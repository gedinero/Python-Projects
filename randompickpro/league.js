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

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    const league = leagues.find((item) => item.id === selectedLeagueId);

    if (!league) {
        leagueTitle.textContent = "League Not Found";
        leagueMeta.textContent = "No league data was found.";
        return;
    }

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

    function renderChat() {
        if (!league.chatMessages || league.chatMessages.length === 0) {
            chatBox.innerHTML = `<p class="empty-text">No messages yet.</p>`;
            return;
        }

        chatBox.innerHTML = league.chatMessages
            .map(
                (message) => `
                <div class="chat-message">
                    <strong>${message.user}:</strong> ${message.text}
                </div>
            `
            )
            .join("");
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", () => {
            const messageText = chatInput.value.trim();

            if (messageText === "") return;

            league.chatMessages.push({
                user: currentUser,
                text: messageText
            });

            const updatedLeagues = leagues.map((item) =>
                item.id === league.id ? league : item
            );

            localStorage.setItem("leagues", JSON.stringify(updatedLeagues));

            chatInput.value = "";
            renderChat();
        });
    }

    renderChat();
});