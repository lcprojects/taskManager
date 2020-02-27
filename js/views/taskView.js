import UI from "./../UIElements.js";

export const renderTask = (task) => {
    return `
        <div class="task ${task.state}" data-taskId=${task.id} draggable="true">
            <div class="task-body">
                ${task.description.replace(/\s/gi, '&nbsp;')}
            </div>
            <div class="task-toolbar">
                <div class="tooltip">
                    <div class="toolbar-btn change-status change-status--js">
                        ${task.state === 'todo' || task.state === 'wip' ? '<i class="fas fa-check"></i><span class="tooltiptext">Change to Completed</span>' : 
                                                  '<i class="fas fa-square change-status-completed"></i><span class="tooltiptext">Task is Completed</span>' }
                    </div>
                </div>
                <div class="tooltip">
                    <div class="toolbar-btn edit edit--js">
                        <i class="far fa-edit"></i><span class="tooltiptext">Edit</span>
                    </div>
                </div>
                <div class="tooltip">
                    <div class="toolbar-btn delete delete-task--js">
                        <i class="fas fa-trash"></i><span class="tooltiptext">Delete</span>
                    </div>
                </div>
            </div>
            <div class="task-footer">
                <div class="priority ${task.priority} set-priority--js">${task.priority}</div>
                ${[task.labels.length > 0 ? '<div class="task-footer-separator"></div>' : ''].concat(task.labels.map(el => `
                    <div class="label ${el}" data-labelName="${el}">${el}</div>
                `)).join('')}
                <div class="task-footer-separator"></div>
                ${task.duration ? `<div class="duration"><i class="far fa-clock"></i>${displayDuration(task.duration)}</div>` : ''}
                <div class="time-elapsed ${task.elapsedTime < task.duration || !task.duration ? 'under': 'over'} start--js"><i class="fa fa-play"></i> ${task.elapsedTime ? displayElapsedTime(task.elapsedTime) : '00:00:00'}</div>
            </div>
        </div>
    `;
}

export const removeTask = (taskId, columnId) => {
    document.querySelector(`.column[data-columnId="${columnId}"] .task[data-taskId="${taskId}"]`).remove();
}

export const renderNewTask = (task, columnId) => {
    const taskHTML = renderTask(task);

    document.querySelector(`.column[data-columnId="${columnId}"] ` + UI.projectNewTask).insertAdjacentHTML('beforebegin', taskHTML);
}

export const removeNewTask = (columnId) => {
    const el = document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectNewTask}`)

    el.closest(UI.projectNewTask).querySelector('textarea').value = '';
    el.closest(UI.projectNewTask).querySelectorAll('.duration').forEach((el) => el.remove());
    el.closest(UI.projectNewTask).classList.remove('show');
    el.closest(UI.projectNewTask).querySelector('.set-new-priority--js').outerHTML = '<div class="priority normal set-new-priority--js">normal</div>';
    el.closest(UI.projectNewTask).querySelectorAll(UI.projectTaskLabel).forEach((el) => el.remove());
    el.closest(UI.projectNewTask).nextElementSibling.classList.toggle('hide');
}

export const renderPriority = (priority, taskId, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"] .set-priority--js`).outerHTML = `<div class="priority ${priority} set-priority--js">${priority}</div>`;
}

export const renderNewTaskPriority = (priority, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .set-new-priority--js`).outerHTML = `<div class="priority ${priority} set-new-priority--js">${priority}</div>`;
}

export const toggleAddLabel = (columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label-input`).classList.toggle('show');
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label--js`).classList.toggle('hide');
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label-input`).value = '';
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label-input`).focus();
}

export const renderNewLabel = (columnId) => {
    const addLabelInputEl = document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label-input`);
    
    addLabelInputEl.classList.toggle('show');
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-label--js`).classList.toggle('hide');;
    
    if (addLabelInputEl.value !== '') {
        addLabelInputEl.insertAdjacentHTML('beforebegin', '<div class="label pointer ' + addLabelInputEl.value.replace(' ', '-') + '" data-labelName="' + addLabelInputEl.value + '">' + addLabelInputEl.value + '</div>');
    }
    addLabelInputEl.value = '';
}

export const removeLabel = (labelName, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectNewTask} ${UI.projectTaskLabel}[data-labelName="${labelName}"]`).remove();
}

export const toggleSetTime = (columnId) => {
    const setTimeEl = document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .set-time--js`);
    const timeInput = document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-time-input`);
    
    if (timeInput.nextElementSibling.classList.contains('duration')) {
        timeInput.value = timeInput.nextElementSibling.textContent;
        timeInput.nextElementSibling.remove();
    }
    timeInput.classList.toggle('show');
    timeInput.focus();
    setTimeEl.classList.toggle('hide');
}


export const renderNewTime = (columnId) => {
    const timeInput = document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .add-time-input`);

    timeInput.previousElementSibling.classList.toggle('hide');
    timeInput.classList.toggle('show');

    if (timeInput.value !== '') {
        timeInput.insertAdjacentHTML('afterend', '<div class="duration"><i class="far fa-clock"></i>' + timeInput.value + '</div>');
    }

    timeInput.value = '';
}

export const changeState = (nextState, taskId, columnId) => {
    if (nextState === 'completed' || nextState === 'wip') {
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"] .change-status--js`).innerHTML = '<i class="fas fa-square change-status-completed"></i><span class="tooltiptext">Task is Completed</span>';
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.remove('todo');
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.remove('wip');
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.remove('completed');
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.add('completed');
    }
}

export const updateTask = (task, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${task.id}"]`).outerHTML = renderTask(task);
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] .edit-task--js`).remove();
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${task.id}"]`).classList.remove('hide');
}

export const updateElapsedTime = (elapsedTime, taskId, columnId, duration) => {
    if (elapsedTime >= duration && duration) {
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).querySelector('.time-elapsed').classList.remove('under');
        document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).querySelector('.time-elapsed').classList.add('over');
    }
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).querySelector('.time-elapsed').innerHTML = '<i class="fa fa-pause"></i> ' + displayElapsedTime(elapsedTime);
}

function pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length-size);
}

function displayElapsedTime(seconds) {   
    const hours = Math.trunc(seconds / 3600);
    const minutes = Math.trunc(seconds % 3600 / 60);
    const fseconds = Math.trunc(seconds % 3600 % 60);
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(fseconds, 2);
}

export const displayDuration = (seconds) => {
    const hours = Math.trunc(seconds / 3600);
    const minutes = Math.trunc(seconds % 3600 / 60);
    return pad(hours, 2) + ':' + pad(minutes, 2);
}

export const displayPlayBtn = (elapsedTime, taskId, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).querySelector('.time-elapsed').innerHTML = '<i class="fa fa-play"></i> ' + displayElapsedTime(elapsedTime);
}

export const setStateWIP = (taskId, columnId) => {
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.remove('todo');
    document.querySelector(`${UI.projectColumn}[data-columnId="${columnId}"] ${UI.projectTask}[data-taskId="${taskId}"]`).classList.add('wip');
}

export const toggleEditTask = (task, taskId, columnId) => {
    document.querySelector(UI.projectColumn + `[data-columnId="${columnId}"]` + ' ' + UI.projectTask + `[data-taskId="${taskId}"]`).classList.toggle('hide');

    const editTaskHTML = `
        <div class="new-task show edit-task--js" data-taskId="${task.id}">
            <div class="task-body m-0">
                <textarea name="" id="" cols="30" rows="5">${task.description.replace(/<br>/gi, '\n').replace(/&nbsp;/gi, ' ')}</textarea>
            </div>
            <div class="task-footer">
                <div class="priority ${task.priority} set-new-priority--js">${task.priority}</div>
                <div class="task-footer-separator"></div>
                ${task.labels.map(label => `<div class="label pointer ${label.replace(' ', '-')}" data-labelName="${label}">${label}</div>`).join('')}
                <input class="m-r-sm add-label-input">
                <div class="btn btn-xs m-r-sm add-label--js"><i class="fas fa-tag"></i></div>
                <a class="btn btn-xs m-r-sm set-time--js"><i class="fa fa-clock"></i></a>
                <input class="m-r-sm add-time-input">
                ${task.duration ? `<div class="duration"><i class="far fa-clock"></i> ${taskView.displayDuration(task.duration)}</div>` : ''}
                <a href="#" class="btn btn-xs m-l-a save-task--js"><i class="fa fa-plus"></i></a>
            </div>
        </div>
    `;

    document.querySelector(UI.projectColumn + `[data-columnId="${columnId}"]` + ' ' + UI.projectTask + `[data-taskId="${taskId}"]`).insertAdjacentHTML('beforebegin', editTaskHTML);
}