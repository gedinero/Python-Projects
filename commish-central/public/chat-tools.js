// FILE: chat-tools.js
// Handles BOTH emojis and GIFs for Commish Central

document.addEventListener("DOMContentLoaded", () => {
  const emojiBtn = document.getElementById("emojiBtn");
  const gifBtn = document.getElementById("gifBtn");
  const emojiPicker = document.getElementById("emojiPicker");
  const gifPicker = document.getElementById("gifPicker");
  const messageInput = document.getElementById("messageInput");

  // Paste your GIPHY API key between the quotes below
  const GIPHY_API_KEY = "fAamOwF84swNA9O56F0l3hz1G7huYaA1";

  if (!emojiBtn || !gifBtn || !emojiPicker || !gifPicker || !messageInput) {
    console.warn("chat-tools.js: Missing emojiBtn, gifBtn, emojiPicker, gifPicker, or messageInput.");
    return;
  }

  const emojis = [
    "😀", "😃", "😄", "😁", "😂", "🤣", "😭", "😅",
    "😊", "😎", "🥶", "😤", "😮‍💨", "😈", "👀", "🙌",
    "👏", "👍", "👎", "🤝", "🙏", "💪", "🔥", "💯",
    "❤️", "🖤", "💚", "💙", "💜", "💛", "🧡", "🤍",
    "💍", "👑", "🏆", "⚡", "🌟", "✨", "💫", "🚀",
    "🏈", "🎮", "🎯", "📈", "💰", "🧠", "🗣️", "😬",
    "😡", "🤦🏾‍♂️", "🤷🏾‍♂️", "🙋🏾‍♂️", "👊🏾", "✊🏾",
    "👨🏾‍💻", "🕹️", "🏟️", "📣", "🧢", "🥳"
  ];

  function closeAllPickers() {
    emojiPicker.classList.add("hidden");
    gifPicker.classList.add("hidden");
  }

  // Build emoji picker
  emojiPicker.innerHTML = emojis
    .map((emoji) => {
      return `<button type="button" class="emoji-option">${emoji}</button>`;
    })
    .join("");

  // Emoji button
  emojiBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const emojiWasHidden = emojiPicker.classList.contains("hidden");
    closeAllPickers();

    if (emojiWasHidden) {
      emojiPicker.classList.remove("hidden");
    }
  });

  // Add emoji to message input
  emojiPicker.addEventListener("click", (event) => {
    const emojiButton = event.target.closest(".emoji-option");

    if (!emojiButton) return;

    event.preventDefault();
    event.stopPropagation();

    messageInput.value += emojiButton.textContent;
    messageInput.focus();
  });

  // GIF button
  gifBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const gifWasHidden = gifPicker.classList.contains("hidden");
    closeAllPickers();

    if (gifWasHidden) {
      gifPicker.classList.remove("hidden");
      buildGifPicker();
      await loadTrendingGifs();
    }
  });

  function buildGifPicker() {
    gifPicker.innerHTML = `
      <div class="gif-search-box">
        <input 
          type="text" 
          id="gifSearchInput" 
          placeholder="Search GIFs..." 
          autocomplete="off"
        >
        <button type="button" id="gifSearchBtn">Search</button>
      </div>

      <div id="gifResults" class="gif-results">
        <p class="gif-loading-text">Loading GIFs...</p>
      </div>
    `;

    const gifSearchInput = document.getElementById("gifSearchInput");
    const gifSearchBtn = document.getElementById("gifSearchBtn");

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
  }

  async function loadTrendingGifs() {
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${fAamOwF84swNA9O56F0l3hz1G7huYaA1}&limit=12&rating=pg-13`;

    await fetchAndRenderGifs(url);
  }

  async function searchGifs(searchTerm) {
    const encodedSearch = encodeURIComponent(searchTerm);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${fAamOwF84swNA9O56F0l3hz1G7huYaA1}&q=${encodedSearch}&limit=12&rating=pg-13`;

    await fetchAndRenderGifs(url);
  }

  async function fetchAndRenderGifs(url) {
    const gifResults = document.getElementById("gifResults");

    if (!gifResults) return;

    gifResults.innerHTML = `<p class="gif-loading-text">Loading GIFs...</p>`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        gifResults.innerHTML = `<p class="gif-loading-text">No GIFs found.</p>`;
        return;
      }

      gifResults.innerHTML = data.data
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

      const gifImages = gifResults.querySelectorAll(".gif-result-img");

      gifImages.forEach((gifImage) => {
        gifImage.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const selectedGifUrl = gifImage.dataset.gifUrl;

          messageInput.value += ` ${selectedGifUrl}`;
          messageInput.focus();

          gifPicker.classList.add("hidden");
        });
      });
    } catch (error) {
      console.error("GIF fetch error:", error);
      gifResults.innerHTML = `<p class="gif-loading-text">Could not load GIFs.</p>`;
    }
  }

  // Close pickers when clicking away
  document.addEventListener("click", (event) => {
    const clickedEmojiArea = emojiPicker.contains(event.target) || event.target === emojiBtn;
    const clickedGifArea = gifPicker.contains(event.target) || event.target === gifBtn;

    if (!clickedEmojiArea && !clickedGifArea) {
      closeAllPickers();
    }
  });
});