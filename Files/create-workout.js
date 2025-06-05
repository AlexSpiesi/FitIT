document.addEventListener("DOMContentLoaded", () => {
  fetchExercises();

  document.getElementById("workout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("workout-name").value;
    const selected = Array.from(document.querySelectorAll("input[name='exercise']:checked"))
      .map(input => input.value);

    if (selected.length === 0) {
      alert("Please select at least one exercise.");
      return;
    }

    try {
      const res = await fetch('/api/workouts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, exercises: selected })
      });

      if (!res.ok) throw new Error("Failed to save workout");
      alert("Workout saved!");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the workout.");
    }
  });
});

async function fetchExercises() {
  try {
    const res = await fetch('/api/exercises');
    const exercises = await res.json();

    const container = document.getElementById("exercise-list");
    exercises.forEach(ex => {
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
