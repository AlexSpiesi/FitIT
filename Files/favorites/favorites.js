document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
});

async function loadFavorites() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("User not found. Please log in.");
    return;
  }

  try {
    const res = await fetch(`/api/workouts/favorites?user_id=${user_id}`);
    if (!res.ok) throw new Error("Fehler beim Abrufen der Favoriten.");

    const favorites = await res.json();
    console.log(favorites)
    const container = document.getElementById("favorites-container");

    if (favorites.length === 0) {
      container.innerHTML = "<p>Keine Favoriten vorhanden.</p>";
      return;
    }

    favorites.forEach((workout) => {
  const card = document.createElement("div");
  card.className = "favorite-card";

  const img = document.createElement("img");
  img.src = workout.image || "../images/default-workout.png";
  img.alt = workout.name;

  const title = document.createElement("h3");
  title.textContent = workout.name;

  card.appendChild(img);
  card.appendChild(title);
  container.appendChild(card);

  card.addEventListener("click", async () => {
    try {
      const res = await fetch(`/api/workouts/${workout.id}`);
      if (!res.ok) throw new Error("Workout not found");
      const data = await res.json();
      showWorkoutDetails(workout.name, data.exercises);
    } catch (err) {
      console.error("Fehler beim Laden des Workouts:", err.message);
      alert("Fehler beim Laden des Workouts");
    }
  });
});

  } catch (err) {
    console.error(err);
    document.getElementById("favorites-container").innerHTML =
      "<p>Fehler beim Laden der Favoriten.</p>";
  }
}

// Function to show workout details and exercises on click
function showWorkoutDetails(workoutId) {
  const detailsContainer = document.getElementById('workout-details');
  detailsContainer.innerHTML = 'Loading...';

  fetch(`/api/workouts/${workoutId}`)
    .then(res => {
      if (!res.ok) throw new Error('Workout not found');
      return res.json();
    })
    .then(workout => {
      // Clear previous content
      detailsContainer.innerHTML = '';

      const title = document.createElement('h2');
      title.textContent = workout.name;
      detailsContainer.appendChild(title);

      if (workout.exercises && workout.exercises.length > 0) {
        const list = document.createElement('ul');
        workout.exercises.forEach(ex => {
          const item = document.createElement('li');

          const img = document.createElement('img');
          img.src = ex.gifUrl || '../images/default-workout.png';
          img.alt = ex.name;
          img.style.width = '50px';
          img.style.height = '50px';
          img.style.marginRight = '10px';

          const text = document.createElement('span');
          text.textContent = ex.name;

          item.appendChild(img);
          item.appendChild(text);
          list.appendChild(item);
        });
        detailsContainer.appendChild(list);
      } else {
        detailsContainer.textContent = 'No exercises found for this workout.';
      }
    })
    .catch(err => {
      detailsContainer.textContent = `Fehler beim Laden des Workouts: ${err.message}`;
      console.error(err);
    });
}



    
