
// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");

// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const taskCard = document.createElement("div");
        taskCard.className = "task-item";

        const taskName = document.createElement("h3");
        taskName.textContent = task.title;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + task.subject;

        const deadline = document.createElement("p");
        deadline.textContent = "Deadline: " + task.deadline;

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;

        const status = document.createElement("p");
        status.textContent = task.completed
            ? "Completed"
            : "Pending";

        // Edit Task Button
const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function() {

    const newTitle = prompt("Enter task name:", task.title);
    if (newTitle === null || newTitle.trim() === "") return;

    const newSubject = prompt("Enter subject:", task.subject);
    if (newSubject === null || newSubject.trim() === "") return;

    const newDeadline = prompt("Enter deadline (YYYY-MM-DD):", task.deadline);
    if (newDeadline === null || newDeadline.trim() === "") return;

    const newPriority = prompt(
        "Enter priority (High, Medium, Low):",
        task.priority
    );

    if (!["High", "Medium", "Low"].includes(newPriority)) {
        alert("Please enter High, Medium or Low.");
        return;
    }

    task.title = newTitle.trim();
    task.subject = newSubject.trim();
    task.deadline = newDeadline;
    task.priority = newPriority;

    saveTasks();
    displayTasks();

});
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Undo"
            : "Mark Completed";

        completeButton.addEventListener("click", function() {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        taskCard.appendChild(taskName);
        taskCard.appendChild(subject);
        taskCard.appendChild(deadline);
        taskCard.appendChild(priority);
        taskCard.appendChild(status);
        taskCard.appendChild(editButton);
        taskCard.appendChild(completeButton);
        taskCard.appendChild(deleteButton);

        taskList.appendChild(taskCard);

    });

    updateStatistics();
    renderProgress();
    renderUpcomingDeadlines();
}

// UPCOMING DEADLINES FUNCTION

function renderUpcomingDeadlines() {

    const upcomingContainer =
        document.getElementById("deadlineList");

    if (!upcomingContainer) {
        return;
    }

    upcomingContainer.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks
        .filter(function(task) {

            if (task.completed || !task.deadline) {
                return false;
            }

            const deadline = new Date(task.deadline + "T00:00:00");

            return deadline >= today;

        })
        .sort(function(a, b) {
            return a.deadline.localeCompare(b.deadline);
        });

    if (upcomingTasks.length === 0) {

        upcomingContainer.textContent =
            "No upcoming tasks. You're all caught up!";

        return;
    }

    upcomingTasks.forEach(function(task) {

        const card = document.createElement("div");
        card.className = "upcoming-task-card " +
    task.priority.toLowerCase() + "-priority";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + task.subject;

        const deadline = document.createElement("p");
        deadline.textContent = "Deadline: " + task.deadline;

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;

        card.appendChild(title);
        card.appendChild(subject);
        card.appendChild(deadline);
        card.appendChild(priority);

        upcomingContainer.appendChild(card);

    });

}

// Add a new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const subject = document.getElementById("taskSubject").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;

    const newTask = {
        id: Date.now(),
        title: title,
        subject: subject,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskForm.reset();

});

// Update dashboard statistics
function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    productivity.textContent = percentage + "%";
    renderProgress();

}

// Display previously saved tasks
displayTasks();


// WEEKLY PLANNER FUNCTIONALITY

const plannerForm = document.getElementById("plannerForm");
const studyList = document.getElementById("studyList");

// Load saved study sessions
let studySessions =
    JSON.parse(localStorage.getItem("studySessions")) || [];

// Save study sessions
function saveStudySessions() {
    localStorage.setItem(
        "studySessions",
        JSON.stringify(studySessions)
    );
}

    
// Format time into 12-hour AM/PM format
function formatStudyTime(value) {

    // Already in AM/PM format
    if (/AM|PM/i.test(value)) {
        return value.toUpperCase();
    }

    // Convert previously saved 24-hour times
    const parts = value.split(":");

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return hours + ":" + minutes + " " + period;
}


// Display study sessions
function displayStudySessions() {

    studyList.innerHTML = "";

    studySessions.forEach(function(session) {

        const card = document.createElement("div");
        card.className = "study-card";

        const day = document.createElement("h3");
        day.textContent = session.day;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + session.subject;

        const topic = document.createElement("p");
        topic.textContent = "Topic: " + session.topic;

        const time = document.createElement("p");
        time.textContent = "Time: " + formatStudyTime(session.time);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            studySessions = studySessions.filter(function(item) {
                return item.id !== session.id;
            });

            saveStudySessions();
            displayStudySessions();

        });

        card.appendChild(day);
        card.appendChild(subject);
        card.appendChild(topic);
        card.appendChild(time);
        card.appendChild(deleteButton);

        studyList.appendChild(card);

    });

}



// Add a study session
plannerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const enteredTime = document
        .getElementById("studyTime")
        .value.trim();

    const timePattern =
        /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    if (!timePattern.test(enteredTime)) {
        alert("Enter time like 4:30 PM or 9:00 AM");
        return;
    }

    const newSession = {

        id: Date.now(),

        day: document.getElementById("studyDay").value,

        subject: document.getElementById("studySubject").value.trim(),

        topic: document.getElementById("studyTopic").value.trim(),

        time: enteredTime.toUpperCase()

    };

    studySessions.push(newSession);

    saveStudySessions();

    displayStudySessions();

    plannerForm.reset();

});


// Display saved sessions when page loads
displayStudySessions();


// Show previously saved sessions
displayStudySessions();



// PROGRESS TRACKER

function renderProgress()
{

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    // Update circular progress

    const circularProgress =
        document.getElementById("circularProgress");

    const progressPercentage =
        document.getElementById("progressPercentage");

    const progressText =
        document.getElementById("progressText");

    circularProgress.style.background =
        `conic-gradient(
            #2563eb 0%,
            #7c3aed ${percentage}%,
            #dbeafe ${percentage}%,
            #dbeafe 100%
        )`;

    progressPercentage.textContent = percentage + "%";

    progressText.textContent = percentage + "% Completed";


    // Subject-wise progress

    const subjectContainer =
        document.getElementById("subjectProgress");

    subjectContainer.innerHTML = "";

    const subjects = {};

    tasks.forEach(function(task) {

        const subject = task.subject || "Other";

        if (!subjects[subject]) {

            subjects[subject] = {
                total: 0,
                completed: 0
            };

        }

        subjects[subject].total++;

        if (task.completed) {
            subjects[subject].completed++;
        }

    });


    // Display each subject

    Object.keys(subjects).forEach(function(subject) {

        const data = subjects[subject];

        const subjectPercentage = Math.round(
            (data.completed / data.total) * 100
        );

        const item = document.createElement("div");

        item.className = "subject-item";

        const heading = document.createElement("p");

        heading.textContent =
            subject + " — " + subjectPercentage + "%";


        const bar = document.createElement("div");

        bar.className = "progress-bar";

        const fill = document.createElement("div");

        fill.style.width = subjectPercentage + "%";

        bar.appendChild(fill);

        item.appendChild(heading);

        item.appendChild(bar);

        subjectContainer.appendChild(item);

    });
}
// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById("currentDate");

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

displayCurrentDate();