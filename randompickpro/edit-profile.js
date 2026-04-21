document.addEventListener("DOMContentLoaded", () => {
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const message = document.getElementById("profileMessage");

    const countrySelect = document.getElementById("country");
    const otherCountryInput = document.getElementById("otherCountry");

    const profilePictureInput = document.getElementById("profilePicture");
    const profilePreview = document.getElementById("profilePreview");
    const zoomRange = document.getElementById("zoomRange");
    const cropControls = document.getElementById("cropControls");

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const cityInput = document.getElementById("city");
    const stateInput = document.getElementById("state");
    const favoriteNFLSelect = document.getElementById("favoriteNFL");
    const favoriteCollegeSelect = document.getElementById("favoriteCollege");

    const currentUser = localStorage.getItem("currentUser");

    let profilePictureData = "";
    let originalImage = null;

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

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

        if (!countrySelect || !otherCountryInput) return;

        if (builtInCountries.includes(countryValue)) {
            countrySelect.value = countryValue;
            otherCountryInput.style.display = "none";
            otherCountryInput.value = "";
        } else if (countryValue) {
            countrySelect.value = "Other";
            otherCountryInput.style.display = "block";
            otherCountryInput.value = countryValue;
        } else {
            countrySelect.value = "";
            otherCountryInput.style.display = "none";
            otherCountryInput.value = "";
        }
    }

    function cropImageToSquare(img, zoom = 1) {
        const canvas = document.createElement("canvas");
        const size = 400;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        const minSide = Math.min(img.width, img.height);
        const cropSize = minSide / zoom;
        const sx = (img.width - cropSize) / 2;
        const sy = (img.height - cropSize) / 2;

        ctx.drawImage(
            img,
            sx,
            sy,
            cropSize,
            cropSize,
            0,
            0,
            size,
            size
        );

        return canvas.toDataURL("image/jpeg", 0.92);
    }

    function updatePreviewFromZoom() {
        if (!originalImage || !zoomRange) return;

        const zoom = parseFloat(zoomRange.value || "1");
        profilePictureData = cropImageToSquare(originalImage, zoom);

        if (profilePreview) {
            profilePreview.src = profilePictureData;
        }
    }

    function loadProfile() {
        const storedUser = localStorage.getItem(currentUser);

        if (!storedUser) {
            if (usernameInput) usernameInput.value = currentUser;
            return;
        }

        const userData = JSON.parse(storedUser);

        if (usernameInput) usernameInput.value = userData.username || currentUser;
        if (passwordInput) passwordInput.value = userData.password || "";
        if (cityInput) cityInput.value = userData.city || "";
        if (stateInput) stateInput.value = userData.state || "";
        if (favoriteNFLSelect) favoriteNFLSelect.value = userData.favoriteNFL || "";
        if (favoriteCollegeSelect) favoriteCollegeSelect.value = userData.favoriteCollege || "";

        setCountryFields(userData.country || "");

        if (userData.profilePicture) {
            profilePictureData = userData.profilePicture;
            if (profilePreview) {
                profilePreview.src = profilePictureData;
            }
        } else if (profilePreview) {
            profilePreview.src = "";
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
                const img = new Image();

                img.onload = function () {
                    originalImage = img;

                    if (cropControls) {
                        cropControls.style.display = "block";
                    }

                    if (zoomRange) {
                        zoomRange.value = "1";
                    }

                    updatePreviewFromZoom();
                };

                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        });
    }

    if (zoomRange) {
        zoomRange.addEventListener("input", () => {
            updatePreviewFromZoom();
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const username = usernameInput?.value.trim() || currentUser;
            const password = passwordInput?.value.trim() || "";
            const city = cityInput?.value.trim() || "";
            const state = stateInput?.value.trim() || "";

            let country = countrySelect?.value || "";
            if (country === "Other") {
                country = otherCountryInput?.value.trim() || "";
            }

            const favoriteNFL = favoriteNFLSelect?.value || "";
            const favoriteCollege = favoriteCollegeSelect?.value || "";

            if (!username || !password || !city || !state || !country || !favoriteNFL || !favoriteCollege) {
                showMessage("Please fill in all fields.", "#ff5c5c");
                return;
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

            const duplicateUsername = users.some(
                (user) =>
                    user.username.toLowerCase() === username.toLowerCase() &&
                    user.username !== currentUser
            );

            if (duplicateUsername) {
                showMessage("Username already exists. Choose another.", "#ff5c5c");
                return;
            }

            users = users.map((user) =>
                user.username === currentUser ? updatedUser : user
            );

            if (username !== currentUser) {
                localStorage.removeItem(currentUser);
            }

            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem(username, JSON.stringify(updatedUser));
            localStorage.setItem("currentUser", username);
            localStorage.setItem("profileImage", profilePictureData || "");
            localStorage.setItem("currentUserProfileImage", profilePictureData || "");

            showMessage("Profile updated successfully.", "#00ff9f");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);
        });
    }

    loadProfile();
});