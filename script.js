let todoList = [];
const input = document.querySelector('input[name=task]')
const addButton = document.querySelector('.task-add')
let idCount = 1;

const  addTask = () => { //добавление таска в массив
    
    const newTask = {
        id:Date.now(),
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

const updateTaskStatus = () => {      //чекбоксы
    const checkboxes = document.querySelectorAll('.check');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let id = parseInt(checkbox.parentNode.dataset.id);
            todoList.forEach(task => {
                if (task.id === id) {
                    task.completed = checkbox.checked;
                }
            });
        });
    });
};


const addDel = () => {
    const buttonDel = document.querySelectorAll('.task-delete')
    buttonDel.forEach(item => {
        item.addEventListener('click', () => {
            let id = parseInt(item.parentNode.dataset.id)
            console.log(id)
            removeTask(id)
        })
    })
}
const createList = (list) => {
    const taskList = document.querySelector('.task-list')
    taskList.innerHTML = ''
    list.forEach(item => {
     
        const task = `
        <li data-id=${item.id}>
            <input type="checkbox" name='check' class='check'>
            <p class="task-text">${item.text}</p>
            <button class="task-delete">Delete</button>
        </li>
    `
    taskList.innerHTML += task
    })
    addDel()
    updateTaskStatus();
}

//createList(todoList)

const checkAll = document.querySelector('.all')

const check = () => {
    const checkAllTask = [...document.querySelectorAll('.check')]
    checkAllTask.forEach(item => {
        item.checked = checkAll.checked
    })
}
checkAll.addEventListener('change', check)



const removeTask = (id) => {
    todoList = todoList.filter(item => item.id !== id)
    createList(todoList)
}




const btnDelCompl = document.querySelector('.delete-all-completed');
const delCompleted = () => {
    todoList = todoList.filter(item => !item.completed);
    createList(todoList);
};
btnDelCompl.addEventListener('click', delCompleted); 



