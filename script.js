let todoList = []
const input = document.querySelector('.input-new-task')
const addButton = document.querySelector('.task-add')
const checkAll = document.querySelector('.all-check')
const deleteCompleted = document.querySelector('.delete-all-completed')
const addTask = () => { 
    if (input.value === '') {
        return 
    }
        const newTask = {
            id: Date.now(),
            text: input.value,
            completed: false
        };
        input.value = ''
        todoList.push(newTask)
        createList(todoList)

   
}
const createList = (list) => {
    const taskList = document.querySelector('.task-list')
    taskList.innerHTML = ''
    list.forEach(item => {
        const task = `
            <li data-id="${item.id}">
                <input type="checkbox" name="check" class="check" ${item.completed}>
                <p class="task-text">${item.text}</p>
                <button class="task-delete">Удалить</button>
            </li>
        `
        taskList.innerHTML += task
    })
}

const updateTaskStatus = (id, checked) => {
    todoList.forEach(task => {
        if (task.id === id) {
            task.completed = checked
        }
    });
    createList(todoList)
}

const removeTask = (id) => {
    todoList = todoList.filter(item => item.id !== id)
    createList(todoList)
}

const checkAllTasks = (checked) => {
    todoList.forEach(item => item.completed = checked)
    createList(todoList)
}

const delCompleted = () => {
    todoList = todoList.filter(item => !item.completed);
    createList(todoList);
};

const changeTask = (event) => {
    

    if (event.target === addButton || (event.type === 'keyup' && event.key === 'Enter')) {
        addTask();
    } 
    if (event.target.matches('.check')) {
        let id = parseInt(event.target.parentNode.dataset.id);
        updateTaskStatus(id, event.target.checked);
    } 
    if (event.target.matches('.task-delete')) {
        let id = parseInt(event.target.parentNode.dataset.id);
        removeTask(id);
    } 
    if (event.target=== checkAll) {
        checkAllTasks(event.target.checked);
    } 
    if (event.target === deleteCompleted) {
        delCompleted();
    }
};


document.addEventListener('click', changeTask);
document.addEventListener('keyup', changeTask);
