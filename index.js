// global variable
let todos = [];
const DUMMY_TODO_SIZE = 150;
const DUMMY_USER_ID = 9;
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

  const isEmpty = (str) => !str.trim().length;

  // Validera om strängen för todolistan är tom.
  if (isEmpty(todoInput.value)) {
    alertWarning.style.display = "block";
    setTimeout(() => {
      alertWarning.style.display = "none";
    }, 1500);

    todoInput.value = "";
  } else {
    saveDummyTodos(todoInput.value);
    // skapat todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("id", todos.length + DUMMY_TODO_SIZE);
    // skapat todo li
    const newTodo = document.createElement("li");
    newTodo.innerHTML = `<span class="todo-text">${todoInput.value}</span>`;
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

function saveDummyTodos(todo) {
  const todoItem = { todo, completed: false, userId: DUMMY_USER_ID };

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
}

function getTodos() {
  fetch(`https://dummyjson.com/todos/user/${DUMMY_USER_ID}`)
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
