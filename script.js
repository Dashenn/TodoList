

let todoList = []
const input = document.querySelector('.input-new-task')
const addButton = document.querySelector('.task-add')
const checkAll = document.querySelector('.all-check')
const deleteCompleted = document.querySelector('.delete-all-completed')
const todoContainer = document.querySelector('.todo-container')
const spanAll = document.querySelector('.all')
const spanActive = document.querySelector('.active')
const spanCompleted = document.querySelector('.completed')
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
        updateCounters()
   
}
const createList = (list) => {
    const taskList = document.querySelector('.task-list')
    taskList.innerHTML = ''
    list.forEach(item => {
        const task = `
            <li data-id="${item.id}">
            <div class='task-item'> 
                <input type="checkbox" name="check" class="check" ${item.completed ? 'checked' : ''}>
                <p class="task-text">${item.text}</p>
                <input type='text' class='input-edit no-visible' value='${item.text}'/>
                <button class="task-delete">Удалить</button>
                </div>
            </li>
        `
        taskList.innerHTML += task
    })
    updateCounters()
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
    updateCounters()
}

const checkAllTasks = (checked) => {
    todoList.forEach(item => item.completed = checked)
    createList(todoList)
    updateCounters()
}

const delCompleted = () => {
    todoList = todoList.filter(item => !item.completed);
    createList(todoList);
    updateCounters()
};

const editTask = (id, newText) => {
    todoList.forEach(task => {
        if (task.id === id) {
            task.text = newText;
        }
    });
    createList(todoList);
}

const updateCounters = () => {
    const totalCount = todoList.length
    const completedCount = todoList.filter(task => task.completed).length
    const activeCount = totalCount - completedCount
    spanAll.textContent = `All (${totalCount})`
    spanCompleted.textContent = `Completed (${completedCount})`
    spanActive.textContent = `Active (${activeCount})`
    
}



const changeTask = (event) => {
    

    if (event.target === addButton || (event.type === 'keyup' && event.key === 'Enter')) {
        addTask();
    } 
    if (event.target.matches('.check')) {
        let id = parseInt(event.target.parentNode.parentNode.dataset.id)
        updateTaskStatus(id, event.target.checked)
    } 
    if (event.target.matches('.task-delete')) {
        let id = parseInt(event.target.parentNode.parentNode.dataset.id)
        removeTask(id)
    } 
    if (event.target=== checkAll) {
        checkAllTasks(event.target.checked)
    } 
    if (event.target === deleteCompleted) {
        delCompleted()
    }
    if (event.target.matches('.task-text') &&event.type === 'dblclick') {
        const listItem = event.target.parentNode.parentNode;
        const editInput = listItem.querySelector('.input-edit')
        const taskText = listItem.querySelector('.task-text')
        editInput.classList.remove('no-visible')
        editInput.classList.add('visible')
        taskText.classList.add('no-visible')
        
    }
    if (event.type === 'blur' && event.target.matches('.input-edit')) {
        const listItem = event.target.parentNode.parentNode
        const newText = event.target.value
        const id = parseInt(listItem.dataset.id)
        if (newText) {
            editTask(id, newText)
        } else {
       
            event.target.value = todoList.find(task => task.id === id).text
        }
        createList(todoList)
    }
    if (event.type === 'keyup' && event.key === 'Enter' && event.target.matches('.input-edit')) {
        event.target.blur()
    }

    if (event.type === 'keyup' && event.key === 'Escape' && event.target.matches('.input-edit')) {
        const listItem = event.target.parentNode.parentNode
        const editInput = listItem.querySelector('.input-edit')
        const taskText = listItem.querySelector('.task-text')
        editInput.classList.add('no-visible')
        editInput.classList.remove('visible')
        taskText.classList.remove('no-visible')
        editInput.value = taskText.textContent
    }
    if (event.target === spanAll) {
        createList(todoList)
        updateCounters()
    }
    if (event.target === spanActive) {
        todoListActive = todoList.filter(item => item.completed === false)
        createList(todoListActive)
        updateCounters()
    }
    if (event.target === spanCompleted) {
        todoListB = todoList.filter(item => item.completed === true)
        createList(todoListB)
        updateCounters()
    }
};


todoContainer.addEventListener('click', changeTask)
todoContainer.addEventListener('dblclick', changeTask)
todoContainer.addEventListener('keyup', changeTask)
todoContainer.addEventListener('blur', changeTask, true)
input.addEventListener('keyup', changeTask)
