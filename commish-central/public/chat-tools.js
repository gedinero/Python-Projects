const emojiBtn = document.getElementById("emojiBtn");
const gifBtn = document.getElementById("gifBtn");
const emojiPicker = document.getElementById("emojiPicker");
const gifPicker = document.getElementById("gifPicker");
const messageInput = document.getElementById("messageInput");

const emojis = ["😀", "😂", "🔥", "💯", "😭", "😎", "👍", "👀", "🏈", "🎮", "🤣", "😤", "❤️", "👏", "🤝", "🥶"];

if (emojiPicker) {
  emojiPicker.innerHTML = emojis
    .map((emoji) => `<button type="button" class="emoji-option">${emoji}</button>`)
    .join("");
}

if (emojiBtn && emojiPicker && gifPicker) {
  emojiBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    emojiPicker.classList.toggle("hidden");
    gifPicker.classList.add("hidden");
  });
}

if (gifBtn && gifPicker && emojiPicker) {
  gifBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    gifPicker.classList.toggle("hidden");
    emojiPicker.classList.add("hidden");
  });
}

if (emojiPicker && messageInput) {
  emojiPicker.addEventListener("click", (event) => {
    if (event.target.classList.contains("emoji-option")) {
      messageInput.value += event.target.textContent;
      messageInput.focus();
    }
  });
}

document.addEventListener("click", (event) => {
  if (
    emojiPicker &&
    gifPicker &&
    !emojiPicker.contains(event.target) &&
    !gifPicker.contains(event.target) &&
    event.target !== emojiBtn &&
    event.target !== gifBtn
  ) {
    emojiPicker.classList.add("hidden");
    gifPicker.classList.add("hidden");
  }
});