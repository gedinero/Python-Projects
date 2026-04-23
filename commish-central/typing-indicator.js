document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(user => user.username === currentUser);
    const profilePic = currentUserData && currentUserData.profilePicture
        ? currentUserData.profilePicture
        : "";

    const configs = [
        { inputId: "chatInput", indicatorId: "chatTypingIndicator" },
        { inputId: "scheduleInput", indicatorId: "scheduleTypingIndicator" },
        { inputId: "tradeInput", indicatorId: "tradeTypingIndicator" }
    ];

    configs.forEach(({ inputId, indicatorId }) => {
        const input = document.getElementById(inputId);
        const indicator = document.getElementById(indicatorId);

        if (!input || !indicator) return;

        const avatar = indicator.querySelector(".typing-avatar");
        if (avatar && profilePic) {
            avatar.src = profilePic;
            avatar.style.display = "block";
        }

        let typingTimeout;

        input.addEventListener("input", () => {
            if (input.value.trim() === "") {
                indicator.classList.add("hidden");
                return;
            }

            indicator.classList.remove("hidden");

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                indicator.classList.add("hidden");
            }, 1200);
        });
    });
});