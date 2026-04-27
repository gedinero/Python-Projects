// FILE: chat-tools.js
// Handles emojis + GIFs for Commish Central league chat

document.addEventListener("DOMContentLoaded", () => {
  const emojiBtn = document.getElementById("chatEmojiToggleBtn");
  const gifBtn = document.getElementById("gifToggleBtn");

  const emojiPicker = document.getElementById("chatEmojiPickerWrap");
  const emojiGrid = document.getElementById("chatEmojiGrid");

  const gifPicker = document.getElementById("gifPickerWrap");
  const gifSearchInput = document.getElementById("gifSearchInput");
  const gifSearchBtn = document.getElementById("gifSearchBtn");
  const gifResultsGrid = document.getElementById("gifResultsGrid");

  const messageInput = document.getElementById("chatInput");

  const GIPHY_API_KEY = "PASTE_YOUR_GIPHY_KEY_HERE";

  if (
    !emojiBtn ||
    !gifBtn ||
    !emojiPicker ||
    !emojiGrid ||
    !gifPicker ||
    !gifSearchInput ||
    !gifSearchBtn ||
    !gifResultsGrid ||
    !messageInput
  ) {
    console.warn("chat-tools.js: One or more chat elements were not found.");
    return;
  }

  const emojis = [
    "😀", "😃", "😄", "😁", "😂", "🤣", "😭", "😅",
    "😊", "😎", "🥶", "😤", "😮‍💨", "😈", "👀", "🙌",
    "👏", "👍", "👎", "🤝", "🙏", "💪", "🔥", "💯",
    "❤️", "🖤", "💚", "💙", "💜", "💛", "🧡", "🤍",
    "💍", "💎", "👑", "🏆", "⚡", "🌟", "✨", "💫",
    "🚀", "🏈", "🎮", "🎯", "📈", "💰", "🧠", "🗣️",
    "😬", "😡", "🤦🏾‍♂️", "🤷🏾‍♂️", "🙋🏾‍♂️", "👊🏾",
    "✊🏾", "👨🏾‍💻", "🕹️", "🏟️", "📣", "🧢", "🥳"
  ];

  emojiGrid.innerHTML = emojis
    .map((emoji) => `<button type="button" class="emoji-option">${emoji}</button>`)
    .join("");

  function closeAllPickers() {
    emojiPicker.style.display = "none";
    gifPicker.style.display = "none";
  }

  emojiBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = emojiPicker.style.display === "block";
    closeAllPickers();

    if (!isOpen) {
      emojiPicker.style.display = "block";
    }
  });

  emojiGrid.addEventListener("click", (event) => {
    const emojiButton = event.target.closest(".emoji-option");
    if (!emojiButton) return;

    event.preventDefault();
    event.stopPropagation();

    messageInput.value += emojiButton.textContent;
    messageInput.focus();
  });

  gifBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = gifPicker.style.display === "block";
    closeAllPickers();

    if (!isOpen) {
      gifPicker.style.display = "block";
      await loadTrendingGifs();
    }
  });

  gifSearchBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const searchTerm = gifSearchInput.value.trim();

    if (searchTerm) {
      await searchGifs(searchTerm);
    }
  });

  gifSearchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      const searchTerm = gifSearchInput.value.trim();

      if (searchTerm) {
        await searchGifs(searchTerm);
      }
    }
  });

  async function loadTrendingGifs() {
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=12&rating=pg-13`;
    await fetchAndRenderGifs(url);
  }

  async function searchGifs(searchTerm) {
    const encodedSearch = encodeURIComponent(searchTerm);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodedSearch}&limit=12&rating=pg-13`;
    await fetchAndRenderGifs(url);
  }

  async function fetchAndRenderGifs(url) {
    gifResultsGrid.innerHTML = `<p class="gif-loading-text">Loading GIFs...</p>`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        gifResultsGrid.innerHTML = `<p class="gif-loading-text">No GIFs found.</p>`;
        return;
      }

      gifResultsGrid.innerHTML = data.data
        .map((gif) => {
          const gifUrl = gif.images.fixed_height.url;
          const gifTitle = gif.title || "GIF";

          return `
            <img 
              src="${gifUrl}" 
              alt="${gifTitle}" 
              class="gif-result-img" 
              data-gif-url="${gifUrl}"
            >
          `;
        })
        .join("");

      gifResultsGrid.querySelectorAll(".gif-result-img").forEach((gifImage) => {
        gifImage.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          messageInput.value += ` ${gifImage.dataset.gifUrl}`;
          messageInput.focus();

          gifPicker.style.display = "none";
        });
      });
    } catch (error) {
      console.error("GIF fetch error:", error);
      gifResultsGrid.innerHTML = `<p class="gif-loading-text">Could not load GIFs.</p>`;
    }
  }

  document.addEventListener("click", (event) => {
    const clickedEmojiArea =
      emojiPicker.contains(event.target) || event.target === emojiBtn;

    const clickedGifArea =
      gifPicker.contains(event.target) || event.target === gifBtn;

    if (!clickedEmojiArea && !clickedGifArea) {
      closeAllPickers();
    }
  });
});