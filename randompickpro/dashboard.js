const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "index.html";
} else {
    welcomeMessage.textContent = `Welcome back, ${currentUser}`;
}

logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});