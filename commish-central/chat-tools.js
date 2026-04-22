document.addEventListener("DOMContentLoaded", () => {
    const GIPHY_API_KEY = "fAamOwF84swNA9O56F0l3hz1G7huYaA1";
    const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

    const EMOJIS = [
        "😀","😂","🤣","😭","😎","🔥","💯","👀","😤","😈",
        "🥶","🤝","🙏","💪","✅","❌","⚡","🎯","🏈","🏆",
        "🎮","📅","📣","🚨","😬","😅","🤦","🙌","😡","❤️",
        "💙","🖤","💚","🫡","💀","🥳","😮","🤔","😴","📸"
    ];

    const currentUserName = localStorage.getItem("currentUser") || "Ge Dinero";

    function getTimeStamp() {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function togglePanel(targetWrap, otherWraps = []) {
        if (!targetWrap) return;

        const shouldOpen =
            targetWrap.style.display === "none" ||
            targetWrap.style.display === "";

        otherWraps.forEach((wrap) => {
            if (wrap) wrap.style.display = "none";
        });

        targetWrap.style.display = shouldOpen ? "block" : "none";
    }

    function insertEmoji(inputEl, emoji) {
        if (!inputEl) return;

        const start = inputEl.selectionStart ?? inputEl.value.length;
        const end = inputEl.selectionEnd ?? inputEl.value.length;
        const currentValue = inputEl.value;

        inputEl.value =
            currentValue.slice(0, start) +
            emoji +
            currentValue.slice(end);

        const nextPos = start + emoji.length;
        inputEl.focus();
        inputEl.setSelectionRange(nextPos, nextPos);
    }

    function buildEmojiPicker(gridEl, inputEl) {
        if (!gridEl || !inputEl) return;

        gridEl.innerHTML = EMOJIS.map((emoji) => {
            return `<button type="button" class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`;
        }).join("");

        gridEl.querySelectorAll(".emoji-btn").forEach((button) => {
            button.addEventListener("click", () => {
                insertEmoji(inputEl, button.dataset.emoji);
            });
        });
    }

    function appendMessage(boxEl, html) {
        if (!boxEl) return;

        const emptyText = boxEl.querySelector(".empty-text");
        if (emptyText) emptyText.remove();

        const wrapper = document.createElement("div");
        wrapper.className = "messenger-row own-message";
        wrapper.innerHTML = html;

        boxEl.appendChild(wrapper);
        boxEl.scrollTop = boxEl.scrollHeight;
    }

    function sendTextMessage(boxEl, inputEl) {
        if (!boxEl || !inputEl) return;

        const text = inputEl.value.trim();
        if (!text) return;

        appendMessage(boxEl, `
            <div class="messenger-bubble-wrap own-bubble-wrap">
                <div class="messenger-bubble">
                    <div class="messenger-user">${currentUserName}</div>
                    <div class="messenger-text">${text}</div>
                    <div class="messenger-time">${getTimeStamp()}</div>
                </div>
            </div>
        `);

        inputEl.value = "";
    }

    function sendImageMessage(boxEl, imageUrl) {
        if (!boxEl || !imageUrl) return;

        appendMessage(boxEl, `
            <div class="messenger-bubble-wrap own-bubble-wrap">
                <div class="messenger-bubble">
                    <div class="messenger-user">${currentUserName}</div>
                    <img src="${imageUrl}" alt="Shared image" class="chat-media-image">
                    <div class="messenger-time">${getTimeStamp()}</div>
                </div>
            </div>
        `);
    }

    function sendGifMessage(boxEl, gifUrl) {
        if (!boxEl || !gifUrl) return;

        appendMessage(boxEl, `
            <div class="messenger-bubble-wrap own-bubble-wrap">
                <div class="messenger-bubble">
                    <div class="messenger-user">${currentUserName}</div>
                    <img src="${gifUrl}" alt="GIF" class="chat-media-image">
                    <div class="messenger-time">${getTimeStamp()}</div>
                </div>
            </div>
        `);
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

        if (!response.ok) {
            throw new Error("Could not load GIFs.");
        }

        const data = await response.json();
        return data.data || [];
    }

    function renderGifResults(gridEl, gifs, boxEl, pickerWrap) {
        if (!gridEl) return;

        if (!gifs.length) {
            gridEl.innerHTML = `<p class="empty-text">No GIFs found.</p>`;
            return;
        }

        gridEl.innerHTML = gifs.map((gif) => {
            const preview =
                gif.images?.fixed_width_small?.url ||
                gif.images?.fixed_width?.url ||
                "";

            const sendUrl =
                gif.images?.downsized_medium?.url ||
                gif.images?.original?.url ||
                preview;

            return `
                <button type="button" class="gif-result-btn" data-url="${sendUrl}">
                    <img src="${preview}" alt="${gif.title || "GIF"}" class="gif-result-image">
                </button>
            `;
        }).join("");

        gridEl.querySelectorAll(".gif-result-btn").forEach((button) => {
            button.addEventListener("click", () => {
                sendGifMessage(boxEl, button.dataset.url);
                if (pickerWrap) pickerWrap.style.display = "none";
            });
        });
    }

    async function loadGifPanel(gridEl, query, boxEl, pickerWrap) {
        if (!gridEl) return;

        gridEl.innerHTML = `<p class="empty-text">Loading GIFs...</p>`;

        try {
            const gifs = await fetchGifs(query);
            renderGifResults(gridEl, gifs, boxEl, pickerWrap);
        } catch (error) {
            gridEl.innerHTML = `<p class="empty-text">${error.message}</p>`;
        }
    }

    function wireChatTools(config) {
        const {
            boxId,
            inputId,
            sendBtnId,
            imageInputId,
            emojiToggleBtnId,
            emojiPickerWrapId,
            emojiGridId,
            gifToggleBtnId,
            gifPickerWrapId,
            gifSearchInputId,
            gifSearchBtnId,
            gifResultsGridId,
            otherGifWrapIds = [],
            otherEmojiWrapIds = []
        } = config;

        const boxEl = document.getElementById(boxId);
        const inputEl = document.getElementById(inputId);
        const sendBtnEl = document.getElementById(sendBtnId);
        const imageInputEl = document.getElementById(imageInputId);

        const emojiToggleBtnEl = document.getElementById(emojiToggleBtnId);
        const emojiPickerWrapEl = document.getElementById(emojiPickerWrapId);
        const emojiGridEl = document.getElementById(emojiGridId);

        const gifToggleBtnEl = document.getElementById(gifToggleBtnId);
        const gifPickerWrapEl = document.getElementById(gifPickerWrapId);
        const gifSearchInputEl = document.getElementById(gifSearchInputId);
        const gifSearchBtnEl = document.getElementById(gifSearchBtnId);
        const gifResultsGridEl = document.getElementById(gifResultsGridId);

        const otherGifWraps = otherGifWrapIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        const otherEmojiWraps = otherEmojiWrapIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        buildEmojiPicker(emojiGridEl, inputEl);

        if (emojiToggleBtnEl) {
            emojiToggleBtnEl.addEventListener("click", () => {
                togglePanel(
                    emojiPickerWrapEl,
                    [gifPickerWrapEl, ...otherEmojiWraps, ...otherGifWraps]
                );
            });
        }

        if (gifToggleBtnEl) {
            gifToggleBtnEl.addEventListener("click", async () => {
                const opening =
                    gifPickerWrapEl.style.display === "none" ||
                    gifPickerWrapEl.style.display === "";

                togglePanel(
                    gifPickerWrapEl,
                    [emojiPickerWrapEl, ...otherEmojiWraps, ...otherGifWraps]
                );

                if (opening) {
                    await loadGifPanel(
                        gifResultsGridEl,
                        "",
                        boxEl,
                        gifPickerWrapEl
                    );
                }
            });
        }

        if (gifSearchBtnEl) {
            gifSearchBtnEl.addEventListener("click", async () => {
                await loadGifPanel(
                    gifResultsGridEl,
                    gifSearchInputEl.value,
                    boxEl,
                    gifPickerWrapEl
                );
            });
        }

        if (gifSearchInputEl) {
            gifSearchInputEl.addEventListener("keydown", async (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    await loadGifPanel(
                        gifResultsGridEl,
                        gifSearchInputEl.value,
                        boxEl,
                        gifPickerWrapEl
                    );
                }
            });
        }

        if (sendBtnEl) {
            sendBtnEl.addEventListener("click", () => {
                sendTextMessage(boxEl, inputEl);
            });
        }

        if (inputEl) {
            inputEl.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    sendTextMessage(boxEl, inputEl);
                }
            });
        }

        if (imageInputEl) {
            imageInputEl.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    sendImageMessage(boxEl, e.target.result);
                };
                reader.readAsDataURL(file);
                imageInputEl.value = "";
            });
        }
    }

    wireChatTools({
        boxId: "chatBox",
        inputId: "chatInput",
        sendBtnId: "sendChatBtn",
        imageInputId: "chatImageInput",
        emojiToggleBtnId: "chatEmojiToggleBtn",
        emojiPickerWrapId: "chatEmojiPickerWrap",
        emojiGridId: "chatEmojiGrid",
        gifToggleBtnId: "gifToggleBtn",
        gifPickerWrapId: "gifPickerWrap",
        gifSearchInputId: "gifSearchInput",
        gifSearchBtnId: "gifSearchBtn",
        gifResultsGridId: "gifResultsGrid",
        otherGifWrapIds: ["scheduleGifPickerWrap", "tradeGifPickerWrap"],
        otherEmojiWrapIds: ["scheduleEmojiPickerWrap", "tradeEmojiPickerWrap"]
    });

    wireChatTools({
        boxId: "scheduleBox",
        inputId: "scheduleInput",
        sendBtnId: "sendScheduleBtn",
        imageInputId: "scheduleImageInput",
        emojiToggleBtnId: "scheduleEmojiToggleBtn",
        emojiPickerWrapId: "scheduleEmojiPickerWrap",
        emojiGridId: "scheduleEmojiGrid",
        gifToggleBtnId: "scheduleGifToggleBtn",
        gifPickerWrapId: "scheduleGifPickerWrap",
        gifSearchInputId: "scheduleGifSearchInput",
        gifSearchBtnId: "scheduleGifSearchBtn",
        gifResultsGridId: "scheduleGifResultsGrid",
        otherGifWrapIds: ["gifPickerWrap", "tradeGifPickerWrap"],
        otherEmojiWrapIds: ["chatEmojiPickerWrap", "tradeEmojiPickerWrap"]
    });

    wireChatTools({
        boxId: "tradeBox",
        inputId: "tradeInput",
        sendBtnId: "sendTradeBtn",
        imageInputId: "tradeImageInput",
        emojiToggleBtnId: "tradeEmojiToggleBtn",
        emojiPickerWrapId: "tradeEmojiPickerWrap",
        emojiGridId: "tradeEmojiGrid",
        gifToggleBtnId: "tradeGifToggleBtn",
        gifPickerWrapId: "tradeGifPickerWrap",
        gifSearchInputId: "tradeGifSearchInput",
        gifSearchBtnId: "tradeGifSearchBtn",
        gifResultsGridId: "tradeGifResultsGrid",
        otherGifWrapIds: ["gifPickerWrap", "scheduleGifPickerWrap"],
        otherEmojiWrapIds: ["chatEmojiPickerWrap", "scheduleEmojiPickerWrap"]
    });
});