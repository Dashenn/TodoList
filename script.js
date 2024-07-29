const input = document.querySelector(".input-new-task");
const addButton = document.querySelector(".task-add");
const checkAll = document.querySelector(".all-check");
const deleteCompleted = document.querySelector(".delete-all-completed");
const tabs = document.querySelectorAll(".tab");
const showAll = document.querySelector("#all");
const showActive = document.querySelector("#active");
const showCompleted = document.querySelector("#completed");
const taskList = document.querySelector(".task-list");
const tasksPerPage = 5;
const paginationContainer = document.querySelector(".pagination");
const enterButton = 13;
const detailTwo = 2;
const escapeButton = 27;
let todoList = [];
let currentTab = "all";
let currentPage = 1;
let filteredList = [];

const addTask = () => {
  if (input.value.trim() === "") {
    return;
  }
  const newTask = {
    id: Date.now(),
    text: input.value
      .trim()
      .replace(/\s/g, " ")
      .replace("<", "&lt;")
      .replace("<", "&lt;"),
    completed: false,
  };
  input.value = "";
  todoList.push(newTask);
  checkAll.checked = false;

  const totalTasks = todoList.length;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  if (currentPage < totalPages) {
    currentPage = totalPages;
  }

  updateCounters();
  updateDisplayedTasks();
};

const inputAdd = (event) => {
  if (event.keyCode === enterButton) {
    addTask();
  }
};

const createList = (list) => {
  taskList.innerHTML = "";
  const start = (currentPage - 1) * tasksPerPage;
  const end = start + tasksPerPage;
  const paginatedList = list.slice(start, end);

  paginatedList.forEach((item) => {
    const task = `<li data-id="${item.id}">
            <div class='task-item'> 
                <input type="checkbox"  class="check" ${
                  item.completed ? "checked" : ""
                }>
                <p class="task-text">${item.text}</p>
                <input type='text' class='input-edit' hidden="hidden" value='${
                  item.text
                }'/>
                <button class="task-delete">X</button>
            </div>
        </li>`;
    taskList.innerHTML += task;
  });

  updateCounters();
  createPagination(list.length);
};

const updateTaskStatus = (id, checked) => {
  todoList.forEach((task) => {
    if (task.id === id) {
      task.completed = checked;
    }
  });
  if (todoList.every((item) => item.completed === true)) {
    checkAll.checked = true;
  } else {
    checkAll.checked = false;
  }

  updateDisplayedTasks();
};

const removeTask = (id) => {
  todoList = todoList.filter((item) => item.id !== id);
  updateDisplayedTasks();
  if (filteredList.length <= 0 && currentTab !== "all") {
    currentTab = "all";
    tabs.forEach((item) => item.classList.remove("active-tab"));
    showAll.classList.add("active-tab");
    updateDisplayedTasks();
  }

  updateCounters();
};

const checkAllTasks = () => {
  todoList.forEach((item) => (item.completed = checkAll.checked));
  updateDisplayedTasks();
  updateCounters();
};

const delCompleted = () => {
  if (todoList.some((item) => item.completed)) {
    todoList = todoList.filter((item) => !item.completed);

    currentTab = "all";
    currentPage = 1;
    tabs.forEach((item) => item.classList.remove("active-tab"));
    showAll.classList.add("active-tab");
    checkAll.checked = false;
    updateDisplayedTasks();
    updateCounters();
  }
};

const editTask = (id, newText) => {
  todoList.forEach((task) => {
    if (task.id === id) {
      task.text = newText;
    }
  });
};

const updateCounters = () => {
  const totalCount = todoList.length;
  const completedCount = todoList.filter((task) => task.completed).length;
  const activeCount = totalCount - completedCount;
  showAll.textContent = `All (${totalCount})`;
  showCompleted.textContent = `Completed (${completedCount})`;
  showActive.textContent = `Active (${activeCount})`;
};

const editDone = (event) => {
  const listItem = event.target.parentNode.parentNode;
  const id = parseInt(listItem.dataset.id);
  if (
    event.keyCode === enterButton ||
    (event.type === "blur" && event.target.matches(".input-edit"))
  ) {
    const newText = event.target.value;
    editTask(id, newText);
    updateDisplayedTasks();
  }
  if (event.keyCode === escapeButton) {
    event.target.value = todoList.find((task) => task.id === id).text;
    event.target.hidden = "false";
    event.target.nextElementSibling.hidden = "";
  }
};

const changeTask = (event) => {
  if (event.target.matches(".check")) {
    let id = parseInt(event.target.parentNode.parentNode.dataset.id);
    updateTaskStatus(id, event.target.checked);
  }
  if (event.target.matches(".task-delete")) {
    let id = parseInt(event.target.parentNode.parentNode.dataset.id);
    removeTask(id);
  }

  if (event.target.matches(".task-text") && event.detail === detailTwo) {
    event.target.hidden = "false";
    event.target.nextElementSibling.hidden = "";
    event.target.nextElementSibling.focus();
  }
};

const updateDisplayedTasks = () => {
  switch (currentTab) {
    case "all":
      filteredList = todoList;
      break;
    case "active":
      filteredList = todoList.filter((task) => !task.completed);
      break;
    case "completed":
      filteredList = todoList.filter((task) => task.completed);
      break;
  }
  createList(filteredList);
};

const switchTabs = (event) => {
  currentTab = event.target.id;
  currentPage = 1;
  updateDisplayedTasks();
  tabs.forEach((item) => item.classList.remove("active-tab"));
  event.target.classList.add("active-tab");
};

const createPagination = (totalTasks) => {
  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  paginationContainer.innerHTML = `
        <button class='page-button ${
          1 === currentPage ? "active-page-button" : ""
        }' data-id="1">1</button>
        `;

  for (let i = 2; i <= totalPages; i++) {
    const pageButton = `
        <button class='page-button ${
          i === currentPage ? "active-page-button" : ""
        }' data-id="${i}">${i}</button>
        `;
    paginationContainer.innerHTML += pageButton;
  }

  document.querySelectorAll(".page-button").forEach((button) => {
    button.addEventListener("click", buttonPageClick);
  });
};

const buttonPageClick = (event) => {
  currentPage = parseInt(event.target.dataset.id);
  updateDisplayedTasks();
};

taskList.addEventListener("click", changeTask);
taskList.addEventListener("keyup", editDone);
taskList.addEventListener("blur", editDone, true);
input.addEventListener("keyup", inputAdd);
addButton.addEventListener("click", addTask);
checkAll.addEventListener("click", checkAllTasks);
deleteCompleted.addEventListener("click", delCompleted);
tabs.forEach((item) => item.addEventListener("click", switchTabs));
