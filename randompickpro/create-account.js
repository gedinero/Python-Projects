document.addEventListener("DOMContentLoaded", () => {
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const message = document.getElementById("accountMessage");
    const countrySelect = document.getElementById("country");
    const otherCountryInput = document.getElementById("otherCountry");
    const profilePictureInput = document.getElementById("profilePicture");
    const profilePreview = document.getElementById("profilePreview");

    const profileFormTitle = document.getElementById("profileFormTitle");
    const profilePageSubtitle = document.getElementById("profilePageSubtitle");
    const profileFooterText = document.getElementById("profileFooterText");
    const backButtonText = document.getElementById("backButtonText");
    const uploadButtonLabel = document.getElementById("uploadButtonLabel");

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const cityInput = document.getElementById("city");
    const stateInput = document.getElementById("state");
    const favoriteNFLSelect = document.getElementById("favoriteNFL");
    const favoriteCollegeSelect = document.getElementById("favoriteCollege");

    const currentUser = localStorage.getItem("currentUser");
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    let profilePictureData = "";
    let isEditMode = false;
    let originalUsername = "";

    function showMessage(text, color) {
        if (!message) return;
        message.textContent = text;
        message.style.color = color;
    }

    function setCountryFields(countryValue) {
        const builtInCountries = [
            "United States",
            "Canada",
            "Mexico",
            "United Kingdom",
            "Germany",
            "France",
            "Australia",
            "Japan"
        ];

        if (builtInCountries.includes(countryValue)) {
            countrySelect.value = countryValue;
            otherCountryInput.style.display = "none";
            otherCountryInput.value = "";
        } else if (countryValue) {
            countrySelect.value = "Other";
            otherCountryInput.style.display = "block";
            otherCountryInput.value = countryValue;
        }
    }

    function loadExistingProfile() {
        if (!currentUser) return;

        const storedUser = localStorage.getItem(currentUser);
        if (!storedUser) return;

        const userData = JSON.parse(storedUser);

        isEditMode = true;
        originalUsername = userData.username || currentUser;

        profileFormTitle.textContent = "Edit Profile";
        profilePageSubtitle.textContent = "Update your profile and keep your account fresh.";
        profileFooterText.textContent = "Done making changes?";
        backButtonText.textContent = "Back to Dashboard";
        backButtonText.href = "dashboard.html";
        saveProfileBtn.textContent = "Save Profile";
        uploadButtonLabel.textContent = "Change Profile Picture";

        usernameInput.value = userData.username || "";
        usernameInput.readOnly = true;
        usernameInput.style.opacity = "0.7";
        usernameInput.style.cursor = "not-allowed";

        passwordInput.value = userData.password || "";
        cityInput.value = userData.city || "";
        stateInput.value = userData.state || "";
        favoriteNFLSelect.value = userData.favoriteNFL || "";
        favoriteCollegeSelect.value = userData.favoriteCollege || "";

        setCountryFields(userData.country || "");

        if (userData.profilePicture) {
            profilePictureData = userData.profilePicture;
            profilePreview.src = profilePictureData;
            profilePreview.style.display = "block";
        }
    }

    if (countrySelect) {
        countrySelect.addEventListener("change", () => {
            if (countrySelect.value === "Other") {
                otherCountryInput.style.display = "block";
            } else {
                otherCountryInput.style.display = "none";
                otherCountryInput.value = "";
            }
        });
    }

    if (profilePictureInput) {
        profilePictureInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                profilePictureData = e.target.result;
                profilePreview.src = profilePictureData;
                profilePreview.style.display = "block";
            };

            reader.readAsDataURL(file);
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const city = cityInput.value.trim();
            const state = stateInput.value.trim();

            let country = countrySelect.value;
            if (country === "Other") {
                country = otherCountryInput.value.trim();
            }

            const favoriteNFL = favoriteNFLSelect.value;
            const favoriteCollege = favoriteCollegeSelect.value;

            if (!username || !password || !city || !state || !country || !favoriteNFL || !favoriteCollege) {
                showMessage("Please fill in all fields.", "#ff5c5c");
                return;
            }

            if (!isEditMode) {
                const exists = storedUsers.some(
                    (user) => user.username.toLowerCase() === username.toLowerCase()
                );

                if (exists) {
                    showMessage("Username already exists. Choose another.", "#ff5c5c");
                    return;
                }
            }

            const updatedUser = {
                username,
                password,
                city,
                state,
                country,
                favoriteNFL,
                favoriteCollege,
                profilePicture: profilePictureData
            };

            let users = JSON.parse(localStorage.getItem("users")) || [];

            if (isEditMode) {
                users = users.map((user) =>
                    user.username === originalUsername ? updatedUser : user
                );

                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem(originalUsername, JSON.stringify(updatedUser));
                localStorage.setItem("currentUser", originalUsername);

                showMessage("Profile updated successfully!", "#00ff9f");

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 700);
            } else {
                users.push(updatedUser);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem(username, JSON.stringify(updatedUser));
                localStorage.setItem("currentUser", username);

                showMessage("Account created successfully!", "#00ff9f");

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 700);
            }
        });
    }

    loadExistingProfile();
});