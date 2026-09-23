/* =========================================
   TASKFLOW - TASK MANAGEMENT APPLICATION
   AUREX FULL-STACK INTERNSHIP - WEEK 4
========================================= */


/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const addTaskButton = document.getElementById("add-task-button");

const validationMessage = document.getElementById("validation-message");

const emptyState = document.getElementById("empty-state");

const totalCount = document.getElementById("total-count");

const pendingCount = document.getElementById("pending-count");

const completedCount = document.getElementById("completed-count");

const filterButtons = document.querySelectorAll(".filter-button");


/* =========================================
   2. APPLICATION DATA
========================================= */

let tasks = [];

let currentFilter = "all";

const STORAGE_KEY = "taskflow_tasks";


/* =========================================
   3. LOAD TASKS FROM LOCAL STORAGE
========================================= */

function loadTasks() {

    try {

        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks !== null) {

            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {

                tasks = parsedTasks.filter(function (task) {

                    return (
                        task !== null &&
                        typeof task === "object" &&
                        (typeof task.id === "string" ||
                            typeof task.id === "number") &&
                        typeof task.title === "string" &&
                        typeof task.completed === "boolean"
                    );

                });

            } else {

                tasks = [];

            }

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error("Error loading tasks:", error);

        tasks = [];

    }

}


/* =========================================
   4. SAVE TASKS TO LOCAL STORAGE
========================================= */

function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error("Error saving tasks:", error);

        validationMessage.textContent =
            "Unable to save tasks. Please check your browser storage.";

    }

}


/* =========================================
   5. SHOW VALIDATION MESSAGE
========================================= */

function showMessage(message) {

    validationMessage.textContent = message;

}


/* =========================================
   6. CLEAR VALIDATION MESSAGE
========================================= */

function clearMessage() {

    validationMessage.textContent = "";

}


/* =========================================
   7. UPDATE TASK STATISTICS
========================================= */

function updateStatistics() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {

        return task.completed === true;

    }).length;

    const pendingTasks = totalTasks - completedTasks;

    totalCount.textContent = totalTasks;

    pendingCount.textContent = pendingTasks;

    completedCount.textContent = completedTasks;

}


/* =========================================
   8. CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {

    // Create list item
    const listItem = document.createElement("li");

    listItem.className = "task-item";

    listItem.dataset.id = String(task.id);

    if (task.completed) {

        listItem.classList.add("completed");

    }


    // Create task content container
    const taskContent = document.createElement("div");

    taskContent.className = "task-content";


    // Create checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.dataset.action = "complete";

    checkbox.dataset.id = String(task.id);

    checkbox.setAttribute(
        "aria-label",
        "Mark task as complete"
    );


    // Create task title
    const taskTitle = document.createElement("span");

    taskTitle.className = "task-title";

    taskTitle.textContent = task.title;


    // Add checkbox and title
    taskContent.appendChild(checkbox);

    taskContent.appendChild(taskTitle);


    // Create action buttons container
    const taskActions = document.createElement("div");

    taskActions.className = "task-actions";


    // Create Edit button
    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.className = "edit-button";

    editButton.textContent = "Edit";

    editButton.dataset.action = "edit";

    editButton.dataset.id = String(task.id);

    editButton.setAttribute("aria-label", "Edit task");


    // Create Delete button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-button";

    deleteButton.textContent = "Delete";

    deleteButton.dataset.action = "delete";

    deleteButton.dataset.id = String(task.id);

    deleteButton.setAttribute("aria-label", "Delete task");


    // Add buttons to action container
    taskActions.appendChild(editButton);

    taskActions.appendChild(deleteButton);


    // Add all elements to list item
    listItem.appendChild(taskContent);

    listItem.appendChild(taskActions);


    return listItem;

}


/* =========================================
   9. FILTER TASKS
========================================= */

function getFilteredTasks() {

    if (currentFilter === "pending") {

        return tasks.filter(function (task) {

            return task.completed === false;

        });

    }

    if (currentFilter === "completed") {

        return tasks.filter(function (task) {

            return task.completed === true;

        });

    }

    return tasks;

}


/* =========================================
   10. DISPLAY TASKS
========================================= */

function renderTasks() {

    // Clear existing task elements
    taskList.replaceChildren();


    // Get tasks according to current filter
    const filteredTasks = getFilteredTasks();


    // Display each task
    filteredTasks.forEach(function (task) {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    // Show or hide empty state
    if (filteredTasks.length === 0) {

        emptyState.style.display = "flex";

        const emptyHeading = emptyState.querySelector("h4");

        const emptyDescription = emptyState.querySelector("p");

        if (tasks.length === 0) {

            emptyHeading.textContent = "No tasks yet";

            emptyDescription.textContent =
                "Add your first task above and start organizing your day.";

        } else {

            emptyHeading.textContent = "No matching tasks";

            emptyDescription.textContent =
                "There are no tasks in this category.";

        }

    } else {

        emptyState.style.display = "none";

    }


    // Update statistics
    updateStatistics();

}


/* =========================================
   11. ADD NEW TASK
========================================= */

function addTask(title) {

    const newTask = {

        id: Date.now().toString() +
            "-" +
            Math.random().toString(36).slice(2, 9),

        title: title,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save tasks
    saveTasks();


    // Display updated tasks
    renderTasks();

}


/* =========================================
   12. HANDLE FORM SUBMISSION
========================================= */

taskForm.addEventListener("submit", function (event) {

    // Prevent page reload
    event.preventDefault();


    // Read and clean input
    const taskTitle = taskInput.value.trim();


    // Validate empty input
    if (taskTitle === "") {

        showMessage("Please enter a task.");

        taskInput.focus();

        return;

    }


    // Validate maximum length
    if (taskTitle.length > 200) {

        showMessage("Task cannot be longer than 200 characters.");

        taskInput.focus();

        return;

    }


    // Add task
    addTask(taskTitle);


    // Clear input
    taskInput.value = "";


    // Clear validation message
    clearMessage();


    // Focus input for next task
    taskInput.focus();

});


/* =========================================
   13. INPUT EVENT
========================================= */

taskInput.addEventListener("input", function () {

    clearMessage();

});


/* =========================================
   14. EDIT TASK
========================================= */

function editTask(taskId) {

    const task = tasks.find(function (item) {

        return String(item.id) === String(taskId);

    });


    // Check whether task exists
    if (!task) {

        showMessage("Task not found.");

        return;

    }


    // Ask user for updated task title
    const updatedTitle = prompt(
        "Edit your task:",
        task.title
    );


    // If user presses Cancel
    if (updatedTitle === null) {

        return;

    }


    // Remove extra spaces
    const cleanedTitle = updatedTitle.trim();


    // Validate empty input
    if (cleanedTitle === "") {

        showMessage("Task cannot be empty.");

        return;

    }


    // Validate maximum length
    if (cleanedTitle.length > 200) {

        showMessage("Task cannot be longer than 200 characters.");

        return;

    }


    // Update task title
    task.title = cleanedTitle;


    // Save updated tasks
    saveTasks();


    // Refresh task list
    renderTasks();


    // Clear validation message
    clearMessage();

}


/* =========================================
   15. DELETE TASK
========================================= */

function deleteTask(taskId) {

    const task = tasks.find(function (item) {

        return String(item.id) === String(taskId);

    });


    // Check whether task exists
    if (!task) {

        showMessage("Task not found.");

        return;

    }


    // Ask for confirmation
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {

        return;

    }


    // Remove task from array
    tasks = tasks.filter(function (item) {

        return String(item.id) !== String(taskId);

    });


    // Save updated tasks
    saveTasks();


    // Refresh task list
    renderTasks();


    // Clear validation message
    clearMessage();

}


/* =========================================
   16. MARK TASK AS COMPLETE
========================================= */

function toggleTask(taskId) {

    const task = tasks.find(function (item) {

        return String(item.id) === String(taskId);

    });


    // Check whether task exists
    if (!task) {

        showMessage("Task not found.");

        return;

    }


    // Change completion status
    task.completed = !task.completed;


    // Save updated tasks
    saveTasks();


    // Refresh task list
    renderTasks();


    // Clear validation message
    clearMessage();

}


/* =========================================
   17. HANDLE TASK ACTIONS
========================================= */

taskList.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-action]");


    // Ignore clicks outside action buttons
    if (!button || !taskList.contains(button)) {

        return;

    }


    const action = button.dataset.action;

    const taskId = button.dataset.id;


    // Edit task
    if (action === "edit") {

        editTask(taskId);

    }


    // Delete task
    else if (action === "delete") {

        deleteTask(taskId);

    }

});


/* =========================================
   18. HANDLE CHECKBOX EVENTS
========================================= */

taskList.addEventListener("change", function (event) {

    const checkbox = event.target;


    // Check whether checkbox belongs to a task
    if (
        checkbox.matches(
            'input[type="checkbox"][data-action="complete"]'
        )
    ) {

        const taskId = checkbox.dataset.id;

        toggleTask(taskId);

    }

});


/* =========================================
   19. HANDLE TASK FILTERS
========================================= */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Update current filter
        currentFilter = button.dataset.filter;


        // Update active button styling
        filterButtons.forEach(function (filterButton) {

            filterButton.classList.remove("active");

            filterButton.setAttribute("aria-pressed", "false");

        });


        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");


        // Display filtered tasks
        renderTasks();

    });

});


/* =========================================
   20. INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    // Load saved tasks
    loadTasks();


    // Display tasks on page load
    renderTasks();

}


// Start application
initializeApp();