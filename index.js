// selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const todoFilter = document.querySelector(".filter-todo");

// alerts
const alertWarning = document.querySelector(".alert-warning");
const alertSuccess = document.querySelector(".alert-success");

// events
document.addEventListener("DOMContentLoaded", function () {
  getTodos();
});
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
todoFilter.addEventListener("click", filterTodo);

// functions
function addTodo(e) {
  e.preventDefault();

  const isEmpty = (str) => !str.trim().length;

  if (isEmpty(todoInput.value)) {
    alertWarning.style.display = "block";
    setTimeout(() => {
      alertWarning.style.display = "none";
    }, 1500);

    // clear todo input value
    todoInput.value = "";
  } else {
    alertSuccess.style.display = "block";
    setTimeout(() => {
      alertSuccess.style.display = "none";
    }, 1500);

    // Datum skapat
    const currentDate = getCurrentDate();

    saveLocalTodos(todoInput.value);
    // skapat todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // skapat todo li
    const newTodo = document.createElement("li");
    newTodo.innerHTML = `
      <span class="todo-text">${todoInput.value}</span>
      <span class="todo-dates">
        <span class="created-date">(${currentDate})</span>
        <span class="completed-date"></span>
      </span>`;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // skapat check button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = "<i class='fas fa-check-circle'></i>";
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // skapat trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = "<i class='fa fa-minus-circle'></i>";
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // append till list
    todoList.appendChild(todoDiv);

    // clear todo input value
    todoInput.value = "";
  }
}

function getCurrentDate() {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const currentDate = new Date().toLocaleDateString("sv-SE", options);
  return currentDate;
}

function deleteCheck(e) {
  const item = e.target;

  // delete todo
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocaleStorage(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  // check mark
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");

    const completedDate = todo.querySelector(".completed-date");
    if (todo.classList.contains("completed")) {
      const currentDate = getCurrentDate();
      completedDate.innerText = `Klartdatum: ${currentDate}`;
    } else {
      completedDate.innerText = "";
    }
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (item) {
    switch (e.target.value) {
      case "all":
        item.style.display = "flex";
        break;
      case "completed":
        if (item.classList.contains("completed")) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!item.classList.contains("completed")) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
        break;
    }
  });
}

// locale Storage
function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach((todo) => {
    // skapat todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // skapat todo li
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // skapat check button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = "<i class='fas fa-check-circle'></i>";
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // skapat trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = "<i class='fa fa-minus-circle'></i>";
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // append till list
    todoList.appendChild(todoDiv);
  });
}

function removeLocaleStorage(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[1].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
