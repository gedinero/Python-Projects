document.addEventListener("DOMContentLoaded", () => {
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const message = document.getElementById("profileMessage");

  const usernameInput = document.getElementById("username");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const countrySelect = document.getElementById("country");
  const otherCountryInput = document.getElementById("otherCountry");
  const favoriteNFLSelect = document.getElementById("favoriteNFL");
  const favoriteCollegeSelect = document.getElementById("favoriteCollege");

  const profilePictureInput = document.getElementById("profilePicture");
  const profilePreview = document.getElementById("profilePreview");
  const zoomRange = document.getElementById("zoomRange");
  const cropControls = document.getElementById("cropControls");

  const savedUser = localStorage.getItem("currentUser");

  if (!savedUser) {
    window.location.href = "index.html";
    return;
  }

  let currentUser = JSON.parse(savedUser);
  let profilePictureData = currentUser.profilePicture || "";
  let originalImage = null;

  function showMessage(text, color) {
    if (!message) return;
    message.textContent = text;
    message.style.color = color;
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

    ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, size, size);

    return canvas.toDataURL("image/jpeg", 0.92);
  }

  function updatePreviewFromZoom() {
    if (!originalImage || !zoomRange || !profilePreview) return;

    const zoom = parseFloat(zoomRange.value || "1");
    profilePictureData = cropImageToSquare(originalImage, zoom);

    profilePreview.src = profilePictureData;
    profilePreview.style.display = "block";
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

  if (usernameInput) usernameInput.value = currentUser.username || "";
  if (cityInput) cityInput.value = currentUser.city || "";
  if (stateInput) stateInput.value = currentUser.state || "";
  if (favoriteNFLSelect) favoriteNFLSelect.value = currentUser.favoriteNFL || "";
  if (favoriteCollegeSelect) favoriteCollegeSelect.value = currentUser.favoriteCollege || "";

  setCountryFields(currentUser.country || "");

  if (profilePreview) {
    if (profilePictureData) {
      profilePreview.src = profilePictureData;
      profilePreview.style.display = "block";
    } else {
      profilePreview.style.display = "none";
    }
  }

  if (countrySelect && otherCountryInput) {
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
    profilePictureInput.addEventListener("change", () => {
      const file = profilePictureInput.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          originalImage = img;

          if (cropControls) cropControls.style.display = "block";
          if (zoomRange) zoomRange.value = "1";

          updatePreviewFromZoom();
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  if (zoomRange) {
    zoomRange.addEventListener("input", updatePreviewFromZoom);
  }

  saveProfileBtn?.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();

    let country = countrySelect.value;

    if (country === "Other") {
      country = otherCountryInput.value.trim();
    }

    const favoriteNFL = favoriteNFLSelect.value;
    const favoriteCollege = favoriteCollegeSelect.value;

    if (!username || !city || !state || !country) {
      showMessage("Please fill in all required fields.", "#ff5c5c");
      return;
    }

    const updatedUser = {
      ...currentUser,
      username,
      city,
      state,
      country,
      favoriteNFL,
      favoriteCollege,
      profilePicture: profilePictureData
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    showMessage("Profile updated successfully.", "#00ff9f");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
});