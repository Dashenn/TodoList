(function () {
  const input = document.querySelector(".input-new-task");
  const addButton = document.querySelector(".task-add");
  const checkAll = document.querySelector(".all-check");
  const deleteCompleted = document.querySelector(".delete-all-completed");
  const tabs = document.querySelectorAll(".tab");
  const tabsContainer = document.querySelector(".tabs");
  const showAll = document.querySelector("#all");
  const showActive = document.querySelector("#active");
  const showCompleted = document.querySelector("#completed");
  const taskList = document.querySelector(".task-list");
  const paginationContainer = document.querySelector(".pagination");
  const modal = document.getElementById("error-modal");
  const closeBtn = document.querySelector(".close");
  const errorMessageElem = document.getElementById("error-message");

  const URL = "http://localhost:3000/todos";
  const TASKS_PER_PAGE = 5;
  const ENTER_BUTTON = 13;
  const DETAIL_TWO = 2;
  const ESCAPE_BUTTON = 27;
  const contentType = "application/json";

  let todoList = [];
  let currentTab = "all";
  let currentPage = 1;
  let totalPages = 1;

  const validationText = (text) => {
    return _.escape(text.trim().replace(/s+/g, " "));
  };

  const addTask = () => {
    const text = input.value.trim();
    if (text === "") {
      return;
    }

    input.value = "";
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: JSON.stringify({ text: text }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error creating task");
        }
        return res.json();
      })
      .then((createdTask) => {
        currentTab = "all";
        allStyles();
        createdTask.text = validationText(createdTask.text);

        todoList.push(createdTask);
        checkAll.checked = false;

        const totalTasks = todoList.length;
        calculationTotalPage(totalTasks);

        if (currentPage < totalPages) {
          currentPage = totalPages;
        }

        updateCounters();
        updateDisplayedTasks();
      })
      .catch((error) => {
        showErrorModal(error.message);
      });
  };

  const calculationTotalPage = (totalTasks) => {
    totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);
    return totalPages;
  };

  const inputAdd = (event) => {
    if (event.keyCode === ENTER_BUTTON) {
      addTask();
    }
  };
  const createPagination = (totalTasks) => {
    totalPages = calculationTotalPage(totalTasks);
    if (totalPages === 0) {
      totalPages = 1;
    }
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = `
        <button class='page-button ${
          i === currentPage ? "active-page-button" : ""
        }' data-id="${i}">${i}</button>
        `;
      paginationContainer.innerHTML += pageButton;
    }
  };
  const updateCounters = () => {
    const totalCount = todoList.length;
    const completedCount = todoList.filter((task) => task.isCompleted).length;
    const activeCount = totalCount - completedCount;
    showAll.textContent = `All (${totalCount})`;
    showCompleted.textContent = `Completed (${completedCount})`;
    showActive.textContent = `Active (${activeCount})`;
  };
  const getTasks = async () => {
    await fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting tasks");
        }
        return response.json();
      })
      .then((tasks) => {
        tasks.forEach((item) => {
          item.text = validationText(item.text);
        });
        todoList = tasks;

        createList(tasks);

        if (tasks.every((item) => item.isCompleted) && tasks.length !== 0) {
          checkAll.checked = true;
        }
      })
      .catch((error) => {
        showErrorModal(error.message);
      });
  };

  const createList = async (list) => {
    taskList.innerHTML = "";
    const start = (currentPage - 1) * TASKS_PER_PAGE;
    const end = start + TASKS_PER_PAGE;
    const paginatedList = list.slice(start, end);

    paginatedList.forEach((item) => {
      const task = `<li data-id="${item.id}">
                <div class='task-item'> 
                    <input type="checkbox" class="check" ${
                      item.isCompleted ? "checked" : ""
                    }>
                    <p class="task-text">${item.text}</p>
                    <input type='text' class='input-edit' hidden="hidden" maxlength="255" value='${
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

  const resetTabs = () => {
    currentTab = "all";
    allStyles();
    currentPage = 1;
  };

  const updateTaskStatus = (id, checked) => {
    todoList.forEach((item) => {
      if (item.id == id) {
        fetch(`${URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": contentType },
          body: JSON.stringify({ isCompleted: !item.isCompleted }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update task");
            }
            return response.json();
          })
          .then(() => {
            item.isCompleted = checked;
            const filteredList = todoList.filter((task) => {
              if (currentTab === "active") return !task.isCompleted;
              if (currentTab === "completed") return task.isCompleted;
              return true;
            });

            // if (filteredList.length === 0) {
            //   resetTabs();
            // }
            checkAll.checked = todoList.every((item) => item.isCompleted);
            calculationTotalPage(filteredList.length);
            if (currentPage > totalPages && currentPage > 1) {
              currentPage--;
            }
            updateDisplayedTasks();
          })
          .catch((error) => {
            getTasks();
            showErrorModal(error.message);
          });
      }
    });
  };

  const removeTask = async (id) => {
    await fetch(`${URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": contentType,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }
        return response.text();
      })
      .then(() => {
        todoList = todoList.filter((item) => item.id != id);
        const filteredList = todoList.filter((task) => {
          if (currentTab === "active") return !task.isCompleted;
          if (currentTab === "completed") return task.isCompleted;
          return true;
        });
        //   if (filteredList.length === 0) {
        //   resetTabs();
        // }
        if (todoList.length === 0) {
          checkAll.checked = false;
          // resetTabs();
        }
        if (
          todoList.every((item) => item.isCompleted) &&
          todoList.length !== 0
        ) {
          checkAll.checked = true;
        }
        calculationTotalPage(filteredList.length);
        if (currentPage > totalPages && currentPage > 1) {
          currentPage--;
        }
        updateDisplayedTasks();
        updateCounters();
        console.log(id);
      })

      .catch((error) => {
        console.log(id);
        getTasks();
        showErrorModal(error.message);
      });
  };

  const checkAllTasks = async (event) => {
    event.preventDefault();
    if (todoList.length !== 0) {
      const isCompleted = checkAll.checked;
      await fetch(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": contentType,
        },
        body: JSON.stringify({ isCompleted }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update all tasks");
          }
          return response.text();
        })
        .then((result) => {
          if (isCompleted) {
            checkAll.checked = true;
          } else {
            checkAll.checked = false;
          }
          todoList.forEach((item) => (item.isCompleted = isCompleted));
          updateDisplayedTasks();
          updateCounters();
        })
        .catch((error) => {
          showErrorModal(error.message);
        });
    } else {
      checkAll.checked = false;
    }
  };

  const delCompleted = async () => {
    if (todoList.some((item) => item.isCompleted)) {
      fetch(`${URL}/delCompleted`, {
        method: "DELETE",
        headers: {
          "Content-Type": contentType,
        },
      })
        .then((responce) => {
          if (!responce.ok) {
            throw new Error("Failed to delete task");
          }
          return responce.text();
        })
        .then(() => {
          todoList = todoList.filter((item) => !item.isCompleted);
          delList = todoList.filter((item) => item.isCompleted);
          resetTabs();
          checkAll.checked = false;
          updateDisplayedTasks();
          updateCounters();
        })
        .catch((error) => {
          showErrorModal(error.message);
        });
    }
  };

  const editTask = async (id, newText) => {
    const task = todoList.find((task) => task.id == id);

    if (task) {
      await fetch(`${URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": contentType },
        body: JSON.stringify({ text: newText }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to edit task");
          }
          return response.json();
        })
        .then(() => {
          isUpdating = false;
          task.text = newText;
          updateDisplayedTasks();
          updateCounters();
        })
        .catch((error) => {
          getTasks();
          showErrorModal(error.message);
        });
    } else {
      showErrorModal("Task not found");
    }
  };

  let isUpdating = false;
  const editDone = (event) => {
    if (isUpdating) return;
    const listItem = event.target.parentNode.parentNode;
    const id = parseInt(listItem.dataset.id);
    if (
      (event.keyCode === ENTER_BUTTON || event.type === "blur") &&
      event.target.matches(".input-edit")
    ) {
      const task = todoList.find((task) => task.id == id);
      const oldText = task.text;
      const newText = validationText(event.target.value);
      if (newText.length !== 0 && newText !== oldText) {
        isUpdating = true;
        editTask(id, newText);
        updateDisplayedTasks();
      } else {
        updateDisplayedTasks();
      }
    }
    if (event.keyCode === ESCAPE_BUTTON) {
      event.target.value = todoList.find((task) => task.id == id).text;
      event.target.hidden = "false";
      event.target.nextElementSibling.hidden = "";
    }
  };

  const changeTask = (event) => {
    if (event.target.matches(".check")) {
      let id = parseInt(event.target.parentNode.parentNode.dataset.id);
      event.preventDefault();
      updateTaskStatus(id, event.target.checked);
    }
    if (event.target.matches(".task-delete")) {
      let id = parseInt(event.target.parentNode.parentNode.dataset.id);
      removeTask(id);
    }
    if (event.target.matches(".task-text") && event.detail === DETAIL_TWO) {
      event.target.hidden = "true";
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
        filteredList = todoList.filter((task) => !task.isCompleted);
        break;
      case "completed":
        filteredList = todoList.filter((task) => task.isCompleted);
        break;
    }
    createList(filteredList);
  };

  const switchTabs = (event) => {
    if (!event.target.matches(".tabs")) {
      currentTab = event.target.id;
      currentPage = 1;
      updateDisplayedTasks();
      tabs.forEach((item) => item.classList.remove("active-tab"));
      event.target.classList.add("active-tab");
    }
  };

  const allStyles = () => {
    tabs.forEach((item) => item.classList.remove("active-tab"));
    showAll.classList.add("active-tab");
  };

  const paginationButtonClick = (event) => {
    if (event.target.matches(".page-button")) {
      currentPage = parseInt(event.target.dataset.id);
      updateDisplayedTasks();
    }
  };

  const showErrorModal = (message) => {
    errorMessageElem.textContent = message;
    modal.style.display = "block";
  };

  const closeModal = () => {
    modal.style.display = "none";
  };
  const close = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };

  taskList.addEventListener("click", changeTask);
  taskList.addEventListener("keyup", editDone);
  taskList.addEventListener("blur", editDone, true);
  input.addEventListener("keyup", inputAdd);
  addButton.addEventListener("click", addTask);
  checkAll.addEventListener("click", checkAllTasks);
  deleteCompleted.addEventListener("click", delCompleted);
  tabsContainer.addEventListener("click", switchTabs);
  paginationContainer.addEventListener("click", paginationButtonClick);
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("load", getTasks);
  window.addEventListener("click", close);
})();
