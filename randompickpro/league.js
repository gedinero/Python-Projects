document.addEventListener("DOMContentLoaded", () => {
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
    const gifInputWrap = document.getElementById("gifInputWrap");
    const gifUrlInput = document.getElementById("gifUrlInput");
    const sendGifBtn = document.getElementById("sendGifBtn");
    const typingIndicatorRow = document.getElementById("typingIndicatorRow");
    const typingText = document.getElementById("typingText");

    const scheduleBox = document.getElementById("scheduleBox");
    const scheduleInput = document.getElementById("scheduleInput");
    const sendScheduleBtn = document.getElementById("sendScheduleBtn");
    const scheduleImageInput = document.getElementById("scheduleImageInput");
    const scheduleEmojiToggleBtn = document.getElementById("scheduleEmojiToggleBtn");
    const scheduleEmojiPickerWrap = document.getElementById("scheduleEmojiPickerWrap");
    const scheduleEmojiGrid = document.getElementById("scheduleEmojiGrid");
    const scheduleGifToggleBtn = document.getElementById("scheduleGifToggleBtn");
    const scheduleGifInputWrap = document.getElementById("scheduleGifInputWrap");
    const scheduleGifUrlInput = document.getElementById("scheduleGifUrlInput");
    const sendScheduleGifBtn = document.getElementById("sendScheduleGifBtn");
    const scheduleTypingIndicatorRow = document.getElementById("scheduleTypingIndicatorRow");
    const scheduleTypingText = document.getElementById("scheduleTypingText");

    const tradeBox = document.getElementById("tradeBox");
    const tradeInput = document.getElementById("tradeInput");
    const sendTradeBtn = document.getElementById("sendTradeBtn");
    const tradeImageInput = document.getElementById("tradeImageInput");
    const tradeEmojiToggleBtn = document.getElementById("tradeEmojiToggleBtn");
    const tradeEmojiPickerWrap = document.getElementById("tradeEmojiPickerWrap");
    const tradeEmojiGrid = document.getElementById("tradeEmojiGrid");
    const tradeGifToggleBtn = document.getElementById("tradeGifToggleBtn");
    const tradeGifInputWrap = document.getElementById("tradeGifInputWrap");
    const tradeGifUrlInput = document.getElementById("tradeGifUrlInput");
    const sendTradeGifBtn = document.getElementById("sendTradeGifBtn");
    const tradeTypingIndicatorRow = document.getElementById("tradeTypingIndicatorRow");
    const tradeTypingText = document.getElementById("tradeTypingText");

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
    const draftControls = document.getElementById("draftControls");
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

    const EMOJIS = [
        "😀","😂","🤣","😭","😎","🔥","💯","👀","😤","😈",
        "🥶","🤝","🙏","💪","✅","❌","⚡","🎯","🏈","🏆",
        "🎮","📅","📣","🚨","😬","😅","🤦","🙌","😡","❤️",
        "💙","🖤","💚","🫡","💀","🥳","😮","🤔","😴","📸"
    ];

    let selectedDraftUser = null;
    let selectedDraftMode = null;
    let chatTypingTimeout = null;
    let scheduleTypingTimeout = null;
    let tradeTypingTimeout = null;

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

    function getCurrentUserData() {
        const storedUser = localStorage.getItem(currentUser);
        if (!storedUser) {
            return { username: currentUser, profilePicture: "", favoriteNFL: "" };
        }
        return JSON.parse(storedUser);
    }

    function getUserData(username) {
        const storedUser = localStorage.getItem(username);
        if (!storedUser) {
            return { username, profilePicture: "" };
        }
        return JSON.parse(storedUser);
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

    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function getAssignedTeams() {
        return league.userTeams.map((pick) => pick.team);
    }

    function getCpuTeams() {
        const allTeams = getDefaultTeams(league.game);
        const assignedTeams = getAssignedTeams();
        return allTeams.filter((team) => !assignedTeams.includes(team));
    }

    function getRemainingDraftOrder() {
        if (!league.draftOrder || league.draftOrder.length === 0) return [];
        const assignedUsers = league.userTeams.map((pick) => pick.user);
        return league.draftOrder.filter((user) => !assignedUsers.includes(user));
    }

    function getDisplayTeamName(team) {
        return league.teamNameOverrides[team] || team;
    }

    function getUserPick(user) {
        return league.userTeams.find((pick) => pick.user === user);
    }

    function getUserDisplayLabel(user) {
        const userPick = getUserPick(user);
        if (!userPick) return user;
        return `${user} • ${getDisplayTeamName(userPick.team)}`;
    }

    function renderCurrentUserLeagueInfo() {
        const currentUserPick = getUserPick(currentUser);
        const currentUserTeam = currentUserPick ? getDisplayTeamName(currentUserPick.team) : "No team assigned";
        if (myLeagueInfo) {
            myLeagueInfo.textContent = `You: ${currentUser} • Team: ${currentUserTeam}`;
        }
    }

    function buildMessageHtml(message) {
        const senderData = getUserData(message.user);
        const avatar = senderData.profilePicture || "";
        const isOwn = message.user === currentUser;
        const messageType = message.type || "text";

        let bodyHtml = "";

        if (messageType === "image") {
            bodyHtml = `<img src="${message.image}" alt="Shared image" class="chat-media-image">`;
        } else if (messageType === "gif") {
            bodyHtml = `<img src="${message.gif}" alt="GIF" class="chat-media-image">`;
        } else {
            bodyHtml = `<div class="messenger-text">${message.text}</div>`;
        }

        return `
            <div class="messenger-row ${isOwn ? "own-message" : ""}">
                ${!isOwn ? `
                    <div class="chat-avatar-wrap">
                        ${avatar ? `<img src="${avatar}" class="chat-avatar" alt="${message.user}">` : `<div class="chat-avatar fallback-avatar">${message.user.charAt(0).toUpperCase()}</div>`}
                    </div>
                ` : ""}
                <div class="messenger-bubble-wrap ${isOwn ? "own-bubble-wrap" : ""}">
                    <div class="messenger-bubble">
                        <div class="messenger-user">${getUserDisplayLabel(message.user)}</div>
                        ${bodyHtml}
                        <div class="messenger-time">${message.time}</div>
                    </div>
                </div>
                ${isOwn ? `
                    <div class="chat-avatar-wrap">
                        ${avatar ? `<img src="${avatar}" class="chat-avatar" alt="${message.user}">` : `<div class="chat-avatar fallback-avatar">${message.user.charAt(0).toUpperCase()}</div>`}
                    </div>
                ` : ""}
            </div>
        `;
    }

    function renderMessages(box, messages) {
        if (!box) return;
        if (!messages || messages.length === 0) {
            box.innerHTML = `<p class="empty-text">No messages yet.</p>`;
            return;
        }
        box.innerHTML = messages.map(buildMessageHtml).join("");
        box.scrollTop = box.scrollHeight;
    }

    function getTimeStamp() {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function addMessageObject(arrayName, payload, renderFn) {
        league[arrayName].push(payload);
        saveLeague();
        renderFn();
    }

    function buildBaseMessage(type, extraFields = {}) {
        const userData = getCurrentUserData();
        return {
            user: currentUser,
            time: getTimeStamp(),
            profilePicture: userData.profilePicture || "",
            type,
            ...extraFields
        };
    }

    function addTextMessage(inputEl, arrayName, renderFn, stopTypingFn) {
        const text = inputEl.value.trim();
        if (text === "") return;

        addMessageObject(arrayName, buildBaseMessage("text", { text }), renderFn);
        inputEl.value = "";
        if (stopTypingFn) stopTypingFn();
    }

    function addImageMessage(dataUrl, arrayName, renderFn) {
        addMessageObject(arrayName, buildBaseMessage("image", { image: dataUrl }), renderFn);
    }

    function addGifMessage(inputEl, arrayName, renderFn, wrapEl = null) {
        const gifUrl = inputEl.value.trim();
        if (gifUrl === "") return;

        addMessageObject(arrayName, buildBaseMessage("gif", { gif: gifUrl }), renderFn);
        inputEl.value = "";
        if (wrapEl) wrapEl.style.display = "none";
    }

    function insertEmoji(inputEl, emoji) {
        if (!inputEl) return;
        const start = inputEl.selectionStart ?? inputEl.value.length;
        const end = inputEl.selectionEnd ?? inputEl.value.length;
        const text = inputEl.value;

        inputEl.value = text.slice(0, start) + emoji + text.slice(end);
        inputEl.focus();

        const nextPos = start + emoji.length;
        inputEl.setSelectionRange(nextPos, nextPos);
    }

    function buildEmojiPicker(gridEl, inputEl, wrapEl) {
        if (!gridEl || !inputEl || !wrapEl) return;

        gridEl.innerHTML = EMOJIS.map((emoji) => `
            <button type="button" class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
        `).join("");

        const buttons = gridEl.querySelectorAll(".emoji-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                insertEmoji(inputEl, button.dataset.emoji);
            });
        });
    }

    function togglePanel(targetWrap, otherWraps = []) {
        if (!targetWrap) return;
        const shouldOpen = targetWrap.style.display === "none" || targetWrap.style.display === "";

        otherWraps.forEach((wrap) => {
            if (wrap) wrap.style.display = "none";
        });

        targetWrap.style.display = shouldOpen ? "block" : "none";
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
        if (!selectedDraftUser) {
            alert("Select a user first.");
            return;
        }

        const existingPickIndex = league.userTeams.findIndex((pick) => pick.user === selectedDraftUser);

        if (selectedDraftMode === "assign") {
            if (existingPickIndex !== -1) {
                alert("That user already has a team.");
                return;
            }

            league.userTeams.push({
                user: selectedDraftUser,
                team: team
            });
        } else if (selectedDraftMode === "change") {
            if (existingPickIndex === -1) {
                alert("That user does not have a team yet.");
                return;
            }

            const teamAlreadyTaken = league.userTeams.some(
                (pick) => pick.team === team && pick.user !== selectedDraftUser
            );

            if (teamAlreadyTaken) {
                alert("That team is already assigned to another user.");
                return;
            }

            league.userTeams[existingPickIndex].team = team;
        }

        saveLeague();
        selectedDraftUser = null;
        selectedDraftMode = null;

        renderDraft();
        renderDraftSummary();
        renderChat();
        renderSchedule();
        renderTrade();
        renderCurrentUserLeagueInfo();
    }

    function wireDraftClicks() {
        const assignTargets = document.querySelectorAll(".draft-order-item");
        const changeTargets = document.querySelectorAll(".user-team-item");
        const cpuTargets = document.querySelectorAll(".cpu-team-item");

        assignTargets.forEach((item) => {
            item.addEventListener("click", () => {
                if (!isCommish) return;
                const user = item.dataset.user;
                const alreadyHasTeam = league.userTeams.some((pick) => pick.user === user);
                if (alreadyHasTeam) return;
                selectDraftUser(user, "assign");
            });
        });

        changeTargets.forEach((item) => {
            item.addEventListener("click", () => {
                if (!isCommish) return;
                const user = item.dataset.user;
                selectDraftUser(user, "change");
            });
        });

        cpuTargets.forEach((item) => {
            item.addEventListener("click", () => {
                if (!isCommish) return;
                const team = item.dataset.team;
                assignOrChangeTeam(team);
            });
        });
    }

    function renderDraft() {
        if (!draftStatusText) return;

        draftStatusText.textContent = league.draftOrder.length > 0 ? "Draft Active" : "Not started";

        const remainingOrder = getRemainingDraftOrder();
        currentPickText.textContent = remainingOrder.length > 0 ? remainingOrder[0] : "None";
        selectedDraftUserText.textContent = selectedDraftUser ? selectedDraftUser : "None";

        if (draftControls && isCommish) {
            draftControls.style.display = "flex";
        }

        if (playersList) {
            if (!league.members || league.members.length === 0) {
                playersList.innerHTML = `<p class="empty-text">No players in league yet.</p>`;
            } else {
                playersList.innerHTML = league.members
                    .map((member) => `<div class="draft-item">${getUserDisplayLabel(member)}</div>`)
                    .join("");
            }
        }

        if (draftOrderList) {
            if (!league.draftOrder || league.draftOrder.length === 0) {
                draftOrderList.innerHTML = `<p class="empty-text">Draft order not set.</p>`;
            } else {
                draftOrderList.innerHTML = league.draftOrder
                    .map((member, index) => {
                        const alreadyHasTeam = league.userTeams.some((pick) => pick.user === member);
                        const isSelected = selectedDraftUser === member && selectedDraftMode === "assign";

                        return `
                            <div class="draft-item draft-order-item ${alreadyHasTeam ? "draft-disabled" : ""} ${isSelected ? "draft-selected" : ""}" data-user="${member}">
                                <strong>${index + 1}.</strong> ${getUserDisplayLabel(member)}
                            </div>
                        `;
                    })
                    .join("");
            }
        }

        if (userTeamsList) {
            if (!league.userTeams || league.userTeams.length === 0) {
                userTeamsList.innerHTML = `<p class="empty-text">No user teams assigned yet.</p>`;
            } else {
                userTeamsList.innerHTML = league.userTeams
                    .map((pick) => {
                        const isSelected = selectedDraftUser === pick.user && selectedDraftMode === "change";

                        return `
                            <div class="draft-item user-team-item ${isSelected ? "draft-selected" : ""}" data-user="${pick.user}">
                                <strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}
                            </div>
                        `;
                    })
                    .join("");
            }
        }

        const cpuTeams = getCpuTeams();

        if (cpuTeamsList) {
            if (cpuTeams.length === 0) {
                cpuTeamsList.innerHTML = `<p class="empty-text">No CPU teams left.</p>`;
            } else {
                cpuTeamsList.innerHTML = cpuTeams
                    .map((team) => `
                        <div class="draft-item cpu-team-item ${selectedDraftUser ? "cpu-clickable" : "draft-disabled"}" data-team="${team}">
                            ${getDisplayTeamName(team)}
                        </div>
                    `)
                    .join("");
            }
        }

        wireDraftClicks();
        renderCurrentUserLeagueInfo();
    }

    function renderDraftSummary() {
        if (draftSummaryUserTeams) {
            if (!league.userTeams || league.userTeams.length === 0) {
                draftSummaryUserTeams.innerHTML = `<p class="empty-text">No user teams assigned yet.</p>`;
            } else {
                draftSummaryUserTeams.innerHTML = league.userTeams
                    .map((pick) => `<div class="draft-item"><strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}</div>`)
                    .join("");
            }
        }

        const cpuTeams = getCpuTeams();

        if (draftSummaryCpuTeams) {
            if (cpuTeams.length === 0) {
                draftSummaryCpuTeams.innerHTML = `<p class="empty-text">No CPU teams left.</p>`;
            } else {
                draftSummaryCpuTeams.innerHTML = cpuTeams
                    .map((team) => `<div class="draft-item">${getDisplayTeamName(team)}</div>`)
                    .join("");
            }
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
            if (overrideKeys.length === 0) {
                customTeamNamesList.innerHTML = `<p class="empty-text">No custom team names yet.</p>`;
            } else {
                customTeamNamesList.innerHTML = overrideKeys.map((team) => `
                    <div class="draft-item settings-rename-item">
                        <span><strong>${team}</strong> → ${league.teamNameOverrides[team]}</span>
                        <button class="remove-rename-btn" data-team="${team}">Remove</button>
                    </div>
                `).join("");

                const removeButtons = document.querySelectorAll(".remove-rename-btn");

                removeButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                        const team = button.dataset.team;
                        delete league.teamNameOverrides[team];
                        saveLeague();
                        renderSettings();
                        renderDraft();
                        renderDraftSummary();
                        renderChat();
                        renderSchedule();
                        renderTrade();
                    });
                });
            }
        }
    }

    function showTypingIndicator(rowEl, textEl, text) {
        if (!rowEl || !textEl) return;
        textEl.textContent = text;
        rowEl.style.display = "flex";
    }

    function stopTypingIndicator(rowEl) {
        if (!rowEl) return;
        rowEl.style.display = "none";
    }

    buildEmojiPicker(chatEmojiGrid, chatInput, chatEmojiPickerWrap);
    buildEmojiPicker(scheduleEmojiGrid, scheduleInput, scheduleEmojiPickerWrap);
    buildEmojiPicker(tradeEmojiGrid, tradeInput, tradeEmojiPickerWrap);

    if (chatEmojiToggleBtn) {
        chatEmojiToggleBtn.addEventListener("click", () => {
            togglePanel(chatEmojiPickerWrap, [gifInputWrap]);
        });
    }

    if (scheduleEmojiToggleBtn) {
        scheduleEmojiToggleBtn.addEventListener("click", () => {
            togglePanel(scheduleEmojiPickerWrap, [scheduleGifInputWrap]);
        });
    }

    if (tradeEmojiToggleBtn) {
        tradeEmojiToggleBtn.addEventListener("click", () => {
            togglePanel(tradeEmojiPickerWrap, [tradeGifInputWrap]);
        });
    }

    if (chatInput) {
        chatInput.addEventListener("input", () => {
            if (chatInput.value.trim() !== "") {
                showTypingIndicator(typingIndicatorRow, typingText, `${currentUser} is typing...`);
                clearTimeout(chatTypingTimeout);
                chatTypingTimeout = setTimeout(() => stopTypingIndicator(typingIndicatorRow), 900);
            } else {
                stopTypingIndicator(typingIndicatorRow);
            }
        });

        chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addTextMessage(chatInput, "chatMessages", renderChat, () => stopTypingIndicator(typingIndicatorRow));
            }
        });
    }

    if (scheduleInput) {
        scheduleInput.addEventListener("input", () => {
            if (scheduleInput.value.trim() !== "") {
                showTypingIndicator(scheduleTypingIndicatorRow, scheduleTypingText, `${currentUser} is typing...`);
                clearTimeout(scheduleTypingTimeout);
                scheduleTypingTimeout = setTimeout(() => stopTypingIndicator(scheduleTypingIndicatorRow), 900);
            } else {
                stopTypingIndicator(scheduleTypingIndicatorRow);
            }
        });

        scheduleInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addTextMessage(scheduleInput, "scheduleMessages", renderSchedule, () => stopTypingIndicator(scheduleTypingIndicatorRow));
            }
        });
    }

    if (tradeInput) {
        tradeInput.addEventListener("input", () => {
            if (tradeInput.value.trim() !== "") {
                showTypingIndicator(tradeTypingIndicatorRow, tradeTypingText, `${currentUser} is typing...`);
                clearTimeout(tradeTypingTimeout);
                tradeTypingTimeout = setTimeout(() => stopTypingIndicator(tradeTypingIndicatorRow), 900);
            } else {
                stopTypingIndicator(tradeTypingIndicatorRow);
            }
        });

        tradeInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addTextMessage(tradeInput, "tradeMessages", renderTrade, () => stopTypingIndicator(tradeTypingIndicatorRow));
            }
        });
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", () => {
            addTextMessage(chatInput, "chatMessages", renderChat, () => stopTypingIndicator(typingIndicatorRow));
        });
    }

    if (sendScheduleBtn) {
        sendScheduleBtn.addEventListener("click", () => {
            addTextMessage(scheduleInput, "scheduleMessages", renderSchedule, () => stopTypingIndicator(scheduleTypingIndicatorRow));
        });
    }

    if (sendTradeBtn) {
        sendTradeBtn.addEventListener("click", () => {
            addTextMessage(tradeInput, "tradeMessages", renderTrade, () => stopTypingIndicator(tradeTypingIndicatorRow));
        });
    }

    if (gifToggleBtn) {
        gifToggleBtn.addEventListener("click", () => {
            togglePanel(gifInputWrap, [chatEmojiPickerWrap]);
        });
    }

    if (scheduleGifToggleBtn) {
        scheduleGifToggleBtn.addEventListener("click", () => {
            togglePanel(scheduleGifInputWrap, [scheduleEmojiPickerWrap]);
        });
    }

    if (tradeGifToggleBtn) {
        tradeGifToggleBtn.addEventListener("click", () => {
            togglePanel(tradeGifInputWrap, [tradeEmojiPickerWrap]);
        });
    }

    if (sendGifBtn) {
        sendGifBtn.addEventListener("click", () => {
            addGifMessage(gifUrlInput, "chatMessages", renderChat, gifInputWrap);
        });
    }

    if (sendScheduleGifBtn) {
        sendScheduleGifBtn.addEventListener("click", () => {
            addGifMessage(scheduleGifUrlInput, "scheduleMessages", renderSchedule, scheduleGifInputWrap);
        });
    }

    if (sendTradeGifBtn) {
        sendTradeGifBtn.addEventListener("click", () => {
            addGifMessage(tradeGifUrlInput, "tradeMessages", renderTrade, tradeGifInputWrap);
        });
    }

    if (chatImageInput) {
        chatImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                addImageMessage(e.target.result, "chatMessages", renderChat);
            };
            reader.readAsDataURL(file);
            chatImageInput.value = "";
        });
    }

    if (scheduleImageInput) {
        scheduleImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                addImageMessage(e.target.result, "scheduleMessages", renderSchedule);
            };
            reader.readAsDataURL(file);
            scheduleImageInput.value = "";
        });
    }

    if (tradeImageInput) {
        tradeImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                addImageMessage(e.target.result, "tradeMessages", renderTrade);
            };
            reader.readAsDataURL(file);
            tradeImageInput.value = "";
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

    if (randomizeOrderBtn && isCommish) {
        randomizeOrderBtn.addEventListener("click", () => {
            league.draftOrder = shuffleArray(league.members);
            league.userTeams = [];
            selectedDraftUser = null;
            selectedDraftMode = null;
            saveLeague();
            renderDraft();
            renderDraftSummary();
            renderChat();
            renderSchedule();
            renderTrade();
        });
    }

    if (resetDraftBtn && isCommish) {
        resetDraftBtn.addEventListener("click", () => {
            const confirmed = confirm("Reset the full draft?");
            if (!confirmed) return;

            league.draftOrder = [];
            league.userTeams = [];
            selectedDraftUser = null;
            selectedDraftMode = null;
            saveLeague();
            renderDraft();
            renderDraftSummary();
            renderChat();
            renderSchedule();
            renderTrade();
            renderCurrentUserLeagueInfo();
        });
    }

    if (clearSelectedUserBtn) {
        clearSelectedUserBtn.addEventListener("click", () => {
            clearDraftSelection();
        });
    }

    if (saveRelocationBtn && isCommish) {
        saveRelocationBtn.addEventListener("click", () => {
            const selectedOriginalTeam = relocateTeamSelect.value;
            const newTeamName = relocateNameInput.value.trim();

            if (selectedOriginalTeam === "" || newTeamName === "") {
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
            renderChat();
            renderSchedule();
            renderTrade();
            renderCurrentUserLeagueInfo();
        });
    }

    renderChat();
    renderSchedule();
    renderTrade();
    renderRules();
    renderNews();
    renderDraft();
    renderDraftSummary();
    renderSettings();
    renderCurrentUserLeagueInfo();
});