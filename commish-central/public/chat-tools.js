// FILE: chat-tools.js
// Purpose: Emoji button only.
// Do NOT control the GIF button here.
// GIF logic stays wherever your working GIF script already is.

document.addEventListener("DOMContentLoaded", () => {
  const emojiBtn = document.getElementById("emojiBtn");
  const emojiPicker = document.getElementById("emojiPicker");
  const messageInput = document.getElementById("messageInput");

  if (!emojiBtn || !emojiPicker || !messageInput) {
    console.warn("Emoji tools missing: emojiBtn, emojiPicker, or messageInput not found.");
    return;
  }

  const emojis = [
    "😀", "😂", "🤣", "😭", "😎", "🔥", "💯", "👀",
    "👍", "👏", "🤝", "❤️", "🏈", "🎮", "😤", "🥶"
  ];

  emojiPicker.innerHTML = emojis
    .map((emoji) => {
      return `<button type="button" class="emoji-option">${emoji}</button>`;
    })
    .join("");

  emojiBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    emojiPicker.classList.toggle("hidden");
  });

  emojiPicker.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const emojiButton = event.target.closest(".emoji-option");

    if (!emojiButton) return;

    messageInput.value += emojiButton.textContent;
    messageInput.focus();
  });

  document.addEventListener("click", (event) => {
    if (
      event.target !== emojiBtn &&
      !emojiPicker.contains(event.target)
    ) {
      emojiPicker.classList.add("hidden");
    }
  });
});