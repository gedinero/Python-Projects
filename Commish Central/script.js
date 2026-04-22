const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "commishcentral.firebaseapp.com",
  projectId: "commishcentral",
  storageBucket: "commishcentral.firebasestorage.app",
  messagingSenderId: "1004557081539",
  appId: "1:1004557081539:web:ec1b4db908294ed18ffb76"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function createLeague() {
  const name = document.getElementById("leagueName").value.trim();

  if (!name) {
    alert("Enter a league name first.");
    return;
  }

  db.collection("drafts").add({
    name: name,
    currentPick: 1,
    status: "waiting"
  })
  .then(() => {
    alert("League Created 🔥");
    document.getElementById("leagueName").value = "";
    loadLeagues();
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Something went wrong. Check console.");
  });
}

function loadLeagues() {
  const list = document.getElementById("leagueList");
  list.innerHTML = "";

  db.collection("drafts").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();

      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.marginTop = "10px";
      card.style.width = "300px";

      const title = document.createElement("h3");
      title.textContent = data.name;

      const info = document.createElement("p");
      info.textContent = `Picks: ${data.currentPick} | Status: ${data.status}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = function () {
        deleteLeague(doc.id);
      };

      card.appendChild(title);
      card.appendChild(info);
      card.appendChild(deleteBtn);

      list.appendChild(card);
    });
  });
}

function deleteLeague(id) {
  db.collection("drafts").doc(id).delete()
    .then(() => {
      alert("League deleted");
      loadLeagues();
    })
    .catch((error) => {
      console.error("Error deleting league:", error);
    });
}