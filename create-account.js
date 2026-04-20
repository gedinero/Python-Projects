const createAccountBtn = document.getElementById("createAccountBtn");

if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
        const username = document.getElementById("newUsername").value.trim();
        const password = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value;
        const favoriteNFL = document.getElementById("favoriteNFL").value;
        const favoriteCollege = document.getElementById("favoriteCollege").value;

        if (
            username === "" ||
            password === "" ||
            confirmPassword === "" ||
            city === "" ||
            state === "" ||
            favoriteNFL === "" ||
            favoriteCollege === ""
        ) {
            alert("Fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const existingUser = localStorage.getItem(username);

        if (existingUser) {
            alert("Account already exists. Try logging in.");
            return;
        }

        const userData = {
            password: password,
            city: city,
            state: state,
            favoriteNFL: favoriteNFL,
            favoriteCollege: favoriteCollege
        };

        localStorage.setItem(username, JSON.stringify(userData));
        localStorage.setItem("currentUser", username);

        alert("Account created successfully!");
        window.location.href = "dashboard.html";
    });
}