document.addEventListener("DOMContentLoaded", () => {
  const emojis = ["😀", "😂", "🤣", "🔥", "💯", "😎", "😭", "🙌", "✅", "👀", "🏈", "🎮", "🤝", "😤"];

  function setupEmoji(toggleBtn, pickerWrap, emojiGrid, input, otherEmojiWraps = []) {
    if (!toggleBtn || !pickerWrap || !emojiGrid || !input) return;

    emojiGrid.innerHTML = "";

    emojis.forEach((emoji) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = emoji;
      btn.className = "emoji-option";

      btn.addEventListener("click", () => {
        input.value += emoji;
        input.focus();
      });

      emojiGrid.appendChild(btn);
    });

    toggleBtn.addEventListener("click", () => {
      otherEmojiWraps.forEach((wrap) => {
        if (wrap) wrap.style.display = "none";
      });

      pickerWrap.style.display =
        pickerWrap.style.display === "block" ? "none" : "block";
    });
  }

  function setupGif(config) {
    const gifBtn = document.getElementById(config.gifToggleBtnId);
    const gifWrap = document.getElementById(config.gifPickerWrapId);
    const searchInput = document.getElementById(config.gifSearchInputId);
    const searchBtn = document.getElementById(config.gifSearchBtnId);
    const resultsGrid = document.getElementById(config.gifResultsGridId);
    const input = document.getElementById(config.inputId);

    if (!gifBtn || !gifWrap) return;

    gifBtn.addEventListener("click", () => {
      gifWrap.style.display =
        gifWrap.style.display === "block" ? "none" : "block";
    });

    if (!searchBtn || !searchInput || !resultsGrid || !input) return;

    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim();

      if (!query) {
        resultsGrid.innerHTML = "<p>Type something to search GIFs.</p>";
        return;
      }

      resultsGrid.innerHTML = "<p>Searching GIFs...</p>";

      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=YOUR_GIPHY_API_KEY&q=${encodeURIComponent(query)}&limit=12&rating=g`
        );

        const data = await response.json();

        resultsGrid.innerHTML = "";

        if (!data.data || data.data.length === 0) {
          resultsGrid.innerHTML = "<p>No GIFs found.</p>";
          return;
        }

        data.data.forEach((gif) => {
          const img = document.createElement("img");
          img.src = gif.images.fixed_height_small.url;
          img.alt = gif.title || "GIF";
          img.className = "gif-result";

          img.addEventListener("click", () => {
            input.value = gif.images.original.url;
            gifWrap.style.display = "none";
            input.focus();
          });

          resultsGrid.appendChild(img);
        });
      } catch (error) {
        resultsGrid.innerHTML = "<p>GIF search failed.</p>";
        console.error("GIF search error:", error);
      }
    });
  }

  function wireChatTools(config) {
    const input = document.getElementById(config.inputId);

    const emojiBtn = document.getElementById(config.emojiToggleBtnId);
    const emojiWrap = document.getElementById(config.emojiPickerWrapId);
    const emojiGrid = document.getElementById(config.emojiGridId);

    const otherEmojiWraps = (config.otherEmojiWrapIds || [])
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    setupEmoji(emojiBtn, emojiWrap, emojiGrid, input, otherEmojiWraps);
    setupGif(config);
  }

  wireChatTools({
    inputId: "chatInput",
    emojiToggleBtnId: "chatEmojiToggleBtn",
    emojiPickerWrapId: "chatEmojiPickerWrap",
    emojiGridId: "chatEmojiGrid",
    gifToggleBtnId: "gifToggleBtn",
    gifPickerWrapId: "gifPickerWrap",
    gifSearchInputId: "gifSearchInput",
    gifSearchBtnId: "gifSearchBtn",
    gifResultsGridId: "gifResultsGrid",
    otherEmojiWrapIds: ["scheduleEmojiPickerWrap", "tradeEmojiPickerWrap"],
  });

  wireChatTools({
    inputId: "scheduleInput",
    emojiToggleBtnId: "scheduleEmojiToggleBtn",
    emojiPickerWrapId: "scheduleEmojiPickerWrap",
    emojiGridId: "scheduleEmojiGrid",
    gifToggleBtnId: "scheduleGifToggleBtn",
    gifPickerWrapId: "scheduleGifPickerWrap",
    gifSearchInputId: "scheduleGifSearchInput",
    gifSearchBtnId: "scheduleGifSearchBtn",
    gifResultsGridId: "scheduleGifResultsGrid",
    otherEmojiWrapIds: ["chatEmojiPickerWrap", "tradeEmojiPickerWrap"],
  });

  wireChatTools({
    inputId: "tradeInput",
    emojiToggleBtnId: "tradeEmojiToggleBtn",
    emojiPickerWrapId: "tradeEmojiPickerWrap",
    emojiGridId: "tradeEmojiGrid",
    gifToggleBtnId: "tradeGifToggleBtn",
    gifPickerWrapId: "tradeGifPickerWrap",
    gifSearchInputId: "tradeGifSearchInput",
    gifSearchBtnId: "tradeGifSearchBtn",
    gifResultsGridId: "tradeGifResultsGrid",
    otherEmojiWrapIds: ["chatEmojiPickerWrap", "scheduleEmojiPickerWrap"],
  });
});