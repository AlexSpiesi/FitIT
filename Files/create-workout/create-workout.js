document.addEventListener("DOMContentLoaded", () => {
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
  try {
    const res = await fetch("/api/exercises");
    const exercises = await res.json();

    const container = document.getElementById("exercise-list");
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
    console.error("Failed to load exercises:", err);
  }
}
