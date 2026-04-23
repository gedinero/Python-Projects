document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll("#logoutBtn, .logoutBtn, .logout-link");

    logoutButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.removeItem("currentUser");
            localStorage.removeItem("selectedLeagueId");

            window.location.href = "index.html";
        });
    });
});