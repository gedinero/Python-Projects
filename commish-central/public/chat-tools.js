// FILE: chat-tools.js
// Commish Central Chat Tools
// Handles League Chat emoji + GIF picker only

document.addEventListener("DOMContentLoaded", () => {
  console.log("chat-tools.js loaded fresh v3");

  const emojiBtn = document.getElementById("chatEmojiToggleBtn");
  const gifBtn = document.getElementById("gifToggleBtn");

  const emojiWrap = document.getElementById("chatEmojiPickerWrap");
  const emojiGrid = document.getElementById("chatEmojiGrid");

  const gifWrap = document.getElementById("gifPickerWrap");
  const gifSearchInput = document.getElementById("gifSearchInput");
  const gifSearchBtn = document.getElementById("gifSearchBtn");
  const gifResultsGrid = document.getElementById("gifResultsGrid");

  const chatInput = document.getElementById("chatInput");

  // Paste your GIPHY key between the quotes
  const GIPHY_API_KEY = "fAamOwF84swNA9O56F0l3hz1G7huYaA1";

  if (
    !emojiBtn ||
    !gifBtn ||
    !emojiWrap ||
    !emojiGrid ||
    !gifWrap ||
    !gifSearchInput ||
    !gifSearchBtn ||
    !gifResultsGrid ||
    !chatInput
  ) {
    console.error("chat-tools.js missing elements:", {
      emojiBtn,
      gifBtn,
      emojiWrap,
      emojiGrid,
      gifWrap,
      gifSearchInput,
      gifSearchBtn,
      gifResultsGrid,
      chatInput
    });
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

  function hideEmoji() {
    emojiWrap.style.display = "none";
  }

  function showEmoji() {
    emojiWrap.style.display = "block";
  }

  function hideGif() {
    gifWrap.style.display = "none";
  }

  function showGif() {
    gifWrap.style.display = "block";
  }

  function closeAll() {
    hideEmoji();
    hideGif();
  }

  emojiBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const emojiIsOpen = emojiWrap.style.display === "block";

    closeAll();

    if (!emojiIsOpen) {
      showEmoji();
    }
  });

  emojiGrid.addEventListener("click", (event) => {
    const emojiButton = event.target.closest(".emoji-option");
    if (!emojiButton) return;

    event.preventDefault();
    event.stopPropagation();

    chatInput.value += emojiButton.textContent;
    chatInput.focus();
  });

  gifBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const gifIsOpen = gifWrap.style.display === "block";

    closeAll();

    if (!gifIsOpen) {
      showGif();
      await loadTrendingGifs();
    }
  });

  gifSearchBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const searchTerm = gifSearchInput.value.trim();

    if (!searchTerm) return;

    await searchGifs(searchTerm);
  });

  gifSearchInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    event.stopPropagation();

    const searchTerm = gifSearchInput.value.trim();

    if (!searchTerm) return;

    await searchGifs(searchTerm);
  });

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
    gifResultsGrid.innerHTML = `<p class="gif-loading-text">Loading GIFs...</p>`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("GIPHY response:", data);

      if (!response.ok) {
        gifResultsGrid.innerHTML = `<p class="gif-loading-text">GIPHY error. Check your API key.</p>`;
        return;
      }

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

          chatInput.value += ` ${gifImage.dataset.gifUrl}`;
          chatInput.focus();

          hideGif();
        });
      });
    } catch (error) {
      console.error("GIF fetch error:", error);
      gifResultsGrid.innerHTML = `<p class="gif-loading-text">Could not load GIFs.</p>`;
    }
  }

  document.addEventListener("click", (event) => {
    const clickedEmoji =
      emojiWrap.contains(event.target) || event.target === emojiBtn;

    const clickedGif =
      gifWrap.contains(event.target) || event.target === gifBtn;

    if (!clickedEmoji && !clickedGif) {
      closeAll();
    }
  });
});