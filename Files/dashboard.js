const DAYS_SHOWN = 70;

const API = {
  getActivity: '/api/health/activity',           
  getFavorites: '/api/workouts/favorites',       
  getRecent: '/api/workouts/recent',            
  getRandomWorkout: '/api/exercises/random'     
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

// Buttons for Find Workout (get a random one) and Create workout (make your own)
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
    window.location.href = "create-workout.html"; 
  });
}
