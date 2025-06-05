// === Konfiguration ===
const DAYS_SHOWN = 70; // Anzahl der Tage im Tracker

// === Dummy-Endpunkte (ersetzen durch echte Routen aus deinem Backend) ===
const API = {
  getActivity: '/api/health/activity',           // z. B. getTrainingDates
  getFavorites: '/api/workouts/favorites',       // beliebte Workouts
  getRecent: '/api/workouts/recent',             // letzte Trainings
  getRandomWorkout: '/api/exercises/random'      // zufällige Übungsauswahl
};

// === Initialisierung beim Laden ===
document.addEventListener("DOMContentLoaded", () => {
  loadActivityGrid();
  loadFavoriteWorkouts();
  loadRecentWorkouts();
  setupButtons();
});

// === GitHub-ähnliches Raster: Trainings-Aktivität ===
async function loadActivityGrid() {
  try {
    const res = await fetch(API.getActivity);
    const data = await res.json(); // erwartet ein Array von Datumsstrings, z. B. ["2025-06-01", "2025-06-03", ...]

    const activityGrid = document.getElementById("activity-grid");
    activityGrid.innerHTML = "";

    const today = new Date();
    for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const dayStr = day.toISOString().split("T")[0]; // YYYY-MM-DD

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

// === Favoriten laden ===
async function loadFavoriteWorkouts() {
  try {
    const res = await fetch(API.getFavorites);
    const favorites = await res.json();

    const container = document.getElementById("favorite-workouts");
    container.innerHTML = "";

    favorites.forEach(workout => {
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

// === Letzte Workouts laden ===
async function loadRecentWorkouts() {
  try {
    const res = await fetch(API.getRecent);
    const recent = await res.json();

    const container = document.getElementById("recent-workouts");
    container.innerHTML = "";

    recent.forEach(workout => {
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

// === Button-Funktionen ===
function setupButtons() {
  document.getElementById("find-workout").addEventListener("click", async () => {
  try {
    const res = await fetch('/api/exercises/random');
    const exercises = await res.json();

    let text = "Your workout:\n\n";
    exercises.forEach((ex, i) => {
      text += `${i + 1}. ${ex.name} (${ex.bodyPart})\n`;
    });

    alert(text);
  } catch (err) {
    console.error("Failed to generate workout:", err);
    alert("Failed to generate workout.");
  }
});
  document.getElementById("create-workout").addEventListener("click", () => {
    window.location.href = "create-workout.html"; // muss ggf. erstellt werden
  });
}
