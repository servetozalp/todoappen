// global variable
let todos = [];
const DUMMY_TODO_SIZE = 150;
// selectors
const todoInput = document.querySelector(".todo-input"); // element av todo text
const todoButton = document.querySelector(".todo-button"); // element av todo button add
const todoList = document.querySelector(".todo-list"); // element av todo list view, usually process of append
const todoFilter = document.querySelector(".filter-todo"); // element av status filter

// alerts
const alertWarning = document.querySelector(".alert-warning"); // validation varningar
const alertSuccess = document.querySelector(".alert-success"); // if todo tillagd, success info

// events

document.addEventListener("DOMContentLoaded", function () {
  getTodos(); // fetch from local storage - ersatt med dummy
});

todoButton.addEventListener("click", addTodo);

todoList.addEventListener("click", deleteCheck);

todoFilter.addEventListener("click", filterTodo);

// functions
function addTodo(e) {
  e.preventDefault();

  const isEmpty = (str) => !str.length;

  if (isEmpty(todoInput.value)) {
    alertWarning.style.display = "block";
    setTimeout(() => {
      alertWarning.style.display = "none";
    }, 1500);

    // clear todo input value
    todoInput.value = "";
  } else {
    // Datum skapat
    const currentDate = getCurrentDate();

    saveDummyTodos(todoInput.value);
    // skapat todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("id", todos.length + DUMMY_TODO_SIZE);
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
  const todo = item.parentElement;
  const id = todo.id;
  // tabort todo
  if (item.classList[0] === "trash-btn") {
    removeDummyTodo(id, todo);
  }

  // check mark
  if (item.classList[0] === "complete-btn") {
    updateDummyTodo(id, todo);
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
function saveDummyTodos(todo) {
  const todoItem = { todo, completed: false, userId: 26 };

  fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoItem),
  })
    .then((res) => res.json())
    .then((data) => {
      if (Object.keys(data).length > 0) {
        todos.push(data);
        alertSuccess.style.display = "block";
        setTimeout(() => {
          alertSuccess.style.display = "none";
        }, 1500);
      }
    });
  /*
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));*/
}

function getTodos() {
  /*
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }*/

  fetch("https://dummyjson.com/todos/user/26")
    .then((res) => res.json())
    .then((data) => {
      todos = data.todos;
      todos.forEach((todoItem) => {
        const todo = todoItem.todo;
        const completed = todoItem.completed;
        const id = todoItem.id;
        // skapat todo div
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("id", id);
        todoDiv.classList.add("todo");
        if (completed) {
          todoDiv.classList.add("completed");
        }

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

function updateDummyTodo(id, todoEl) {
  /* updating completed status of todo with id 1 */
  const completed = todoEl.classList.contains("completed");
  fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT" /* or PATCH */,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: !completed,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // if successfull
      if (Object.keys(data).length > 0) {
        todoEl.classList.toggle("completed");
        const completedDate = todoEl.querySelector(".completed-date");
        if (todoEl.classList.contains("completed")) {
          const currentDate = getCurrentDate();
          completedDate.innerText = `Klartdatum: ${currentDate}`;
        } else {
          completedDate.innerText = "";
        }
      }
    });
}

function removeDummyTodo(id, todoEl) {
  fetch(`https://dummyjson.com/todos/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      // if successfull
      if (Object.keys(data).length > 0) {
        todoEl.classList.add("fall");
        todoEl.addEventListener("transitionend", function () {
          todoEl.remove();
        });
      }
    });
}
