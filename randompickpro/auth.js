const loginBtn = document.querySelector(".primary-btn");
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]');

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "" || password === "") {
            alert("Fill in all fields");
            return;
        }

        const storedUser = localStorage.getItem(username);

if (storedUser === null) {
    alert("User not found");
    return;
}

const parsedUser = JSON.parse(storedUser);

if (parsedUser.password === password) {
            localStorage.setItem("currentUser", username);
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Incorrect password");
        }
    });
}