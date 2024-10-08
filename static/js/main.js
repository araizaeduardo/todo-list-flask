let tasks = [];

function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            renderAllTasks();
        });
}

function renderAllTasks() {
    document.getElementById('pendingTaskList').innerHTML = '';
    document.getElementById('inProgressTaskList').innerHTML = '';
    document.getElementById('completedTaskList').innerHTML = '';
    document.getElementById('archivedTaskList').innerHTML = '';
    
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const li = createTaskElement(task);
    const taskList = document.getElementById(task.status + 'TaskList');
    taskList.appendChild(li);
    updateTaskButtons(li, task.status);
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.dataset.taskId = task.id;
    
    const taskInfo = document.createElement('div');
    taskInfo.innerHTML = `
        <strong>${task.text}</strong><br>
        <small>Creada: ${new Date(task.createdDate).toLocaleDateString()}</small><br>
        <small>Fecha límite: <span class="due-date">${new Date(task.dueDate).toLocaleDateString()}</span></small>
        ${task.completedDate ? `<br><small>Completada: ${new Date(task.completedDate).toLocaleDateString()}</small>` : ''}
    `;
    li.appendChild(taskInfo);
    
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group btn-group-sm mt-2 d-flex flex-wrap';
    li.appendChild(btnGroup);
    
    return li;
}

function updateTaskButtons(li, status) {
    const btnGroup = li.querySelector('.btn-group');
    btnGroup.innerHTML = '';
    
    if (status === "pending") {
        addButton(btnGroup, "Iniciar", "btn-primary", () => moveTask(li, "inProgress"));
        addButton(btnGroup, "Editar Fecha", "btn-info", () => editDueDate(li));
    } else if (status === "inProgress") {
        addButton(btnGroup, "Completar", "btn-success", () => moveTask(li, "completed"));
        addButton(btnGroup, "Volver a Pendiente", "btn-warning", () => moveTask(li, "pending"));
        addButton(btnGroup, "Editar Fecha", "btn-info", () => editDueDate(li));
    } else if (status === "completed") {
        addButton(btnGroup, "Volver a En Proceso", "btn-warning", () => moveTask(li, "inProgress"));
        addButton(btnGroup, "Archivar", "btn-secondary", () => moveTask(li, "archived"));
    } else if (status === "archived") {
        addButton(btnGroup, "Volver a Completado", "btn-success", () => moveTask(li, "completed"));
        addButton(btnGroup, "Clonar a Pendientes", "btn-info", () => cloneTaskToPending(li));
    }
    
    if (status !== "archived") {
        addButton(btnGroup, "Eliminar", "btn-danger", () => deleteTask(li));
    }
}

function addButton(btnGroup, text, className, onClick) {
    const button = document.createElement('button');
    button.className = `btn ${className} btn-sm me-1 mb-1`;
    button.innerHTML = text;
    button.onclick = onClick;
    btnGroup.appendChild(button);
}

function addTaskFromInput() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    if (taskInput.value.trim() !== '' && dueDateInput.value) {
        addTask(taskInput.value.trim(), dueDateInput.value);
        taskInput.value = '';
        dueDateInput.value = '';
    } else {
        alert("Por favor, ingrese tanto el texto de la tarea como la fecha límite.");
    }
}

function addTask(taskText, dueDate, status = "pending") {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: taskText,
            dueDate: dueDate,
            status: status
        }),
    })
    .then(response => response.json())
    .then(data => {
        loadTasks();
    });
}

function moveTask(li, newStatus) {
    const taskId = li.dataset.taskId;
    fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
        }),
    })
    .then(() => {
        loadTasks();
    });
}

function deleteTask(li) {
    const taskId = li.dataset.taskId;
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(() => {
        loadTasks();
    });
}

function editDueDate(li) {
    const taskId = li.dataset.taskId;
    const task = tasks.find(t => t.id.toString() === taskId);
    const currentDueDate = new Date(task.dueDate);
    
    const newDueDate = prompt("Ingrese la nueva fecha de vencimiento (YYYY-MM-DD):", currentDueDate.toISOString().split('T')[0]);
    
    if (newDueDate && !isNaN(new Date(newDueDate))) {
        fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dueDate: newDueDate
            }),
        })
        .then(() => {
            loadTasks();
        });
    } else if (newDueDate !== null) {
        alert("Fecha inválida. Por favor, use el formato YYYY-MM-DD.");
    }
}

function toggleArchive() {
    const archiveList = document.getElementById('archivedTaskList');
    const toggleBtn = document.getElementById('toggleArchiveBtn');
    if (archiveList.style.display === 'none') {
        archiveList.style.display = 'block';
        toggleBtn.textContent = 'Ocultar Archivo';
    } else {
        archiveList.style.display = 'none';
        toggleBtn.textContent = 'Mostrar Archivo';
    }
}

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTaskFromInput();
    }
});

document.getElementById('searchInput').addEventListener('input', searchTasks);

function searchTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    tasks.forEach(task => {
        const li = document.querySelector(`li[data-task-id="${task.id}"]`);
        if (li) {
            if (task.text.toLowerCase().includes(searchTerm)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        }
    });
}

function cloneTaskToPending(li) {
    const taskId = li.dataset.taskId;
    const task = tasks.find(t => t.id.toString() === taskId);
    const today = new Date().toISOString().split('T')[0];
    addTask(task.text, today, "pending");
}

window.onload = loadTasks;