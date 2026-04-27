// FILE: chat-tools.js
// Emoji picker only. GIF button is controlled by your existing GIF code.

document.addEventListener("DOMContentLoaded", () => {
  const emojiBtn = document.getElementById("emojiBtn");
  const emojiPicker = document.getElementById("emojiPicker");
  const messageInput = document.getElementById("messageInput");

  if (!emojiBtn || !emojiPicker || !messageInput) {
    return;
  }

  const emojis = [
    "😀", "😂", "🤣", "😭", "😎", "🔥", "💯", "👀",
    "👍", "👏", "🤝", "❤️", "🏈", "🎮", "😤", "🥶"
  ];

  emojiPicker.innerHTML = emojis
    .map((emoji) => `<button type="button" class="emoji-option">${emoji}</button>`)
    .join("");

  emojiBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    emojiPicker.classList.toggle("hidden");
  });

  emojiPicker.addEventListener("click", (event) => {
    const emojiButton = event.target.closest(".emoji-option");
    if (!emojiButton) return;

    event.preventDefault();
    event.stopPropagation();

    messageInput.value += emojiButton.textContent;
    messageInput.focus();
  });

  document.addEventListener("click", (event) => {
    if (!emojiPicker.contains(event.target) && event.target !== emojiBtn) {
      emojiPicker.classList.add("hidden");
    }
  });
});