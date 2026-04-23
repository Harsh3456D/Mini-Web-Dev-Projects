document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');

    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        const taskDate = todoDate.value;
        if (taskText !== '' && taskDate !== '') {
            addTask(taskText, taskDate);
            todoInput.value = '';
            todoDate.value = '';
        }
    });

    function addTask(text, date) {
        const li = document.createElement('li');

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const infoDiv = document.createElement('div');
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = text;
        taskTextSpan.style.marginRight = '10px';

        const dateBadge = document.createElement('span');
        dateBadge.textContent = date;
        dateBadge.classList.add('date-badge');

        infoDiv.appendChild(taskTextSpan);
        infoDiv.appendChild(dateBadge);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', taskTextSpan.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskTextSpan.textContent = newText.trim();
            }
            const newDate = prompt('Edit date (YYYY-MM-DD):', dateBadge.textContent);
            if (newDate !== null && newDate.trim() !== '') {
                dateBadge.textContent = newDate.trim();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        taskContent.appendChild(infoDiv);
        taskContent.appendChild(actionsDiv);
        li.appendChild(taskContent);
        todoList.appendChild(li);
    }
});