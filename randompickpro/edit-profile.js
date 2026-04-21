document.addEventListener("DOMContentLoaded", () => {
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const message = document.getElementById("profileMessage");
    const countrySelect = document.getElementById("country");
    const otherCountryInput = document.getElementById("otherCountry");
    const profilePictureInput = document.getElementById("profilePicture");
    const profilePreview = document.getElementById("profilePreview");

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const cityInput = document.getElementById("city");
    const stateInput = document.getElementById("state");
    const favoriteNFLSelect = document.getElementById("favoriteNFL");
    const favoriteCollegeSelect = document.getElementById("favoriteCollege");

    const currentUser = localStorage.getItem("currentUser");

    let profilePictureData = "";

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    function showMessage(text, color) {
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

    function loadProfile() {
        const storedUser = localStorage.getItem(currentUser);
        if (!storedUser) return;

        const userData = JSON.parse(storedUser);

        usernameInput.value = userData.username || "";
        passwordInput.value = userData.password || "";
        cityInput.value = userData.city || "";
        stateInput.value = userData.state || "";
        favoriteNFLSelect.value = userData.favoriteNFL || "";
        favoriteCollegeSelect.value = userData.favoriteCollege || "";

        setCountryFields(userData.country || "");

        if (userData.profilePicture) {
            profilePictureData = userData.profilePicture;
            profilePreview.src = profilePictureData;
        } else {
            profilePreview.src = "";
        }
    }

    countrySelect.addEventListener("change", () => {
        if (countrySelect.value === "Other") {
            otherCountryInput.style.display = "block";
        } else {
            otherCountryInput.style.display = "none";
            otherCountryInput.value = "";
        }
    });

    profilePictureInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            profilePictureData = e.target.result;
            profilePreview.src = profilePictureData;
        };

        reader.readAsDataURL(file);
    });

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
        users = users.map((user) =>
            user.username === currentUser ? updatedUser : user
        );

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem(currentUser, JSON.stringify(updatedUser));

        showMessage("Profile updated successfully!", "#00ff9f");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    });

    loadProfile();
});