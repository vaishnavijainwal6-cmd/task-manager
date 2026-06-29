const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Add Task
addBtn.addEventListener("click", addTask);

// Search Task
searchInput.addEventListener("input", displayTasks);

// Filter Tasks
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Filter
    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(
            task => task.completed
        );
    }

    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );
    }

    // Search
    const searchText = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        // Complete Task
        li.querySelector(".complete-btn")
            .addEventListener("click", () => {

                task.completed = !task.completed;

                saveTasks();

                displayTasks();
            });

        // Delete Task
        li.querySelector(".delete-btn")
            .addEventListener("click", () => {

                tasks = tasks.filter(
                    t => t.id !== task.id
                );

                saveTasks();

                displayTasks();
            });

        taskList.appendChild(li);
    });

    updateTaskCount();
}

function updateTaskCount() {
    taskCount.textContent = tasks.length;
}

// Save Tasks
function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

// Initial Load
displayTasks();