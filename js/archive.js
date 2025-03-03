
document.addEventListener("DOMContentLoaded", () => {
    const addWorkoutBtn = document.getElementById("addWorkoutBtn");
    const modal = document.getElementById("workoutModal");
    const confirmBtn = document.getElementById("confirmWorkout");
    const archive = document.getElementById("archive");
    const closeModal = document.getElementById("closeModal");
    const exercisesContainer = document.getElementById("exercisesContainer");
    const workoutDateInput = document.getElementById("workoutDate");
    const archiveTitle = document.getElementById("archiveTitle");
    const archiveBlock = document.getElementById("archive");
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";
    archiveBlock.after(paginationContainer);

    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    addWorkoutBtn.addEventListener("click", () => {
        const count = parseInt(prompt("Скільки вправ ви хочете додати?"), 10);
        if (isNaN(count) || count <= 0) return;
        exercisesContainer.innerHTML = "";

        const dateInput = document.createElement("div");
        dateInput.classList.add("date-wrapper");
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
                <select name="exercise${i}" id="exercise${i}">
                    <option value="Shoulder press">Shoulder press</option>
                    <option value="Dead lift">Dead lift</option>
                    <option value="Squats with dumbbel">Squats with dumbbel</option>
                    <option value="Push-up">Push-up</option>
                    <option value="Crunches">Crunches</option>
                    <option value="Lunges">Lunges</option>
                    <option value="Lat pulldowns">Lat pulldowns</option>
                    <option value="Cable glute">Cable glute</option>
                    <option value="Seated cable row">Seated cable row</option>
                    <option value="Biceps curl">Biceps curl</option>
                    <option value="Glute bridge">Glute bridge</option>
                    <option value="Leg extension">Leg extension</option>
                    <option value="Bulgarian squat">Bulgarian squat</option>
                    <option value="Dumbbel bench press">Dumbbel bench press</option>

                    <option value="Abductions">Abductions</option>
                    <option value="Adductions">Adductions</option>

                </select>
                <label for="set${i}">Підходи:</label>
                <input type="number" value="1" id="set${i}" min="1" class="set-input">
                <label for="rep${i}">Повторення:</label>
                <input type="number" value="10" id="rep${i}" min="1" class="rep-input">
                <label for="weight${i}">🏋️‍♀️:</label>
                <input type="number" value="10" id="weight${i}" min="0" class="weight-input">
            `;
            exercisesContainer.appendChild(wrapper);
        }
        modal.classList.add("show");
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        addWorkoutBtn.style.display = 'none'
        archiveTitle.style.display = 'none'
        paginationContainer.style.display = 'none'
        checkClasses()
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.style.overflow = "inherit";
        addWorkoutBtn.style.display = 'block'
        archiveTitle.style.display = 'block'
        paginationContainer.style.display = 'block'
        archiveBlock.style.display = 'block'
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
        workouts.unshift({ date, exercises: workoutData });
        localStorage.setItem("workouts", JSON.stringify(workouts));
        modal.style.display = "none";
        document.body.style.overflow = "inherit";
        addWorkoutBtn.style.display = 'block'
        archiveTitle.style.display = 'block'
        paginationContainer.style.display = 'block'
        archiveBlock.style.display = 'block'
        displayWorkouts();
    });

    function displayWorkouts() {
        archive.innerHTML = "";
        const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
        const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const workoutsToShow = workouts.slice(startIndex, endIndex);

        

        workoutsToShow.forEach((workout, index) => {
            const workoutCard = document.createElement("div");
            workoutCard.classList.add("workout-card");
            workoutCard.innerHTML = `<strong>${workout.date}</strong>`;
            workout.exercises.forEach(ex => {
                workoutCard.innerHTML += `<p>${ex.exercise} ${ex.sets} x ${ex.reps} (${ex.weights}kg)</p>`;
            });
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Видалити";
            deleteBtn.addEventListener("click", () => {
                workouts.splice(startIndex + index, 1);
                
                localStorage.setItem("workouts", JSON.stringify(workouts));
                displayWorkouts();
            });
            workoutCard.appendChild(deleteBtn);
            archive.appendChild(workoutCard);
        });

        displayPagination(totalPages);
    }

    function displayPagination(totalPages) {
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add("page-btn");
                        
            i === currentPage && totalPages > 1 ? pageBtn.classList.add("active") : null 
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                displayWorkouts();
            });
            paginationContainer.appendChild(pageBtn);
        }
    }

    function checkClasses() {
                 archiveBlock.hasChildNodes() ? archiveBlock.style.display = 'none' : null
             }

    displayWorkouts();
});



