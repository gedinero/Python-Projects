document.addEventListener("DOMContentLoaded", () => {
    const createAccountBtn = document.getElementById("createAccountBtn");
    const message = document.getElementById("accountMessage");
    const countrySelect = document.getElementById("country");
    const otherCountryInput = document.getElementById("otherCountry");
    const profilePictureInput = document.getElementById("profilePicture");
    const profilePreview = document.getElementById("profilePreview");

    let profilePictureData = "";

    function showMessage(text, color) {
        if (!message) return;
        message.textContent = text;
        message.style.color = color;
    }

    function setCountryVisibility() {
        if (!countrySelect || !otherCountryInput) return;

        if (countrySelect.value === "Other") {
            otherCountryInput.style.display = "block";
        } else {
            otherCountryInput.style.display = "none";
            otherCountryInput.value = "";
        }
    }

    if (countrySelect) {
        countrySelect.addEventListener("change", setCountryVisibility);
        setCountryVisibility();
    }

    if (profilePictureInput) {
        profilePictureInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                profilePictureData = e.target.result || "";
                if (profilePreview) {
                    profilePreview.src = profilePictureData;
                }
            };

            reader.readAsDataURL(file);
        });
    }

    if (createAccountBtn) {
        createAccountBtn.addEventListener("click", () => {
            const username = document.getElementById("username")?.value.trim() || "";
            const password = document.getElementById("password")?.value.trim() || "";
            const city = document.getElementById("city")?.value.trim() || "";
            const state = document.getElementById("state")?.value.trim() || "";

            let country = countrySelect?.value || "";
            if (country === "Other") {
                country = otherCountryInput?.value.trim() || "";
            }

            const favoriteNFL = document.getElementById("favoriteNFL")?.value || "";
            const favoriteCollege = document.getElementById("favoriteCollege")?.value || "";

            if (!username || !password || !city || !state || !country || !favoriteNFL || !favoriteCollege) {
                showMessage("Please fill in all fields.", "#ff5c5c");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];

            const exists = users.some(
                (user) => (user.username || "").toLowerCase() === username.toLowerCase()
            );

            if (exists) {
                showMessage("Username already exists. Choose another.", "#ff5c5c");
                return;
            }

            const newUser = {
                username,
                password,
                city,
                state,
                country,
                favoriteNFL,
                favoriteCollege,
                profilePicture: profilePictureData
            };

            users.push(newUser);

            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem(username, JSON.stringify(newUser));
            localStorage.setItem("currentUser", username);
            localStorage.setItem("profileImage", profilePictureData || "");
            localStorage.setItem("currentUserProfileImage", profilePictureData || "");

            showMessage("Account created successfully!", "#00ff9f");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);
        });
    }
});