const input = document.querySelector('.input-new-task')
const addButton = document.querySelector('.task-add')
const checkAll = document.querySelector('.all-check')
const deleteCompleted = document.querySelector('.delete-all-completed')
const todoContainer = document.querySelector('.todo-container')
const tabs = document.querySelectorAll('.tab')
const showAll = document.querySelector('#all')
const showActive = document.querySelector('#active')
const showCompleted = document.querySelector('#completed')
const taskList = document.querySelector('.task-list')
let todoList = []
let currentTab = 'all'

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
        checkAll.checked=false
        updateCounters()
        updateDisplayedTasks(currentTab)
   
}
const inputAdd = (event) => {
    if (event.key === 'Enter') {
        addTask()
    }
}
const createList = (list) => {
    
    taskList.innerHTML = ''
    list.forEach(item => {
        const task = `
            <li data-id="${item.id}">
            <div class='task-item'> 
                <input type="checkbox"  class="check" ${item.completed ? 'checked' : ''}>
                <p class="task-text" >${item.text} </p>
                <input type='text' class='input-edit ' hidden="hidden" value='${item.text}'/>
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
    updateDisplayedTasks()

}

const removeTask = (id) => {
    todoList = todoList.filter(item => item.id !== id)
    updateDisplayedTasks()
    updateCounters()
}

const checkAllTasks = () => {
    todoList.forEach(item => item.completed = checkAll.checked)
    updateDisplayedTasks()
    updateCounters()

}

const delCompleted = () => {
    todoList = todoList.filter(item => !item.completed);
    updateDisplayedTasks()
    checkAll.checked=false
    updateCounters()
};

const editTask = (id, newText) => {
    todoList.forEach(task => {
        if (task.id === id) {
            task.text = newText;
        }
    });
 
}

const updateCounters = () => {
    const totalCount = todoList.length
    const completedCount = todoList.filter(task => task.completed).length
    const activeCount = totalCount - completedCount
    showAll.textContent = `All (${totalCount})`
    showCompleted.textContent = `Completed (${completedCount})`
    showActive.textContent = `Active (${activeCount})`
    
}

const editDone = (event) => {
    const listItem = event.target.parentNode.parentNode
    const id = parseInt(listItem.dataset.id)
    if (event.key === 'Enter' || event.type==='blur') {
        const newText = event.target.value
        editTask(id, newText)
        updateDisplayedTasks()
    }
    if (event.key === 'Escape') {
        event.target.value = todoList.find(task => task.id === id).text
        event.target.hidden = 'false';
        event.target.nextElementSibling.hidden = '';
    }
}



const changeTask = (event) => {
    
    if (event.target.matches('.check')) {
        let id = parseInt(event.target.parentNode.parentNode.dataset.id)
        updateTaskStatus(id, event.target.checked)
        console.log(event.target);
       
    } 
    if (event.target.matches('.task-delete')) {
        let id = parseInt(event.target.parentNode.parentNode.dataset.id)
        removeTask(id)
    } 
    
    if (event.target.matches('.task-text')  && event.detail === 2) {
        event.target.hidden = 'false'
        event.target.nextElementSibling.hidden = ''
        event.target.nextElementSibling.focus()
        
      }
}
  
const updateDisplayedTasks = () => {
    let filteredList = []
    switch(currentTab) {
        case 'all':
            filteredList = todoList;
            break
        case 'active':
            filteredList = todoList.filter(task => !task.completed)
            break
        case 'completed':
            filteredList = todoList.filter(task => task.completed)
            break
    }
    createList(filteredList);
}
const switchTabs = (event) => {
   
    currentTab = event.target.id
    updateDisplayedTasks(currentTab)
    tabs.forEach(item => item.classList.remove('active-tab'))
    event.target.classList.add('active-tab')

}






taskList.addEventListener('click', changeTask)
taskList.addEventListener('keyup', editDone)
taskList.addEventListener('blur', editDone, true)
input.addEventListener('keyup', inputAdd)
addButton.addEventListener('click', addTask)
checkAll.addEventListener('click', checkAllTasks)
deleteCompleted.addEventListener('click', delCompleted)
tabs.forEach(item => item.addEventListener('click', switchTabs))
