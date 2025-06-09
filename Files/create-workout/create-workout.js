/*document.addEventListener("DOMContentLoaded", () => {
  fetchExercises();

  document
    .getElementById("workout-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("workout-name").value;
      const selectedIds = Array.from(
        document.querySelectorAll("input[name='exercise']:checked")
      ).map((input) => input.value);

      if (selectedIds.length === 0) {
        alert("Bitte wähle mindestens eine Übung aus.");
        return;
      }

      try {
        localStorage.setItem("user_id", "1");
        const user_id = parseInt(localStorage.getItem("user_id"), 10);
        if (isNaN(user_id)) {
          alert("User-ID nicht gefunden. Bist du eingeloggt?");
          return;
        }

        const allExercises = await fetch("/api/exercises").then((res) =>
          res.json()
        );
        const selectedExercises = allExercises.filter((ex) =>
          selectedIds.includes(ex.id)
        );

        const res = await fetch("/api/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id, name, exercises: selectedExercises }),
        });

        const data = await res.json();

        // Favorisieren
        await fetch(`/api/workouts/${data.workout_id}/favorite`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          console.error("Server responded with:", data);
          throw new Error("Failed to save workout");
        }

        alert("Workout saved!");
        window.location.href = "../dashboard/dashboard.html";
      } catch (err) {
        console.error("Error while saving workout:", err);
        alert("An error occurred while saving the workout.");
      }
    });
});

async function fetchExercises() {
  const container = document.getElementById("exercise-list");

  const bodyParts = [
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist"
  ];

  for (const part of bodyParts) {
    try {
      const res = await fetch(`/api/exercises/bodypart/${encodeURIComponent(part)}?limit=5`);
      if (!res.ok) throw new Error(`Failed to fetch for ${part}`);

      const exercises = await res.json();

      if (exercises.length === 0) continue;

      // Section title
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = part.charAt(0).toUpperCase() + part.slice(1);
      container.appendChild(sectionTitle);

      // Exercises for this body part
      exercises.forEach((ex) => {
        const wrapper = document.createElement("div");
        wrapper.className = "exercise-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "exercise";
        checkbox.value = ex.id;

        const label = document.createElement("label");
        label.textContent = ex.name;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
      });

    } catch (err) {
      console.error(`Error loading exercises for ${part}:`, err);
    }
  }
}

*/
document.addEventListener("DOMContentLoaded", () => {
  // Equipment filter buttons data
  const equipmentTypes = [
    "assisted",
    "band",
    "barbell",
    "body weight",
    "bosu ball",
    "cable",
    "dumbbell",
    "elliptical machine",
    "ez barbell",
    "hammer",
    "kettlebell",
    "leverage machine",
    "medicine ball",
    "olympic barbell",
    "resistance band",
    "roller",
    "rope",
    "skierg machine",
    "sled machine",
    "smith machine",
    "stability ball",
    "stationary bike",
    "stepmill machine",
    "tire",
    "trap bar",
    "upper body ergometer",
    "weighted",
    "wheel roller"
  ];

  const equipmentFilterContainer = document.getElementById("equipment-filter-container");

  // Create buttons for each equipment type
  equipmentTypes.forEach((type) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = type;
    btn.className = "equipment-filter-btn";
    btn.dataset.equipment = type;
    equipmentFilterContainer.appendChild(btn);
  });

  // Fetch exercises on page load without equipment filter (default body parts)
  fetchExercises();

  // Handle equipment filter clicks
  equipmentFilterContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // Remove active class from all buttons
      document.querySelectorAll(".equipment-filter-btn").forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      e.target.classList.add("active");

      const selectedEquipment = e.target.dataset.equipment;
      // Fetch exercises filtered by equipment
      fetchExercises(null, selectedEquipment);
    }
  });

  // Form submit handler
  document.getElementById("workout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("workout-name").value;
    const selectedIds = Array.from(document.querySelectorAll("input[name='exercise']:checked")).map((input) => input.value);

    if (selectedIds.length === 0) {
      alert("Bitte wähle mindestens eine Übung aus.");
      return;
    }

    try {
      localStorage.setItem("user_id", "1");
      const user_id = parseInt(localStorage.getItem("user_id"), 10);
      if (isNaN(user_id)) {
        alert("User-ID nicht gefunden. Bist du eingeloggt?");
        return;
      }

      // Fetch all exercises (or filtered, if you want you can improve here)
      const allExercises = await fetch("/api/exercises").then((res) => res.json());
      const selectedExercises = allExercises.filter((ex) => selectedIds.includes(ex.id));

      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, name, exercises: selectedExercises }),
      });

      const data = await res.json();

      // Favorisieren
      await fetch(`/api/workouts/${data.workout_id}/favorite`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      if (!res.ok) {
        console.error("Server responded with:", data);
        throw new Error("Failed to save workout");
      }

      alert("Workout saved!");
      window.location.href = "../dashboard/dashboard.html";
    } catch (err) {
      console.error("Error while saving workout:", err);
      alert("An error occurred while saving the workout.");
    }
  });
});

// Updated fetchExercises supports optional bodyPart and equipment filter
async function fetchExercises(bodyPart = null, equipment = null) {
  const container = document.getElementById("exercise-list");
  container.innerHTML = ""; // Clear previous results

  if (equipment) {
    // Fetch by equipment filter only (show all with that equipment)
    try {
      const res = await fetch(`/api/exercises/equipment/${encodeURIComponent(equipment)}?limit=0`);
      if (!res.ok) throw new Error(`Failed to fetch exercises for equipment: ${equipment}`);

      const exercises = await res.json();

      if (exercises.length === 0) {
        container.textContent = "Keine Übungen für das ausgewählte Equipment gefunden.";
        return;
      }

      // Section title
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = `Equipment: ${equipment}`;
      container.appendChild(sectionTitle);

      exercises.forEach((ex) => {
        const wrapper = document.createElement("div");
        wrapper.className = "exercise-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "exercise";
        checkbox.value = ex.id;

        const label = document.createElement("label");
        label.textContent = ex.name;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
      });
    } catch (err) {
      console.error(err);
      container.textContent = "Fehler beim Laden der Übungen.";
    }
  } else {
    // No equipment filter: fetch by body parts (default behavior)
    const bodyParts = bodyPart
      ? [bodyPart]
      : [
          "back",
          "cardio",
          "chest",
          "lower arms",
          "lower legs",
          "neck",
          "shoulders",
          "upper arms",
          "upper legs",
          "waist",
        ];

    for (const part of bodyParts) {
      try {
        const res = await fetch(`/api/exercises/bodypart/${encodeURIComponent(part)}?limit=5`);
        if (!res.ok) throw new Error(`Failed to fetch for ${part}`);

        const exercises = await res.json();
        if (exercises.length === 0) continue;

        // Section title
        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = part.charAt(0).toUpperCase() + part.slice(1);
        container.appendChild(sectionTitle);

        exercises.forEach((ex) => {
          const wrapper = document.createElement("div");
          wrapper.className = "exercise-item";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "exercise";
          checkbox.value = ex.id;

          const label = document.createElement("label");
          label.textContent = ex.name;

          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
          container.appendChild(wrapper);
        });
      } catch (err) {
        console.error(`Error loading exercises for ${part}:`, err);
      }
    }
  }
}

