const loginBtn = document.querySelector(".primary-btn");
const createBtn = document.querySelector(".secondary-btn");

const inputs = document.querySelectorAll("input");
const usernameInput = inputs[0];
const passwordInput = inputs[1];

// CREATE ACCOUNT
createBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === "" || password === "") {
        alert("Fill in all fields");
        return;
    }

    localStorage.setItem(username, password);

    alert("Account created! You can now login.");

    usernameInput.value = "";
    passwordInput.value = "";
});

// LOGIN
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const storedPassword = localStorage.getItem(username);

    if (storedPassword === null) {
        alert("User not found");
        return;
    }

    if (storedPassword === password) {
    localStorage.setItem("currentUser", username);
    alert("Login successful!");
    window.location.href = "dashboard.html";
} else {
        alert("Incorrect password");
    }
});