document.addEventListener("DOMContentLoaded", () => {
    const typingIndicator = document.getElementById("typingIndicator");

    const inputIds = [
        "chatInput",
        "scheduleInput",
        "tradeInput"
    ];

    let typingTimeout;

    function showTypingIndicator() {
        if (!typingIndicator) return;

        typingIndicator.classList.remove("hidden");

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingIndicator.classList.add("hidden");
        }, 1200);
    }

    inputIds.forEach((id) => {
        const input = document.getElementById(id);

        if (input) {
            input.addEventListener("input", showTypingIndicator);
        }
    });
});