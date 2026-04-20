const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");

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