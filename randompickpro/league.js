document.addEventListener("DOMContentLoaded", () => {
    const GIPHY_API_KEY = "fAamOwF84swNA9O56F0l3hz1G7huYaA1";
    const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

    const EMOJIS = [
        "😀","😂","🤣","😭","😎","🔥","💯","👀","😤","😈",
        "🥶","🤝","🙏","💪","✅","❌","⚡","🎯","🏈","🏆",
        "🎮","📅","📣","🚨","😬","😅","🤦","🙌","😡","❤️",
        "💙","🖤","💚","🫡","💀","🥳","😮","🤔","😴","📸"
    ];

    const currentUser = localStorage.getItem("currentUser");
    const selectedLeagueId = Number(localStorage.getItem("selectedLeagueId"));
    const leagues = JSON.parse(localStorage.getItem("leagues")) || [];

    const leagueTitle = document.getElementById("leagueTitle");
    const leagueMeta = document.getElementById("leagueMeta");
    const myLeagueInfo = document.getElementById("myLeagueInfo");
    const logoutBtn = document.getElementById("logoutBtn");

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    const chatBox = document.getElementById("chatBox");
    const chatInput = document.getElementById("chatInput");
    const sendChatBtn = document.getElementById("sendChatBtn");
    const chatImageInput = document.getElementById("chatImageInput");
    const chatEmojiToggleBtn = document.getElementById("chatEmojiToggleBtn");
    const chatEmojiPickerWrap = document.getElementById("chatEmojiPickerWrap");
    const chatEmojiGrid = document.getElementById("chatEmojiGrid");
    const gifToggleBtn = document.getElementById("gifToggleBtn");
    const gifPickerWrap = document.getElementById("gifPickerWrap");
    const gifSearchInput = document.getElementById("gifSearchInput");
    const gifSearchBtn = document.getElementById("gifSearchBtn");
    const gifResultsGrid = document.getElementById("gifResultsGrid");

    const scheduleBox = document.getElementById("scheduleBox");
    const scheduleInput = document.getElementById("scheduleInput");
    const sendScheduleBtn = document.getElementById("sendScheduleBtn");
    const scheduleImageInput = document.getElementById("scheduleImageInput");
    const scheduleEmojiToggleBtn = document.getElementById("scheduleEmojiToggleBtn");
    const scheduleEmojiPickerWrap = document.getElementById("scheduleEmojiPickerWrap");
    const scheduleEmojiGrid = document.getElementById("scheduleEmojiGrid");
    const scheduleGifToggleBtn = document.getElementById("scheduleGifToggleBtn");
    const scheduleGifPickerWrap = document.getElementById("scheduleGifPickerWrap");
    const scheduleGifSearchInput = document.getElementById("scheduleGifSearchInput");
    const scheduleGifSearchBtn = document.getElementById("scheduleGifSearchBtn");
    const scheduleGifResultsGrid = document.getElementById("scheduleGifResultsGrid");

    const tradeBox = document.getElementById("tradeBox");
    const tradeInput = document.getElementById("tradeInput");
    const sendTradeBtn = document.getElementById("sendTradeBtn");
    const tradeImageInput = document.getElementById("tradeImageInput");
    const tradeEmojiToggleBtn = document.getElementById("tradeEmojiToggleBtn");
    const tradeEmojiPickerWrap = document.getElementById("tradeEmojiPickerWrap");
    const tradeEmojiGrid = document.getElementById("tradeEmojiGrid");
    const tradeGifToggleBtn = document.getElementById("tradeGifToggleBtn");
    const tradeGifPickerWrap = document.getElementById("tradeGifPickerWrap");
    const tradeGifSearchInput = document.getElementById("tradeGifSearchInput");
    const tradeGifSearchBtn = document.getElementById("tradeGifSearchBtn");
    const tradeGifResultsGrid = document.getElementById("tradeGifResultsGrid");

    const rulesDisplay = document.getElementById("rulesDisplay");
    const rulesEditor = document.getElementById("rulesEditor");
    const rulesInput = document.getElementById("rulesInput");
    const saveRulesBtn = document.getElementById("saveRulesBtn");

    const newsDisplay = document.getElementById("newsDisplay");
    const newsEditor = document.getElementById("newsEditor");
    const newsInput = document.getElementById("newsInput");
    const saveNewsBtn = document.getElementById("saveNewsBtn");

    const draftStatusText = document.getElementById("draftStatusText");
    const currentPickText = document.getElementById("currentPickText");
    const selectedDraftUserText = document.getElementById("selectedDraftUserText");
    const randomizeOrderBtn = document.getElementById("randomizeOrderBtn");
    const resetDraftBtn = document.getElementById("resetDraftBtn");
    const clearSelectedUserBtn = document.getElementById("clearSelectedUserBtn");
    const playersList = document.getElementById("playersList");
    const draftOrderList = document.getElementById("draftOrderList");
    const userTeamsList = document.getElementById("userTeamsList");
    const cpuTeamsList = document.getElementById("cpuTeamsList");
    const draftSummaryUserTeams = document.getElementById("draftSummaryUserTeams");
    const draftSummaryCpuTeams = document.getElementById("draftSummaryCpuTeams");

    const settingsMaddenOnly = document.getElementById("settingsMaddenOnly");
    const settingsEditor = document.getElementById("settingsEditor");
    const relocateTeamSelect = document.getElementById("relocateTeamSelect");
    const relocateNameInput = document.getElementById("relocateNameInput");
    const saveRelocationBtn = document.getElementById("saveRelocationBtn");
    const customTeamNamesList = document.getElementById("customTeamNamesList");

    let selectedDraftUser = null;
    let selectedDraftMode = null;

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    let league = leagues.find((item) => item.id === selectedLeagueId);

    if (!league) {
        if (leagueTitle) leagueTitle.textContent = "League Not Found";
        if (leagueMeta) leagueMeta.textContent = "No league data found.";
        return;
    }

    if (!league.members) league.members = [league.commissioner];
    if (!league.chatMessages) league.chatMessages = [];
    if (!league.scheduleMessages) league.scheduleMessages = [];
    if (!league.tradeMessages) league.tradeMessages = [];
    if (!league.rulesText) league.rulesText = "";
    if (!league.newsText) league.newsText = "";
    if (!league.draftOrder) league.draftOrder = [];
    if (!league.userTeams) league.userTeams = [];
    if (!league.teamNameOverrides) league.teamNameOverrides = {};

    const isCommish = league.commissioner === currentUser;

    function saveLeague() {
        const allLeagues = JSON.parse(localStorage.getItem("leagues")) || [];
        const updated = allLeagues.map((item) => item.id === league.id ? league : item);
        localStorage.setItem("leagues", JSON.stringify(updated));
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

    function getDisplayTeamName(team) {
        return league.teamNameOverrides[team] || team;
    }

    function getUserPick(user) {
        return league.userTeams.find((pick) => pick.user === user);
    }

    function renderCurrentUserLeagueInfo() {
        if (!myLeagueInfo) return;
        const currentUserPick = getUserPick(currentUser);
        const currentUserTeam = currentUserPick ? getDisplayTeamName(currentUserPick.team) : "No team assigned";
        myLeagueInfo.textContent = `You: ${currentUser} • Team: ${currentUserTeam}`;
    }

    function getTimeStamp() {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function getRemainingDraftOrder() {
        const assignedUsers = league.userTeams.map((pick) => pick.user);
        return league.draftOrder.filter((user) => !assignedUsers.includes(user));
    }

    function getAssignedTeams() {
        return league.userTeams.map((pick) => pick.team);
    }

    function getCpuTeams() {
        const allTeams = getDefaultTeams(league.game);
        const assigned = getAssignedTeams();
        return allTeams.filter((team) => !assigned.includes(team));
    }

    function getUserProfileImage(username) {
        const storedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const currentUserProfileImage =
            localStorage.getItem("profileImage") ||
            localStorage.getItem("userProfileImage") ||
            localStorage.getItem("currentUserProfileImage") ||
            "";

        const profileMatch =
            storedProfiles.find((profile) => profile.username === username || profile.name === username) ||
            storedUsers.find((profile) => profile.username === username || profile.name === username);

        if (profileMatch) {
            const image =
                profileMatch.profileImage ||
                profileMatch.avatar ||
                profileMatch.photo ||
                "";

            if (typeof image === "string" && image.trim() !== "") {
                return image;
            }
        }

        if (username === currentUser && currentUserProfileImage.trim() !== "") {
            return currentUserProfileImage;
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8dffb8&color=08110d&bold=true`;
    }

    function buildMessageBubble(message) {
        let body = "";

        if (message.type === "image") {
            body = `<img src="${message.image}" alt="Shared image" class="chat-media-image">`;
        } else if (message.type === "gif") {
            body = `<img src="${message.gif}" alt="GIF" class="chat-media-image">`;
        } else {
            body = `<div class="messenger-text">${message.text}</div>`;
        }

        const avatarSrc = getUserProfileImage(message.user);

        return `
            <div class="messenger-row own-message">
                <div class="outside-avatar-wrap">
                    <img src="${avatarSrc}" alt="${message.user}" class="message-avatar outside-avatar">
                    <div class="messenger-bubble">
                        <div class="messenger-user">${message.user}</div>
                        ${body}
                        <div class="messenger-time">${message.time}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderMessages(box, messages) {
        if (!box) return;

        if (!messages.length) {
            box.innerHTML = `<p class="empty-text">No messages yet.</p>`;
            return;
        }

        box.innerHTML = messages.map((message) => buildMessageBubble(message)).join("");
        box.scrollTop = box.scrollHeight;
    }

    function addMessage(arrayName, payload, renderFn) {
        league[arrayName].push(payload);
        saveLeague();
        renderFn();
    }

    function sendTextMessage(inputEl, arrayName, renderFn) {
        const text = inputEl.value.trim();
        if (!text) return;

        addMessage(arrayName, {
            user: currentUser,
            text,
            type: "text",
            time: getTimeStamp()
        }, renderFn);

        inputEl.value = "";
    }

    function sendImageMessage(dataUrl, arrayName, renderFn) {
        addMessage(arrayName, {
            user: currentUser,
            image: dataUrl,
            type: "image",
            time: getTimeStamp()
        }, renderFn);
    }

    function sendGifMessage(gifUrl, arrayName, renderFn) {
        addMessage(arrayName, {
            user: currentUser,
            gif: gifUrl,
            type: "gif",
            time: getTimeStamp()
        }, renderFn);
    }

    function insertEmoji(inputEl, emoji) {
        const start = inputEl.selectionStart ?? inputEl.value.length;
        const end = inputEl.selectionEnd ?? inputEl.value.length;
        const text = inputEl.value;
        inputEl.value = text.slice(0, start) + emoji + text.slice(end);
        inputEl.focus();
        const nextPos = start + emoji.length;
        inputEl.setSelectionRange(nextPos, nextPos);
    }

    function buildEmojiPicker(gridEl, inputEl) {
        if (!gridEl) return;

        gridEl.innerHTML = EMOJIS.map((emoji) => `
            <button type="button" class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
        `).join("");

        gridEl.querySelectorAll(".emoji-btn").forEach((button) => {
            button.addEventListener("click", () => {
                insertEmoji(inputEl, button.dataset.emoji);
            });
        });
    }

    function togglePanel(targetWrap, otherWraps = []) {
        const shouldOpen = targetWrap.style.display === "none" || targetWrap.style.display === "";
        otherWraps.forEach((wrap) => {
            if (wrap) wrap.style.display = "none";
        });
        targetWrap.style.display = shouldOpen ? "block" : "none";
    }

    async function fetchGifs(query = "", limit = 12) {
        const endpoint = query.trim()
            ? `${GIPHY_BASE_URL}/search`
            : `${GIPHY_BASE_URL}/trending`;

        const params = new URLSearchParams({
            api_key: GIPHY_API_KEY,
            limit: String(limit),
            rating: "pg"
        });

        if (query.trim()) {
            params.set("q", query.trim());
        }

        const response = await fetch(`${endpoint}?${params.toString()}`);
        if (!response.ok) throw new Error("Could not load GIFs.");
        const data = await response.json();
        return data.data || [];
    }

    function renderGifResults(gridEl, gifs, arrayName, renderFn, pickerWrap) {
        if (!gridEl) return;

        if (!gifs.length) {
            gridEl.innerHTML = `<p class="empty-text">No GIFs found.</p>`;
            return;
        }

        gridEl.innerHTML = gifs.map((gif) => {
            const preview = gif.images?.fixed_width_small?.url || gif.images?.fixed_width?.url || "";
            const sendUrl = gif.images?.downsized_medium?.url || gif.images?.original?.url || preview;

            return `
                <button type="button" class="gif-result-btn" data-url="${sendUrl}">
                    <img src="${preview}" alt="${gif.title || "GIF"}" class="gif-result-image">
                </button>
            `;
        }).join("");

        gridEl.querySelectorAll(".gif-result-btn").forEach((button) => {
            button.addEventListener("click", () => {
                sendGifMessage(button.dataset.url, arrayName, renderFn);
                if (pickerWrap) pickerWrap.style.display = "none";
            });
        });
    }

    async function loadGifPanel(gridEl, query, arrayName, renderFn, pickerWrap) {
        if (!gridEl) return;
        gridEl.innerHTML = `<p class="empty-text">Loading GIFs...</p>`;
        try {
            const gifs = await fetchGifs(query);
            renderGifResults(gridEl, gifs, arrayName, renderFn, pickerWrap);
        } catch (error) {
            gridEl.innerHTML = `<p class="empty-text">${error.message}</p>`;
        }
    }

    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function selectDraftUser(user, mode) {
        selectedDraftUser = user;
        selectedDraftMode = mode;
        renderDraft();
    }

    function clearDraftSelection() {
        selectedDraftUser = null;
        selectedDraftMode = null;
        renderDraft();
    }

    function assignOrChangeTeam(team) {
        if (!isCommish) return;
        if (!selectedDraftUser) return;

        const existingPickIndex = league.userTeams.findIndex((pick) => pick.user === selectedDraftUser);

        if (selectedDraftMode === "assign") {
            if (existingPickIndex !== -1) return;
            league.userTeams.push({ user: selectedDraftUser, team });
        } else if (selectedDraftMode === "change") {
            if (existingPickIndex === -1) return;

            const teamTaken = league.userTeams.some(
                (pick) => pick.team === team && pick.user !== selectedDraftUser
            );

            if (teamTaken) {
                alert("That team is already assigned to another user.");
                return;
            }

            league.userTeams[existingPickIndex].team = team;
        }

        saveLeague();
        clearDraftSelection();
        renderDraft();
        renderDraftSummary();
        renderCurrentUserLeagueInfo();
    }

    function wireDraftClicks() {
        document.querySelectorAll(".draft-order-item").forEach((item) => {
            item.addEventListener("click", () => {
                const user = item.dataset.user;
                const alreadyHasTeam = league.userTeams.some((pick) => pick.user === user);
                if (alreadyHasTeam) return;
                selectDraftUser(user, "assign");
            });
        });

        document.querySelectorAll(".user-team-item").forEach((item) => {
            item.addEventListener("click", () => {
                selectDraftUser(item.dataset.user, "change");
            });
        });

        document.querySelectorAll(".cpu-team-item").forEach((item) => {
            item.addEventListener("click", () => {
                assignOrChangeTeam(item.dataset.team);
            });
        });
    }

    function renderDraft() {
        if (draftStatusText) draftStatusText.textContent = league.draftOrder.length ? "Draft Active" : "Not started";
        const remaining = getRemainingDraftOrder();
        if (currentPickText) currentPickText.textContent = remaining.length ? remaining[0] : "None";
        if (selectedDraftUserText) selectedDraftUserText.textContent = selectedDraftUser || "None";

        if (playersList) {
            playersList.innerHTML = league.members.length
                ? league.members.map((member) => {
                    const pick = getUserPick(member);
                    const label = pick ? `${member} • ${getDisplayTeamName(pick.team)}` : member;
                    return `<div class="draft-item">${label}</div>`;
                }).join("")
                : `<p class="empty-text">No players in league yet.</p>`;
        }

        if (draftOrderList) {
            draftOrderList.innerHTML = league.draftOrder.length
                ? league.draftOrder.map((member, index) => {
                    const alreadyHasTeam = league.userTeams.some((pick) => pick.user === member);
                    const selected = selectedDraftUser === member && selectedDraftMode === "assign";
                    return `
                        <div class="draft-item draft-order-item ${alreadyHasTeam ? "draft-disabled" : ""} ${selected ? "draft-selected" : ""}" data-user="${member}">
                            <strong>${index + 1}.</strong> ${member}
                        </div>
                    `;
                }).join("")
                : `<p class="empty-text">Draft order not set.</p>`;
        }

        if (userTeamsList) {
            userTeamsList.innerHTML = league.userTeams.length
                ? league.userTeams.map((pick) => {
                    const selected = selectedDraftUser === pick.user && selectedDraftMode === "change";
                    return `
                        <div class="draft-item user-team-item ${selected ? "draft-selected" : ""}" data-user="${pick.user}">
                            <strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}
                        </div>
                    `;
                }).join("")
                : `<p class="empty-text">No user teams assigned yet.</p>`;
        }

        const cpuTeams = getCpuTeams();
        if (cpuTeamsList) {
            cpuTeamsList.innerHTML = cpuTeams.length
                ? cpuTeams.map((team) => `
                    <div class="draft-item cpu-team-item ${selectedDraftUser ? "cpu-clickable" : "draft-disabled"}" data-team="${team}">
                        ${getDisplayTeamName(team)}
                    </div>
                `).join("")
                : `<p class="empty-text">No CPU teams available.</p>`;
        }

        wireDraftClicks();
    }

    function renderDraftSummary() {
        if (draftSummaryUserTeams) {
            draftSummaryUserTeams.innerHTML = league.userTeams.length
                ? league.userTeams.map((pick) => `
                    <div class="draft-item"><strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}</div>
                `).join("")
                : `<p class="empty-text">No user teams assigned yet.</p>`;
        }

        const cpuTeams = getCpuTeams();
        if (draftSummaryCpuTeams) {
            draftSummaryCpuTeams.innerHTML = cpuTeams.length
                ? cpuTeams.map((team) => `<div class="draft-item">${getDisplayTeamName(team)}</div>`).join("")
                : `<p class="empty-text">No CPU teams left.</p>`;
        }
    }

    function renderRules() {
        if (!rulesDisplay) return;

        rulesDisplay.innerHTML = league.rulesText.trim()
            ? `<div class="formatted-text">${league.rulesText.replace(/\n/g, "<br>")}</div>`
            : `<p class="empty-text">No rules posted yet.</p>`;

        if (isCommish && rulesEditor && rulesInput) {
            rulesEditor.style.display = "block";
            rulesInput.value = league.rulesText;
        }
    }

    function renderNews() {
        if (!newsDisplay) return;

        newsDisplay.innerHTML = league.newsText.trim()
            ? `<div class="formatted-text">${league.newsText.replace(/\n/g, "<br>")}</div>`
            : `<p class="empty-text">No league news yet.</p>`;

        if (isCommish && newsEditor && newsInput) {
            newsEditor.style.display = "block";
            newsInput.value = league.newsText;
        }
    }

    function renderSettings() {
        if (!settingsMaddenOnly) return;

        if (league.game !== "Madden") {
            settingsMaddenOnly.innerHTML = `<p class="empty-text">Team relocation naming is only available for Madden leagues.</p>`;
            if (settingsEditor) settingsEditor.style.display = "none";
            return;
        }

        settingsMaddenOnly.innerHTML = `<p class="formatted-text">Commissioner can rename relocated NFL teams here.</p>`;

        if (isCommish && settingsEditor) {
            settingsEditor.style.display = "block";
        }

        if (relocateTeamSelect) {
            relocateTeamSelect.innerHTML = `<option value="">Select NFL Team</option>`;
            getDefaultTeams("Madden").forEach((team) => {
                const option = document.createElement("option");
                option.value = team;
                option.textContent = getDisplayTeamName(team);
                relocateTeamSelect.appendChild(option);
            });
        }

        const overrideKeys = Object.keys(league.teamNameOverrides);
        if (customTeamNamesList) {
            customTeamNamesList.innerHTML = overrideKeys.length
                ? overrideKeys.map((team) => `
                    <div class="draft-item">
                        <span><strong>${team}</strong> → ${league.teamNameOverrides[team]}</span>
                    </div>
                `).join("")
                : `<p class="empty-text">No custom team names yet.</p>`;
        }
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

    function wireChatTools(config) {
        const {
            input,
            sendBtn,
            imageInput,
            emojiToggleBtn,
            emojiPickerWrap,
            emojiGrid,
            gifToggleBtn,
            gifPickerWrap,
            gifSearchInput,
            gifSearchBtn,
            gifResultsGrid,
            otherGifWraps,
            otherEmojiWraps,
            arrayName,
            renderFn
        } = config;

        buildEmojiPicker(emojiGrid, input);

        if (emojiToggleBtn) {
            emojiToggleBtn.addEventListener("click", () => {
                togglePanel(emojiPickerWrap, [gifPickerWrap, ...otherGifWraps, ...otherEmojiWraps]);
            });
        }

        if (gifToggleBtn) {
            gifToggleBtn.addEventListener("click", async () => {
                const opening = gifPickerWrap.style.display === "none" || gifPickerWrap.style.display === "";
                togglePanel(gifPickerWrap, [emojiPickerWrap, ...otherGifWraps, ...otherEmojiWraps]);
                if (opening) {
                    await loadGifPanel(gifResultsGrid, "", arrayName, renderFn, gifPickerWrap);
                }
            });
        }

        if (gifSearchBtn) {
            gifSearchBtn.addEventListener("click", async () => {
                await loadGifPanel(gifResultsGrid, gifSearchInput.value, arrayName, renderFn, gifPickerWrap);
            });
        }

        if (gifSearchInput) {
            gifSearchInput.addEventListener("keydown", async (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    await loadGifPanel(gifResultsGrid, gifSearchInput.value, arrayName, renderFn, gifPickerWrap);
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener("click", () => {
                sendTextMessage(input, arrayName, renderFn);
            });
        }

        if (input) {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    sendTextMessage(input, arrayName, renderFn);
                }
            });
        }

        if (imageInput) {
            imageInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    sendImageMessage(e.target.result, arrayName, renderFn);
                };
                reader.readAsDataURL(file);
                imageInput.value = "";
            });
        }
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabPanels.forEach((panel) => panel.classList.remove("active"));

            button.classList.add("active");
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) targetPanel.classList.add("active");
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    if (saveRulesBtn) {
        saveRulesBtn.addEventListener("click", () => {
            league.rulesText = rulesInput.value.trim();
            saveLeague();
            renderRules();
        });
    }

    if (saveNewsBtn) {
        saveNewsBtn.addEventListener("click", () => {
            league.newsText = newsInput.value.trim();
            saveLeague();
            renderNews();
        });
    }

    if (randomizeOrderBtn) {
        randomizeOrderBtn.addEventListener("click", () => {
            league.draftOrder = shuffleArray(league.members);
            league.userTeams = [];
            clearDraftSelection();
            saveLeague();
            renderDraft();
            renderDraftSummary();
            renderCurrentUserLeagueInfo();
        });
    }

    if (resetDraftBtn) {
        resetDraftBtn.addEventListener("click", () => {
            if (!confirm("Reset the full draft?")) return;
            league.draftOrder = [];
            league.userTeams = [];
            clearDraftSelection();
            saveLeague();
            renderDraft();
            renderDraftSummary();
            renderCurrentUserLeagueInfo();
        });
    }

    if (clearSelectedUserBtn) {
        clearSelectedUserBtn.addEventListener("click", () => {
            clearDraftSelection();
        });
    }

    if (saveRelocationBtn) {
        saveRelocationBtn.addEventListener("click", () => {
            const selectedOriginalTeam = relocateTeamSelect.value;
            const newTeamName = relocateNameInput.value.trim();

            if (!selectedOriginalTeam || !newTeamName) {
                alert("Select a team and type a new name.");
                return;
            }

            league.teamNameOverrides[selectedOriginalTeam] = newTeamName;
            saveLeague();
            relocateTeamSelect.value = "";
            relocateNameInput.value = "";
            renderSettings();
            renderDraft();
            renderDraftSummary();
            renderCurrentUserLeagueInfo();
        });
    }

    if (leagueTitle) leagueTitle.textContent = league.name;
    if (leagueMeta) leagueMeta.textContent = `${league.game} • ${league.type} • Commissioner: ${league.commissioner}`;
    renderCurrentUserLeagueInfo();

    renderChat();
    renderSchedule();
    renderTrade();
    renderRules();
    renderNews();
    renderDraft();
    renderDraftSummary();
    renderSettings();

    wireChatTools({
        input: chatInput,
        sendBtn: sendChatBtn,
        imageInput: chatImageInput,
        emojiToggleBtn: chatEmojiToggleBtn,
        emojiPickerWrap: chatEmojiPickerWrap,
        emojiGrid: chatEmojiGrid,
        gifToggleBtn: gifToggleBtn,
        gifPickerWrap: gifPickerWrap,
        gifSearchInput: gifSearchInput,
        gifSearchBtn: gifSearchBtn,
        gifResultsGrid: gifResultsGrid,
        otherGifWraps: [scheduleGifPickerWrap, tradeGifPickerWrap],
        otherEmojiWraps: [scheduleEmojiPickerWrap, tradeEmojiPickerWrap],
        arrayName: "chatMessages",
        renderFn: renderChat
    });

    wireChatTools({
        input: scheduleInput,
        sendBtn: sendScheduleBtn,
        imageInput: scheduleImageInput,
        emojiToggleBtn: scheduleEmojiToggleBtn,
        emojiPickerWrap: scheduleEmojiPickerWrap,
        emojiGrid: scheduleEmojiGrid,
        gifToggleBtn: scheduleGifToggleBtn,
        gifPickerWrap: scheduleGifPickerWrap,
        gifSearchInput: scheduleGifSearchInput,
        gifSearchBtn: scheduleGifSearchBtn,
        gifResultsGrid: scheduleGifResultsGrid,
        otherGifWraps: [gifPickerWrap, tradeGifPickerWrap],
        otherEmojiWraps: [chatEmojiPickerWrap, tradeEmojiPickerWrap],
        arrayName: "scheduleMessages",
        renderFn: renderSchedule
    });

    wireChatTools({
        input: tradeInput,
        sendBtn: sendTradeBtn,
        imageInput: tradeImageInput,
        emojiToggleBtn: tradeEmojiToggleBtn,
        emojiPickerWrap: tradeEmojiPickerWrap,
        emojiGrid: tradeEmojiGrid,
        gifToggleBtn: tradeGifToggleBtn,
        gifPickerWrap: tradeGifPickerWrap,
        gifSearchInput: tradeGifSearchInput,
        gifSearchBtn: tradeGifSearchBtn,
        gifResultsGrid: tradeGifResultsGrid,
        otherGifWraps: [gifPickerWrap, scheduleGifPickerWrap],
        otherEmojiWraps: [chatEmojiPickerWrap, scheduleEmojiPickerWrap],
        arrayName: "tradeMessages",
        renderFn: renderTrade
    });
});