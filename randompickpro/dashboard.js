const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");
const profileCity = document.getElementById("profileCity");
const profileState = document.getElementById("profileState");
const profileNFL = document.getElementById("profileNFL");
const profileCollege = document.getElementById("profileCollege");

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "index.html";
} else {
    welcomeMessage.textContent = `Welcome back, ${currentUser}`;

    const storedUser = localStorage.getItem(currentUser);

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        profileCity.textContent = parsedUser.city || "-";
        profileState.textContent = parsedUser.state || "-";
        profileNFL.textContent = parsedUser.favoriteNFL || "-";
        profileCollege.textContent = parsedUser.favoriteCollege || "-";
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
}