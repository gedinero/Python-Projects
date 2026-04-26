document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("currentUser");
  const selectedLeagueId = localStorage.getItem("selectedLeagueId");

  if (!savedUser) {
    window.location.href = "index.html";
    return;
  }

  let currentUser;

  try {
    currentUser = JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
    return;
  }

  const currentUsername = currentUser.username || "Commissioner";
  const currentUserImage = currentUser.profilePicture || "";

  const leagues = JSON.parse(localStorage.getItem("leagues")) || [];
  const league = leagues.find((item) => String(item.id) === String(selectedLeagueId));

  const leagueTitle = document.getElementById("leagueTitle");
  const leagueMeta = document.getElementById("leagueMeta");
  const myLeagueInfo = document.getElementById("myLeagueInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  const leagueMenuToggle = document.getElementById("leagueMenuToggle");
  const leagueTabs = document.querySelector(".league-tabs");

  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const chatTypingIndicator = document.getElementById("chatTypingIndicator");

  const scheduleBox = document.getElementById("scheduleBox");
  const scheduleInput = document.getElementById("scheduleInput");
  const sendScheduleBtn = document.getElementById("sendScheduleBtn");
  const scheduleTypingIndicator = document.getElementById("scheduleTypingIndicator");

  const tradeBox = document.getElementById("tradeBox");
  const tradeInput = document.getElementById("tradeInput");
  const sendTradeBtn = document.getElementById("sendTradeBtn");
  const tradeTypingIndicator = document.getElementById("tradeTypingIndicator");

  const chatImageInput = document.getElementById("chatImageInput");
  const scheduleImageInput = document.getElementById("scheduleImageInput");
  const tradeImageInput = document.getElementById("tradeImageInput");

  const chatEmojiToggleBtn = document.getElementById("chatEmojiToggleBtn");
  const scheduleEmojiToggleBtn = document.getElementById("scheduleEmojiToggleBtn");
  const tradeEmojiToggleBtn = document.getElementById("tradeEmojiToggleBtn");

  const chatEmojiPickerWrap = document.getElementById("chatEmojiPickerWrap");
  const scheduleEmojiPickerWrap = document.getElementById("scheduleEmojiPickerWrap");
  const tradeEmojiPickerWrap = document.getElementById("tradeEmojiPickerWrap");

  const chatEmojiGrid = document.getElementById("chatEmojiGrid");
  const scheduleEmojiGrid = document.getElementById("scheduleEmojiGrid");
  const tradeEmojiGrid = document.getElementById("tradeEmojiGrid");

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

  const EMOJIS = ["😀","😂","🤣","😭","😎","🔥","💯","👀","😤","😈","🥶","🤝","🙏","💪","✅","❌","⚡","🎯","🏈","🏆","🎮","📅","📣","🚨","🤦","🙌","❤️","🫡","💀"];

  let selectedDraftUser = null;
  let selectedDraftMode = null;

  if (!league) {
    if (leagueTitle) leagueTitle.textContent = "League Not Found";
    if (leagueMeta) leagueMeta.textContent = "No league data found.";
    return;
  }

  league.members ||= [league.commissioner || currentUsername];
  league.chatMessages ||= [];
  league.scheduleMessages ||= [];
  league.tradeMessages ||= [];
  league.rulesText ||= "";
  league.newsText ||= "";
  league.draftOrder ||= [];
  league.userTeams ||= [];
  league.teamNameOverrides ||= {};

  const isCommish =
    league.commissioner === currentUsername ||
    league.commissionerUid === currentUser.uid;

  function saveLeague() {
    const allLeagues = JSON.parse(localStorage.getItem("leagues")) || [];
    const updated = allLeagues.map((item) =>
      String(item.id) === String(league.id) ? league : item
    );
    localStorage.setItem("leagues", JSON.stringify(updated));
  }

  function getTimeStamp() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function getDefaultAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8dffb8&color=08110d&bold=true`;
  }

  function getUserProfileImage(username) {
    if (username === currentUsername && currentUserImage) return currentUserImage;
    return getDefaultAvatar(username);
  }

  function getDefaultTeams(game) {
    if (game === "Madden") {
      return [
        "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills","Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns","Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers","Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs","Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins","Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants","New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers","Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"
      ];
    }

    return [
      "Alabama","Auburn","Clemson","Florida","Florida State","Georgia","LSU","Miami","Michigan","Notre Dame","Ohio State","Oklahoma","Oregon","Penn State","Tennessee","Texas","Texas A&M","USC"
    ];
  }

  function getDisplayTeamName(team) {
    return league.teamNameOverrides[team] || team;
  }

  function getUserPick(user) {
    return league.userTeams.find((pick) => pick.user === user);
  }

  function getCpuTeams() {
    const assigned = league.userTeams.map((pick) => pick.team);
    return getDefaultTeams(league.game).filter((team) => !assigned.includes(team));
  }

  function renderHeader() {
    if (leagueTitle) leagueTitle.textContent = league.name || "League";
    if (leagueMeta) {
      leagueMeta.textContent = `${league.game || "Game"} • ${league.type || "Type"} • Commissioner: ${league.commissioner || currentUsername}`;
    }

    const pick = getUserPick(currentUsername);
    const team = pick ? getDisplayTeamName(pick.team) : "No team assigned";

    if (myLeagueInfo) {
      myLeagueInfo.textContent = `You: ${currentUsername} • Team: ${team}`;
    }
  }

  function buildMessageBubble(message) {
    const avatarSrc = getUserProfileImage(message.user);

    let body = `<div class="messenger-text">${message.text || ""}</div>`;

    if (message.type === "image") {
      body = `<img src="${message.image}" alt="Shared image" class="chat-media-image">`;
    }

    return `
      <div class="messenger-row ${message.user === currentUsername ? "own-message" : ""}">
        <img src="${avatarSrc}" alt="${message.user}" class="message-avatar outside-avatar">
        <div class="messenger-bubble">
          <div class="messenger-user">${message.user}</div>
          ${body}
          <div class="messenger-time">${message.time}</div>
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

    box.innerHTML = messages.map(buildMessageBubble).join("");
    box.scrollTop = box.scrollHeight;
  }

  function addMessage(arrayName, payload, renderFn) {
    league[arrayName].push(payload);
    saveLeague();
    renderFn();
  }

  function sendTextMessage(input, arrayName, renderFn) {
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage(arrayName, {
      user: currentUsername,
      text,
      type: "text",
      time: getTimeStamp()
    }, renderFn);

    input.value = "";
  }

  function sendImageMessage(fileInput, arrayName, renderFn) {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      addMessage(arrayName, {
        user: currentUsername,
        image: event.target.result,
        type: "image",
        time: getTimeStamp()
      }, renderFn);

      fileInput.value = "";
    };

    reader.readAsDataURL(file);
  }

  function setupTypingIndicator(input, indicator) {
  if (!input || !indicator) return;

  const avatarSrc = currentUser.profilePicture && currentUser.profilePicture.trim() !== ""
    ? currentUser.profilePicture
    : getDefaultAvatar(currentUsername);

  indicator.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <img
        src="${avatarSrc}"
        alt="${currentUsername}"
        style="
          display:block;
          width:36px;
          height:36px;
          min-width:36px;
          border-radius:50%;
          object-fit:cover;
          border:2px solid rgba(141,255,184,0.85);
        "
      >

      <div class="typing-bubble">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;

  let timer;

  input.addEventListener("input", () => {
    indicator.style.display = "flex";
    indicator.style.margin = "10px 0 10px 12px";

    clearTimeout(timer);

    timer = setTimeout(() => {
      indicator.style.display = "none";
    }, 1000);
  });
}

  function setupEmoji(toggleBtn, wrap, grid, input) {
    if (!toggleBtn || !wrap || !grid || !input) return;

    grid.innerHTML = EMOJIS.map((emoji) => `
      <button type="button" class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
    `).join("");

    grid.querySelectorAll(".emoji-btn").forEach((button) => {
      button.addEventListener("click", () => {
        input.value += button.dataset.emoji;
        input.focus();
      });
    });

    toggleBtn.addEventListener("click", () => {
      wrap.style.display = wrap.style.display === "block" ? "none" : "block";
    });
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
    if (!rulesDisplay) return;

    rulesDisplay.innerHTML = league.rulesText
      ? `<div class="formatted-text">${league.rulesText.replace(/\n/g, "<br>")}</div>`
      : `<p class="empty-text">No rules posted yet.</p>`;

    if (isCommish && rulesEditor && rulesInput) {
      rulesEditor.style.display = "block";
      rulesInput.value = league.rulesText;
    }
  }

  function renderNews() {
    if (!newsDisplay) return;

    newsDisplay.innerHTML = league.newsText
      ? `<div class="formatted-text">${league.newsText.replace(/\n/g, "<br>")}</div>`
      : `<p class="empty-text">No league news yet.</p>`;

    if (isCommish && newsEditor && newsInput) {
      newsEditor.style.display = "block";
      newsInput.value = league.newsText;
    }
  }

  function renderDraft() {
    const remaining = league.draftOrder.filter(
      (user) => !league.userTeams.some((pick) => pick.user === user)
    );

    if (draftStatusText) draftStatusText.textContent = league.draftOrder.length ? "Draft Active" : "Not started";
    if (currentPickText) currentPickText.textContent = remaining[0] || "None";
    if (selectedDraftUserText) selectedDraftUserText.textContent = selectedDraftUser || "None";

    if (playersList) {
      playersList.innerHTML = league.members.map((member) => {
        const pick = getUserPick(member);
        return `<div class="draft-item">${pick ? `${member} • ${getDisplayTeamName(pick.team)}` : member}</div>`;
      }).join("");
    }

    if (draftOrderList) {
      draftOrderList.innerHTML = league.draftOrder.length
        ? league.draftOrder.map((member, index) => `
          <div class="draft-item draft-order-item" data-user="${member}">
            <strong>${index + 1}.</strong> ${member}
          </div>
        `).join("")
        : `<p class="empty-text">Draft order not set.</p>`;
    }

    if (userTeamsList) {
      userTeamsList.innerHTML = league.userTeams.length
        ? league.userTeams.map((pick) => `
          <div class="draft-item user-team-item" data-user="${pick.user}">
            <strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}
          </div>
        `).join("")
        : `<p class="empty-text">No user teams assigned yet.</p>`;
    }

    if (cpuTeamsList) {
      cpuTeamsList.innerHTML = getCpuTeams().map((team) => `
        <div class="draft-item cpu-team-item" data-team="${team}">
          ${getDisplayTeamName(team)}
        </div>
      `).join("");
    }

    wireDraftClicks();
  }

  function renderDraftSummary() {
    if (draftSummaryUserTeams) {
      draftSummaryUserTeams.innerHTML = league.userTeams.length
        ? league.userTeams.map((pick) => `<div class="draft-item"><strong>${pick.user}</strong> → ${getDisplayTeamName(pick.team)}</div>`).join("")
        : `<p class="empty-text">No user teams assigned yet.</p>`;
    }

    if (draftSummaryCpuTeams) {
      draftSummaryCpuTeams.innerHTML = getCpuTeams().map((team) => `<div class="draft-item">${getDisplayTeamName(team)}</div>`).join("");
    }
  }

  function wireDraftClicks() {
    document.querySelectorAll(".draft-order-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (!isCommish) return;
        selectedDraftUser = item.dataset.user;
        selectedDraftMode = "assign";
        renderDraft();
      });
    });

    document.querySelectorAll(".user-team-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (!isCommish) return;
        selectedDraftUser = item.dataset.user;
        selectedDraftMode = "change";
        renderDraft();
      });
    });

    document.querySelectorAll(".cpu-team-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (!isCommish || !selectedDraftUser) return;

        const existingIndex = league.userTeams.findIndex((pick) => pick.user === selectedDraftUser);

        if (selectedDraftMode === "assign" && existingIndex === -1) {
          league.userTeams.push({ user: selectedDraftUser, team: item.dataset.team });
        }

        if (selectedDraftMode === "change" && existingIndex !== -1) {
          league.userTeams[existingIndex].team = item.dataset.team;
        }

        selectedDraftUser = null;
        selectedDraftMode = null;

        saveLeague();
        renderHeader();
        renderDraft();
        renderDraftSummary();
      });
    });
  }

  function renderSettings() {
    if (!settingsMaddenOnly) return;

    if (league.game !== "Madden") {
      settingsMaddenOnly.innerHTML = `<p class="empty-text">Team relocation naming is only available for Madden leagues.</p>`;
      return;
    }

    if (isCommish && settingsEditor) settingsEditor.style.display = "block";

    if (relocateTeamSelect) {
      relocateTeamSelect.innerHTML = `<option value="">Select NFL Team</option>`;
      getDefaultTeams("Madden").forEach((team) => {
        const option = document.createElement("option");
        option.value = team;
        option.textContent = getDisplayTeamName(team);
        relocateTeamSelect.appendChild(option);
      });
    }

    if (customTeamNamesList) {
      const names = Object.keys(league.teamNameOverrides);
      customTeamNamesList.innerHTML = names.length
        ? names.map((team) => `<div class="draft-item"><strong>${team}</strong> → ${league.teamNameOverrides[team]}</div>`).join("")
        : `<p class="empty-text">No custom team names yet.</p>`;
    }
  }

  leagueMenuToggle?.addEventListener("click", () => {
  leagueTabs?.classList.toggle("open");
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab)?.classList.add("active");

    if (window.innerWidth <= 768) {
      leagueTabs?.classList.remove("open");
    }
  });
});

  logoutBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedLeagueId");
    window.location.href = "index.html";
  });

  sendChatBtn?.addEventListener("click", () => sendTextMessage(chatInput, "chatMessages", renderChat));
  sendScheduleBtn?.addEventListener("click", () => sendTextMessage(scheduleInput, "scheduleMessages", renderSchedule));
  sendTradeBtn?.addEventListener("click", () => sendTextMessage(tradeInput, "tradeMessages", renderTrade));

  chatInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendTextMessage(chatInput, "chatMessages", renderChat);
  });

  scheduleInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendTextMessage(scheduleInput, "scheduleMessages", renderSchedule);
  });

  tradeInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendTextMessage(tradeInput, "tradeMessages", renderTrade);
  });

  chatImageInput?.addEventListener("change", () => sendImageMessage(chatImageInput, "chatMessages", renderChat));
  scheduleImageInput?.addEventListener("change", () => sendImageMessage(scheduleImageInput, "scheduleMessages", renderSchedule));
  tradeImageInput?.addEventListener("change", () => sendImageMessage(tradeImageInput, "tradeMessages", renderTrade));

  saveRulesBtn?.addEventListener("click", () => {
    league.rulesText = rulesInput.value.trim();
    saveLeague();
    renderRules();
  });

  saveNewsBtn?.addEventListener("click", () => {
    league.newsText = newsInput.value.trim();
    saveLeague();
    renderNews();
  });

  randomizeOrderBtn?.addEventListener("click", () => {
    league.draftOrder = [...league.members].sort(() => Math.random() - 0.5);
    league.userTeams = [];
    saveLeague();
    renderDraft();
    renderDraftSummary();
  });

  resetDraftBtn?.addEventListener("click", () => {
    if (!confirm("Reset the draft?")) return;
    league.draftOrder = [];
    league.userTeams = [];
    saveLeague();
    renderDraft();
    renderDraftSummary();
  });

  clearSelectedUserBtn?.addEventListener("click", () => {
    selectedDraftUser = null;
    selectedDraftMode = null;
    renderDraft();
  });

  saveRelocationBtn?.addEventListener("click", () => {
    const team = relocateTeamSelect.value;
    const newName = relocateNameInput.value.trim();

    if (!team || !newName) {
      alert("Select a team and type a new name.");
      return;
    }

    league.teamNameOverrides[team] = newName;
    relocateNameInput.value = "";
    saveLeague();
    renderSettings();
    renderDraft();
    renderDraftSummary();
    renderHeader();
  });

  setupEmoji(chatEmojiToggleBtn, chatEmojiPickerWrap, chatEmojiGrid, chatInput);
  setupEmoji(scheduleEmojiToggleBtn, scheduleEmojiPickerWrap, scheduleEmojiGrid, scheduleInput);
  setupEmoji(tradeEmojiToggleBtn, tradeEmojiPickerWrap, tradeEmojiGrid, tradeInput);

  setupTypingIndicator(chatInput, chatTypingIndicator);
  setupTypingIndicator(scheduleInput, scheduleTypingIndicator);
  setupTypingIndicator(tradeInput, tradeTypingIndicator);

  renderHeader();
  renderChat();
  renderSchedule();
  renderTrade();
  renderRules();
  renderNews();
  renderDraft();
  renderDraftSummary();
  renderSettings();
});