const DAYS_SHOWN = 70;

const API = {
  getActivity: "/api/health/activity",
  getFavorites: "/api/workouts/favorites",
  getRecent: "/api/workouts/recent",
  markFavorite: (id) => `/api/workouts/${id}/favorite`,
  getRandomWorkout: "/api/exercises/random",
};

// Load everything when entering Dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadActivityGrid();
  loadFavoriteWorkouts();
  loadRecentWorkouts();
  setupButtons();
});

// Trainingtracker - Almost same as Githubs
async function loadActivityGrid() {
  try {
    const res = await fetch(API.getActivity);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    const activityGrid = document.getElementById("activity-grid");
    activityGrid.innerHTML = "";

    const today = new Date();
    for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const dayStr = day.toISOString().split("T")[0]; // Like in the last Web Exercise 4

      const box = document.createElement("div");
      if (data.includes(dayStr)) {
        box.classList.add("active");
      }
      activityGrid.appendChild(box);
    }
  } catch (err) {
    console.error("Failed to load activity:", err);
  }
}

async function loadFavoriteWorkouts() {
  try {
  //   const userId = localStorage.getItem("userId");
  // const res = await fetch(`/api/workouts/favorites?user_id=${userId}`);

    const res = await fetch(API.getFavorites+`?user_id=${user_id}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const favorites = await res.json();

    const container = document.getElementById("favorite-workouts");
    container.innerHTML = "";

    favorites.forEach((workout) => {
      const img = document.createElement("img");
      img.src = workout.image || "images/placeholder.png";
      img.alt = workout.name;
      img.title = workout.name;
      container.appendChild(img);
    });
  } catch (err) {
    console.error("Failed to load favorites:", err);
  }
}

async function loadRecentWorkouts() {
  try {
  //   const userId = localStorage.getItem("userId");
  // const res = await fetch(`/api/workouts/recent?user_id=${userId}`);

    const res = await fetch(API.getRecent);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const recent = await res.json();

    const container = document.getElementById("recent-workouts");
    container.innerHTML = "";

    recent.forEach((workout) => {
      const img = document.createElement("img");
      img.src = workout.image || "images/placeholder.png";
      img.alt = workout.name;
      img.title = workout.name;
      container.appendChild(img);
    });
  } catch (err) {
    console.error("Failed to load recent workouts:", err);
  }
}

// Buttons for Find Workout (get a random one) and Create workout (make your own)
function setupButtons() {
  document
    .getElementById("find-workout")
    .addEventListener("click", async () => {
      try {
        const res = await fetch("/api/exercises/random");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const exercises = await res.json();

        let text = "Your workout:\n\n";
        exercises.forEach((ex, i) => {
          text += `${i + 1}. ${ex.name} (${ex.bodyPart})\n`;
        });

        alert(text);

        // Recent aktualisieren
        loadRecentWorkouts();
        // Favorite setzen, wenn du Workout zur Favoriten machen willst:
        // Make sure to use a valid workout ID; here we use the first exercise's id if available
        if (exercises.length > 0 && exercises[0].id) {
          await fetch(API.markFavorite(exercises[0].id), {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          loadFavoriteWorkouts();
        }
      } catch (err) {
        console.error("Failed to generate workout:", err);
        alert("Failed to generate workout.");
      }
    });
  document.getElementById("create-workout").addEventListener("click", () => {
    window.location.href = "../create-workout/create-workout.html";
  });
}
