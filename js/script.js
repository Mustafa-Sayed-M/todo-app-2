// # Get ELements:
const app = document.querySelector('.app');
const form = document.querySelector('.app .to-do-add-task form');
const inputAddTask = document.querySelector('.app .to-do-add-task form input');
const btnAddTask = document.querySelector('.app .to-do-add-task form button');
const tasksDiv = document.querySelector('.app .to-do-tasks');
const remainingTasksDiv = document.querySelector('.app .to-do-controls .remaining-items');
const listControlsLis = document.querySelectorAll('.app .to-do-controls .to-do-list-control ul li');

// Array of moods
const arrOfMoods = ['light-mood', 'dark-mood'];

// Array of tasks
let arrOfTasks = [];

// ## Functions:
// # Function to change mood
function changeMood() {
    app.classList.toggle(arrOfMoods[0]);
    app.classList.toggle(arrOfMoods[1]);
    getMood();
}
// # Function to get mood
function getMood() {
    let currentMood = '';
    arrOfMoods.forEach(mood => {
        if (app.classList.contains(mood)) {
            currentMood = mood;
        }
    });
    sendMoodToLocalStorage(currentMood)
}
// # Function to send mood to local storage
function sendMoodToLocalStorage(mood) {
    window.localStorage.setItem("mood", mood);
}
// # Function to sen mood to local storage
function getMoodFromLocalStorage() {
    if (window.localStorage.getItem("mood")) {
        arrOfMoods.forEach(mood => {
            app.classList.remove(mood)
        })
        app.classList.add(window.localStorage.getItem("mood"));
    }
}
// # Function to prevent default
function preventDefault(e) {
    e.preventDefault();
}
// # Function to create task
function createTask() {
    const dateNow = Date.now();
    const task = {
        id: dateNow,
        value: inputAddTask.value,
        completed: false
    }
    addTaskToArr(task, arrOfTasks);
    console.log(arrOfTasks);
}
// # Function to add task to arr
function addTaskToArr(task, arr) {
    arr.push(task);
}
// # Function to add tasks to page
function addTasksToPage(arr) {
    tasksDiv.textContent = '';
    arr.forEach(({id, value, completed}) => {
        const taskEle = document.createElement('div');
        taskEle.dataset.id = id;
        taskEle.setAttribute("onclick", "completeTask(this)")
        taskEle.className = `to-do-task ${completed ? "completed" : null}`;
        taskEle.innerHTML = `
            <input type="checkbox" ${completed ? "checked" : null}>
            <p>${value}</p>
        `
        tasksDiv.appendChild(taskEle);
    })
}
// # Function to clear input
function clearInput() {
    inputAddTask.value = '';
}
// # Function to send Tasks to local storage
function sendTasksToLocalStorage(arr) {
    window.localStorage.setItem('tasks', JSON.stringify(arr));
}
// # Function to get tasks from local storage when user reload page is found tasks!
function getTasksFromLocalStorage() {
    if (window.localStorage.getItem('tasks')) {
        arrOfTasks = JSON.parse(window.localStorage.getItem('tasks'))
        addTasksToPage(arrOfTasks);
    }
    addTagP(arrOfTasks);
}
// # Function to add tag p
function addTagP(arr) {
    if (arr.length === 0) {
        tasksDiv.innerHTML = `
            <p class="no-tasks-added-yet">No Tasks Added Yet.</p>
        `
    }
}
// # Function to complete task
function completeTask(task) {
    const idTask = +task.dataset.id;
    const newArrOfTasks = [];
    arrOfTasks.forEach((task) => {
        if (idTask === task.id) {
            task.completed = task.completed ? false : true;
            newArrOfTasks.push(task);
        } else {
            newArrOfTasks.push(task);
        }
    })
    // readd tasks to page
    addTasksToPage(newArrOfTasks);
    // resend tasks to local storage
    sendTasksToLocalStorage(newArrOfTasks);
    // get remaining tasks
    remainingTasks(arrOfTasks);
}
// # Function to clear completed
function clearCompleted() {
    const newArrOfTasks = [];
    arrOfTasks.forEach((task) => {
        if (!task.completed) {
            newArrOfTasks.push(task);
        }
    })
    // readd tasks to page
    addTasksToPage(newArrOfTasks);
    // resend tasks to local storage
    sendTasksToLocalStorage(newArrOfTasks);
    // get tasks from local storage one time
    getTasksFromLocalStorage();
    // get remaining tasks
    remainingTasks(arrOfTasks);
}
// # Function to get count task remaining yet
function remainingTasks(arr) {
    let countRemaining = 0;
    arr.forEach((task) => {
        if (!task.completed) {
            countRemaining++
        }
    })
    remainingTasksDiv.textContent = `${countRemaining} Left Items`;
}
// # Function to remove active class from all items
function removeActiveClassFromAllItems(arr) {
    arr.forEach(item => {
        item.classList.remove('active');
    })
}
// # Function to add active class when user click on this ele
function addActiveClassOnThisEle(ele) {
    removeActiveClassFromAllItems(listControlsLis);
    ele.classList.add('active');
}
// # Function to filter all tasks
function filterAllTasks() {
    addTasksToPage(arrOfTasks)
    addTagP(arrOfTasks);
}
// # Function to filter active tasks
function filterActiveTasks() {
    const newArrOfTasks = [];
    arrOfTasks.forEach(task => {
        !task.completed ? newArrOfTasks.push(task) : null
    })
    addTasksToPage(newArrOfTasks)
    addTagP(arrOfTasks);
}
// # Function to filter completed tasks
function filterCompletedTasks() {
    const newArrOfTasks = [];
    arrOfTasks.forEach(task => {
        task.completed ? newArrOfTasks.push(task) : null
    })
    addTasksToPage(newArrOfTasks);
    addTagP(arrOfTasks);
}
// ## Trigger Functions:
// # When User Submit
form.onsubmit = preventDefault;
// # When User add task
btnAddTask.onclick = () => {
    if (inputAddTask.value !== '') {
        createTask();
        addTasksToPage(arrOfTasks);
        clearInput();
        sendTasksToLocalStorage(arrOfTasks);
        remainingTasks(arrOfTasks);
    }
}
// # When page reload or open first times
window.onload = () => {
    getTasksFromLocalStorage();
    remainingTasks(arrOfTasks);
    getMoodFromLocalStorage()
};