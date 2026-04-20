const createAccountBtn = document.getElementById("createAccountBtn");

const stateSelect = document.getElementById("state");
const nflSelect = document.getElementById("favoriteNFL");
const collegeSelect = document.getElementById("favoriteCollege");

const states = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
    "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
    "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
    "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
    "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const nflTeams = [
    "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills",
    "Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns",
    "Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers",
    "Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs",
    "Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins",
    "Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants",
    "New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers",
    "Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"
];

const collegeTeams = [
    "Air Force","Akron","Alabama","App State","Arizona","Arizona State","Arkansas","Arkansas State",
    "Army","Auburn","Ball State","Baylor","Boise State","Boston College","Bowling Green","Buffalo",
    "BYU","California","UCF","Charlotte","Cincinnati","Clemson","Coastal Carolina","Colorado",
    "Colorado State","Duke","East Carolina","Eastern Michigan","Florida","Florida Atlantic",
    "Florida International","Florida State","Fresno State","Georgia","Georgia Southern","Georgia State",
    "Georgia Tech","Houston","Illinois","Indiana","Iowa","Iowa State","James Madison","Kansas",
    "Kansas State","Kennesaw State","Kent State","Kentucky","Liberty","Louisiana","Louisiana Tech",
    "Louisville","LSU","Marshall","Maryland","Memphis","Miami","Miami (OH)","Michigan",
    "Michigan State","Middle Tennessee","Minnesota","Mississippi State","Missouri","Navy","NC State",
    "Nebraska","Nevada","New Mexico","New Mexico State","North Carolina","North Texas",
    "Northern Illinois","Northwestern","Notre Dame","Ohio","Ohio State","Oklahoma","Oklahoma State",
    "Old Dominion","Ole Miss","Oregon","Oregon State","Penn State","Pitt","Purdue","Rice",
    "Rutgers","Sam Houston","San Diego State","San Jose State","SMU","South Alabama","South Carolina",
    "South Florida","Southern Miss","Stanford","Syracuse","TCU","Temple","Tennessee","Texas",
    "Texas A&M","Texas State","Texas Tech","Toledo","Troy","Tulane","Tulsa","UAB","UCLA",
    "UL Monroe","UNLV","USC","UTEP","UTSA","Utah","Utah State","Vanderbilt","Virginia",
    "Virginia Tech","Wake Forest","Washington","Washington State","West Virginia","Western Kentucky",
    "Western Michigan","Wisconsin","Wyoming"
];

function populateSelect(selectElement, items, firstLabel) {
    selectElement.innerHTML = `<option value="">${firstLabel}</option>`;
    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

populateSelect(stateSelect, states, "Select State");
populateSelect(nflSelect, nflTeams, "Select NFL Team");
populateSelect(collegeSelect, collegeTeams, "Select College Team");

if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
        const username = document.getElementById("newUsername").value.trim();
        const password = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const city = document.getElementById("city").value.trim();
        const country = document.getElementById("country").value;
        const state = document.getElementById("state").value;
        const favoriteNFL = document.getElementById("favoriteNFL").value;
        const favoriteCollege = document.getElementById("favoriteCollege").value;

        if (
            username === "" ||
            password === "" ||
            confirmPassword === "" ||
            city === "" ||
            country === "" ||
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
            country: country,
            favoriteNFL: favoriteNFL,
            favoriteCollege: favoriteCollege
        };

        localStorage.setItem(username, JSON.stringify(userData));
        localStorage.setItem("currentUser", username);

        alert("Account created successfully!");
        window.location.href = "dashboard.html";
    });
}