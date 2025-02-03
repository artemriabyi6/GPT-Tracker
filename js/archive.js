document.addEventListener("DOMContentLoaded", () => {
    const addWorkoutBtn = document.getElementById("addWorkoutBtn");
    const modal = document.getElementById("workoutModal");
    const confirmBtn = document.getElementById("confirmWorkout");
    const archive = document.querySelector(".archive");
    const closeModal = document.getElementById("closeModal");
    const exercisesContainer = document.getElementById("exercisesContainer");
    const workoutDateInput = document.getElementById("workoutDate");

    addWorkoutBtn.addEventListener("click", () => {
        const count = parseInt(prompt("Скільки вправ ви хочете додати?"), 10);
        if (isNaN(count) || count <= 0) return;
        exercisesContainer.innerHTML = "";

        const dateInput = document.createElement("div");
        dateInput.classList.add('date-wrapper')
        dateInput.innerHTML = `
            <label for="workoutDate">Оберіть дату тренування:</label>
            <input type="date" id="workoutDate">
        `;
        exercisesContainer.appendChild(dateInput);

        for (let i = 1; i <= count; i++) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("exercise-wrapper");
            wrapper.innerHTML = `
                <label for="exercise${i}">Вправа:</label>
                <select name="exercise${i}" id="exercise${i}" >
                    <option value="Shoulder press">Shoulder press</option>
                    <option value="Dead lift">Dead lift</option>
                    <option value="Squat with dumbbel">Squat with dumbbel</option>
                    <option value="Push-up">Push-up</option>
                    <option value="Crunch">Crunch</option>
                    <option value="Dumbbel lunge">Dumbbel lunge</option>
                    <option value="Front pull-down">Front pull-down</option>
                    <option value="Cable glute">Cable glute</option>
                    <option value="Single leg squat">Single leg squat</option>
                    <option value="Cable straight">Cable straight</option>
                    <option value="Pull-Up">Pull-up</option>
                </select>
                <label for="set${i}">Підходи:</label>
                <input type="number" value="1" id="set${i}" min="1" class="set-input">
                <label for="rep${i}">Повторення:</label>
                <input type="number" value="10" id="rep${i}" min="1" class="rep-input">
                <label for="weight${i}">🏋️‍♀️:</label>
                <input type="number" value="10" id="weight${i}" min="1" class="weight-input">
            `;
            exercisesContainer.appendChild(wrapper);
        }
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    confirmBtn.addEventListener("click", () => {
        const workoutData = [];
        document.querySelectorAll(".exercise-wrapper").forEach((wrapper) => {
            workoutData.push({
                exercise: wrapper.querySelector("select").value,
                sets: wrapper.querySelector(".set-input").value,
                reps: wrapper.querySelector(".rep-input").value,
                weights: wrapper.querySelector(".weight-input").value
            });
        });

        const date = document.getElementById("workoutDate").value || new Date().toISOString().split("T")[0];
        const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        const workoutEntry = { date, exercises: workoutData };
        workouts.push(workoutEntry);
        localStorage.setItem("workouts", JSON.stringify(workouts));
        modal.style.display = "none";
        displayWorkouts();
    });

    function displayWorkouts() {
        archive.innerHTML = "";
        const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        workouts.forEach((workout, index) => {
            const workoutCard = document.createElement("div");
            workoutCard.classList.add("workout-card");
            workoutCard.innerHTML = `<strong>${workout.date}</strong>`;
            workout.exercises.forEach(ex => {
                workoutCard.innerHTML += `<p>${ex.exercise} ${ex.sets} x ${ex.reps} (${ex.weights}kg)</p>`;
            });
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Видалити";
            deleteBtn.addEventListener("click", () => {
                workouts.splice(index, 1);
                localStorage.setItem("workouts", JSON.stringify(workouts));
                displayWorkouts();
            });
            workoutCard.appendChild(deleteBtn);
            archive.appendChild(workoutCard);
        });
    }

    displayWorkouts();
});

