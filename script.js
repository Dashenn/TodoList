const todoList = [];
const input = document.querySelector('input[name=task]')
const addButton = document.querySelector('.task-add')
let idCount = 1;

const  addTask = () => {
    
    const newTask = {
        id: idCount++,
        text: input.value,
        completed: false
    }
    input.value=''
    todoList.push(newTask)
    createList(todoList)
}
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addTask()
    }})
addButton.addEventListener('click', addTask)
console.log(todoList)

const createList = (list) => {
    const taskList = document.querySelector('.task-list')
    taskList.innerHTML = ''
    list.forEach(item => {
     
        const task = `
        <li>
            <input type="checkbox" name='check' class='check'>
            <p class="task-text">${item.text}</p>
            <button class="task-delete">Delete</button>
        </li>
    `
    taskList.insertAdjacentHTML('beforeend', task)
    })
}

createList(todoList)

const checkAll = document.querySelector('.all')

const check = () => {
    const checkAllTask = [...document.querySelectorAll('.check')]
    checkAllTask.forEach(item => {
        item.checked = checkAll.checked
    })
}
checkAll.addEventListener('change', check)


