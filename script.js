(function () {
  const input = document.querySelector(".input-new-task");
  const addButton = document.querySelector(".task-add");
  const checkAll = document.querySelector(".all-check");
  const deleteCompleted = document.querySelector(".delete-all-completed");
  const tabs = document.querySelectorAll(".tab");
  const showAll = document.querySelector("#all");
  const showActive = document.querySelector("#active");
  const showCompleted = document.querySelector("#completed");
  const taskList = document.querySelector(".task-list");
  const paginationContainer = document.querySelector(".pagination");

  const TASKS_PER_PAGE = 5;
  const ENTER_BUTTON = 13;
  const DETAIL_TWO = 2;
  const ESCAPE_BUTTON = 27;
  let todoList = [];
  let currentTab = "all";
  let currentPage = 1;

  const addTask = () => {
    if (input.value.trim() === "") {
      return;
    }
    const newTask = {
      id: Date.now(),
      text: input.value
        .trim()
        .replace(/ {2,}/g, " ")

        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"),

      completed: false,
    };
    currentTab = "all";
    tabs.forEach((item) => item.classList.remove("active-tab"));
    showAll.classList.add("active-tab");
    updateDisplayedTasks();
    input.value = "";
    todoList.push(newTask);
    checkAll.checked = false;

    const totalTasks = todoList.length;
    const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);

    if (currentPage < totalPages) {
      currentPage = totalPages;
    }

    updateCounters();
    updateDisplayedTasks();
  };

  const inputAdd = (event) => {
    if (event.keyCode === ENTER_BUTTON) {
      addTask();
    }
  };

  const createList = (list) => {
    taskList.innerHTML = "";
    const start = (currentPage - 1) * TASKS_PER_PAGE;
    const end = start + TASKS_PER_PAGE;
    const paginatedList = list.slice(start, end);

    paginatedList.forEach((item) => {
      const task = `<li data-id="${item.id}">
            <div class='task-item'> 
                <input type="checkbox"  class="check" ${
                  item.completed ? "checked" : ""
                }>
                <p class="task-text">${item.text}</p>
                <input type='text' class='input-edit' hidden="hidden"  maxlength="255" value='${
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
    todoList.forEach((item) => {
      if (item.id === id) {
        item.completed = checked;
      }
    });
    if ((todoList.filter((task) => !task.completed).length === 0 && currentTab==='active' ) ) {
      currentTab = "all";
      allStyles();
      currentPage=1
    }
    if ((todoList.filter((task) => task.completed).length === 0 && currentTab==='completed') ) {
     
      currentTab = "all";
      allStyles();
      currentPage=1
    }
    if (todoList.every((item) => item.completed)) {
      checkAll.checked = true;
    } else {
      checkAll.checked = false;
    }
  
    const filteredList = todoList.filter((task) => {
      if (currentTab === "active") return !task.completed;
      if (currentTab === "completed") return task.completed;
      return true;
    });
  
    const totalPages = Math.ceil(filteredList.length / TASKS_PER_PAGE);
    if (currentPage > totalPages && currentPage > 1) {
      currentPage--;  
    }
  

    updateDisplayedTasks();
  };
  

  const removeTask = (id) => {
    todoList = todoList.filter((item) => item.id !== id);

    const totalTasks = todoList.length;
    const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if ((todoList.filter((task) => !task.completed).length === 0 && currentTab==='active' || todoList.length === 0) ) {
      currentTab = "all";
      allStyles();
      currentPage=1
    }
    if ((todoList.filter((task) => task.completed).length === 0 && currentTab==='completed') ) {
     
      currentTab = "all";
      allStyles();
      currentPage=1
    }
    if (todoList.filter((task) => task.completed).length === 0) {
      checkAll.checked = false
    }
    updateDisplayedTasks();
    createPagination(totalTasks);
    updateCounters();
  };

  const checkAllTasks = () => {
    if (todoList.length !== 0) {
      todoList.forEach((item) => (item.completed = checkAll.checked));
    currentTab = "all";
    allStyles();
    updateDisplayedTasks();

    updateCounters();
    }else {
      checkAll.checked = false;
    }
    
  };

  const delCompleted = () => {
    if (todoList.some((item) => item.completed)) {
      todoList = todoList.filter((item) => !item.completed);

      currentTab = "all";
      currentPage = 1;
      allStyles();
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
      (event.keyCode === ENTER_BUTTON ||
      event.type === "blur") && event.target.matches(".input-edit")
    ) {
      const newText = event.target.value
      .trim()
        .replace(/ {2,}/g, " ")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        if (newText.length !==0) {
          editTask(id, newText);
          updateDisplayedTasks();
        }else {
          editTask(id, todoList.find((task) => task.id === id).text);
          updateDisplayedTasks();
        }
      
    }
    if (event.keyCode === ESCAPE_BUTTON) {
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

    if (event.target.matches(".task-text") && event.detail === DETAIL_TWO) {
      event.target.hidden = "false";
      event.target.nextElementSibling.hidden = "";
      event.target.nextElementSibling.focus();
    }
  };

  const updateDisplayedTasks = () => {
    let filteredList = [];
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
  const allStyles = () => {
    tabs.forEach((item) => item.classList.remove("active-tab"));
    showAll.classList.add("active-tab");
  };
  const createPagination = (totalTasks) => {
    const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);
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
})();
