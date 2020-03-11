import Task from './models/Task.js';
import Column from './models/Column.js';
import Project from './models/Project.js';

import * as projectView from './views/projectView.js';
import * as columnView from './views/columnView.js';
import * as taskView from './views/taskView.js';

import UI from './UIElements.js';

window.addEventListener('load', function() {
    window.onscroll = function(e) {
        document.querySelector('header').style.transform = 'translateX(' + window.pageXOffset + 'px)'
    }

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const state = {
        projects: [],
        currentProject: 0,
        nextProjectId: 0,
        timers: []
    }

    projectView.renderProjectNames(state.projects);
    
    document.querySelector(UI.projectNamesList).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectTab}, ${UI.projectTab} *`)) {
            state.currentProject = e.target.closest(UI.projectTab).dataset.projectid;
            window.scrollTo(0, 0);
            
            projectView.renderCurrentProject(state.projects[state.currentProject]);
        }
    });

    document.querySelector(UI.projectNamesList).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectAddBtn}, ${UI.projectAddBtn} *`)) {
            projectView.toggleCreateProjectPopup();
        }
    });
    
    document.querySelector('body').addEventListener('click', (e) => {
        if (e.target.matches('.close')) {
            e.target.closest('.popup-box').classList.add('hide');
        }
    });
    
    document.querySelector(UI.projectCreateBtn).addEventListener('click', (e) => {
        const name = document.querySelector(UI.projectName).value;
        const description = document.querySelector(UI.projectDescription).value;
        
        const newProject = new Project(state.nextProjectId, name, description);

        state.projects.push(newProject);
        state.currentProject = state.nextProjectId;
        state.nextProjectId++;

        projectView.toggleCreateProjectPopup();
        projectView.renderNewProjectName(newProject);
        projectView.renderCurrentProject(state.projects[state.currentProject]);
    });

    document.querySelectorAll(UI.projectNamesList).forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target.matches(`${UI.projectTab}, ${UI.projectTab} *`)) {
                const id = e.target.closest(UI.projectTab).dataset.projectid;

                projectView.selectActiveTab(id);
            }
        });
    });

    document.querySelector(UI.projectContent).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectAddColumnBtn}, ${UI.projectAddColumnBtn} *`)) {
            projectView.toggleNewColumnPopup();
        }
    });

    document.querySelector(UI.projectAddColumnPopup).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectCreateColumnBtn}, ${UI.projectCreateColumnBtn} *`)) {
            let id = 0;
            
            if (state.projects[state.currentProject].columns.length > 0) {
                id = Math.max(...state.projects[state.currentProject].columns.map(el => el.id)) + 1;
            }

            const columnName = document.querySelector(`${UI.projectAddColumnPopup} ${UI.projectColumnName}`).value;
            const newColumn = new Column(id, columnName);
            state.projects[state.currentProject].addColumn(newColumn);

            columnView.renderNewColumn(newColumn);
            projectView.toggleNewColumnPopup();
        }
    });

    document.querySelector(UI.projectAddColumnPopup).addEventListener('click', (e) => {
        if (e.target.matches('.close')) {
            projectView.toggleNewColumnPopup();
        }
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectAddTaskBtn}, ${UI.projectAddTaskBtn} *`)) {
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                
                projectView.toggleAddTask(columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectDeleteColumnBtn}, ${UI.projectDeleteColumnBtn} *`)) {
                const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
                
                state.projects[state.currentProject].deleteColumn(columnId);
this.console.log(columnId)
                columnView.removeColumn(columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectNewAddTaskBtn}, ${UI.projectNewAddTaskBtn} *`)) {
                e.preventDefault();

                const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);

                let categories = [];
                let duration = '';
                const description = e.target.closest(UI.projectNewTask).querySelector('textarea').value.replace(/\n/gi,'<br>').replace(/\s/gi, '&nbsp;');
                const priority = e.target.closest('.task-footer').querySelector('.priority').textContent;

                if (e.target.closest(UI.projectNewTask).querySelectorAll('.label').length > 0) {
                    categories = Array.from(e.target.closest(UI.projectNewTask).querySelectorAll('.label')).map((el) => { return el.textContent });
                }
                if (e.target.closest(UI.projectNewTask).querySelector('.duration')) {
                    duration = e.target.closest(UI.projectNewTask).querySelector('.duration').textContent.replace(' ', '');
                    const timeSplit = duration.split(':');
                    duration = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60;
                }
                if (description !== '') {
                    let taskId;
                    if (state.projects[state.currentProject].getColumnById(columnId).tasks.length > 0) {
                        taskId = makeid(20);
                    } else {
                        taskId = makeid(20);
                    }

                    const newTask = new Task(taskId, description, 'todo', priority, categories, duration, '00:00:00', 'Me', [], 'Not Set', []);
                    state.projects[state.currentProject].addTask(newTask, columnId);
    
                    taskView.renderNewTask(newTask, columnId);
                    taskView.removeNewTask(columnId);
                }
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectDeleteTask}, ${UI.projectDeleteTask} *`)) {
                const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
                const taskId = e.target.closest(UI.projectTask).dataset.taskid;

                state.projects[state.currentProject].deleteTask(taskId, columnId);
                
                const timerIndex = state.timers.findIndex(timer => timer.projectId === Number(state.currentProject) && timer.taskId === taskId && timer.columnId === columnId);
                if (timerIndex !== -1) {
                    this.clearInterval(state.timers[timerIndex].timer);
                    state.timers.splice(timerIndex, 1);
                }
                
                taskView.removeTask(taskId, columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectNewDeleteTask}, ${UI.projectNewDeleteTask} *`)) {
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;

                taskView.removeNewTask(columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectTaskPriority}, ${UI.projectTaskPriority} *`)) {
                let priority = '';

                if (e.target.classList.contains('low')) {
                    priority = 'normal';
                } else if (e.target.classList.contains('normal')) {
                    priority = 'high';
                } else if (e.target.classList.contains('high')) {
                    priority = 'critical';
                } else {
                    priority = 'low';
                }

                const taskId = e.target.closest(UI.projectTask).dataset.taskid;
                const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
                state.projects[state.currentProject].columns[columnId].getTaskById(taskId).setPriority(priority);
                
                taskView.renderPriority(priority, taskId, columnId);
            }
            if (e.target.matches(`${UI.projectNewTaskPriority}, ${UI.projectNewTaskPriority} *`)) {
                let priority = '';
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;

                if (e.target.classList.contains('low')) {
                    priority = 'normal';
                } else if (e.target.classList.contains('normal')) {
                    priority = 'high';
                } else if (e.target.classList.contains('high')) {
                    priority = 'critical';
                } else {
                    priority = 'low';
                }

                taskView.renderNewTaskPriority(priority, columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectAddLabel}, ${UI.projectAddLabel} *`)) {
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                
                taskView.toggleAddLabel(columnId);
            }
        });
    });
    
    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectNewTask} ${UI.projectTaskLabel}, ${UI.projectNewTask} ${UI.projectTaskLabel} *`)) {
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                const category = e.target.closest(UI.projectTaskLabel).dataset.labelname;

                taskView.removeLabel(category, columnId);
            }
        });
    });

    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.target.matches(UI.projectAddLabelInput)) {
                if (e.key == 'Enter') {
                    const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                    
                    taskView.renderNewLabel(columnId);
                }
                if (e.key == 'Escape') {
                    const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                    
                    taskView.toggleAddLabel(columnId);
                }
            }
        });
    });
    
    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.matches(`${UI.projectSetTaskTime}, ${UI.projectSetTaskTime} *`)) {
                const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                
                taskView.toggleSetTime(columnId);
            }
        });
    });
    
    document.querySelectorAll(UI.projectContent).forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.target.matches(UI.projectAddTimeInput)) {
                if (e.key == 'Enter') {
                    const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                    
                    taskView.renderNewTime(columnId);
                }
                if (e.key == 'Escape') {
                    const columnId = e.target.closest(UI.projectColumn).dataset.columnid;
                
                    taskView.toggleSetTime(columnId);
                }
            }
        });
    });

    document.querySelector(UI.projectContent).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectChangeTaskState}, ${UI.projectChangeTaskState} *`)) {
            const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
            const taskId = e.target.closest(UI.projectTask).dataset.taskid;
            
            const nextState = state.projects[state.currentProject].getTaskById(taskId, columnId).getNextState();
            
            if (nextState) {
                state.projects[state.currentProject].setTaskState(nextState, taskId, columnId);
                
                taskView.changeState(nextState , taskId, columnId);
            }
        }
    });

    document.querySelector(UI.projectSearch).addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        if (state.projects.length > 0) {
            if (query === '') {
                projectView.renderCurrentProject(state.projects[state.currentProject]);
            } else {
                const results = state.projects[state.currentProject].searchForTasks(query);

                projectView.renderCurrentProject(results);
            }
        }
    });

    document.querySelector(UI.projectContent).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectEditTask}, ${UI.projectEditTask} *`)) {
            const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
            const taskId = e.target.closest(UI.projectTask).dataset.taskid;

            const task = state.projects[state.currentProject].getTaskById(taskId, columnId);

            taskView.toggleEditTask(task, taskId, columnId);
        }
    });

    document.querySelector(UI.projectContent).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectSaveTask}, ${UI.projectSaveTask} *`)) {
            const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
            const taskId = e.target.closest(UI.projectNewTask).dataset.taskid;
            
            const description = e.target.closest(UI.projectNewTask).querySelector('textarea').value.replace(/\n/gi,'<br>');
            const priority = e.target.closest('.task-footer').querySelector('.priority').textContent;
            let categories = [];
            let duration = '';
            
            if (e.target.closest(UI.projectNewTask).querySelectorAll(UI.projectTaskLabel).length > 0) {
                categories = Array.from(e.target.closest(UI.projectNewTask).querySelectorAll(UI.projectTaskLabel)).map((el) => { return el.textContent });
            }
            if (e.target.closest(UI.projectNewTask).querySelector('.duration')) {
                duration = e.target.closest(UI.projectNewTask).querySelector('.duration').textContent.replace(' ', '');
                const timeSplit = duration.split(':');
                duration = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60;
            }
            
            if (description !== '') {
                
                const task = state.projects[state.currentProject].getTaskById(taskId, columnId);
                
                task.setDescription(description);
                task.setPriority(priority);
                task.setLabels(categories);
                task.setDuration(duration);
    
                taskView.updateTask(task, columnId);
            }
        }
    });

    document.querySelector(UI.projectContent).addEventListener('click', (e) => {
        if (e.target.matches(`${UI.projectTimerStart}, ${UI.projectTimerStart} *`)) {
            const columnId = Number(e.target.closest(UI.projectColumn).dataset.columnid);
            const taskId = e.target.closest(UI.projectTask).dataset.taskid;
            
            const task = state.projects[state.currentProject].getTaskById(taskId, columnId);
            let timerIndex;

            if ((timerIndex = state.timers.findIndex(timer => timer.projectId === Number(state.currentProject) && timer.columnId === columnId && timer.taskId === taskId && timer.state === 'running')) !== -1) {
                clearInterval(state.timers[timerIndex].timer);
                state.timers[timerIndex].state = 'paused';
                taskView.displayPlayBtn(task.elapsedTime, taskId, columnId);
            } else if ((timerIndex = state.timers.findIndex(timer => timer.projectId === Number(state.currentProject) && timer.columnId === columnId && timer.taskId === taskId && timer.state === 'paused')) !== -1) {
                state.timers[timerIndex].timer = this.setInterval(() => {
                    task.setElapsedTime(++task.elapsedTime);
                    if (Number(state.timers[timerIndex].projectId) === Number(state.currentProject)) {
                        taskView.updateElapsedTime(task.elapsedTime, taskId, columnId, task.duration);
                    }
                }, 1000);
                state.timers[timerIndex].state = 'running';
            } else if (state.timers.findIndex(timer => timer.projectId === Number(state.currentProject) && timer.columnId === columnId && timer.taskId === taskId) === -1) {
                const index = state.timers.length;
                const timer = this.setInterval(() => {
                    task.setElapsedTime(++task.elapsedTime);
                    if (Number(state.timers[index].projectId) === Number(state.currentProject)) {
                        taskView.updateElapsedTime(task.elapsedTime, taskId, state.timers[index].columnId, task.duration);
                    }
                }, 1000);
                state.timers.push({
                    projectId: state.currentProject,
                    columnId: columnId,
                    taskId: taskId,
                    timer: timer,
                    state: 'running'
                });
                taskView.setStateWIP(taskId, columnId);
            }
        }
    });

    let dragged;
    let startingColumn;

    document.addEventListener('dragstart', (e) => {
        if (e.target.matches('.task, .task *')) {
            e.target.closest('.task').style.opacity = 0.7;
            dragged = e.target.closest('.task');
            startingColumn = Number(e.target.closest('.column').dataset.columnid);
        }
    });

    document.addEventListener('dragover', (e) => {
        if (e.target.matches('.task, .task *')) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('dragend', (e) => {
        if (e.target.matches('.task, .task *')) {
            e.preventDefault();
            dragged.style.opacity = 1;
            document.querySelector('#quickDrop') ? document.querySelector('#quickDrop').remove() : null;
        }
    });

    document.addEventListener('dragenter', (e) => {
        if (e.target.matches('.task')) {
            e.preventDefault();
            if (document.querySelector('#quickDrop') && e.target.id !== 'quickDrop') document.querySelector('#quickDrop').remove();
            if (e.target.id !== 'quickDrop' && e.target.closest('.task') !== dragged && e.target.closest('.task').nextElementSibling !== dragged) {
                if (!document.querySelector('#quickDrop')) {
                    const quickDrop = dragged.cloneNode(true);
                    quickDrop.id = 'quickDrop';
                    e.target.closest('.task').insertAdjacentElement('afterend', quickDrop);
                }
            }
        } else if (e.target.matches('.column')) {
            e.preventDefault();
            if (document.querySelector('#quickDrop') && e.target.id !== 'quickDrop') document.querySelector('#quickDrop').remove();
            if (e.target.id !== 'quickDrop' && e.target.querySelectorAll('.task').length === 0) {
                if (!document.querySelector('#quickDrop')) {
                    const quickDrop = dragged.cloneNode(true);
                    quickDrop.id = 'quickDrop';
                    e.target.querySelector('.column-header').insertAdjacentElement('afterend', quickDrop);
                }
            }
        }
    });

    document.addEventListener('drop', (e) => {
        if (e.target.matches('.task, .task *') && e.target.closest('.task') !== dragged && e.target.closest('.task').nextElementSibling !== dragged) {
            const newColumnId = Number(e.target.closest('.column').dataset.columnid);
            const taskId = dragged.dataset.taskid;
            const task = state.projects[state.currentProject].getTaskById(taskId , startingColumn);
            let newTaskIndex;
            let taskBefore;
            const clonedTask = dragged.cloneNode(true);

            clonedTask.style.opacity = 1;
            if (e.target.id === 'quickDrop') {
                e.target.closest('#quickDrop').insertAdjacentElement('beforebegin', clonedTask);
                taskBefore = e.target.closest('#quickDrop').previousElementSibling;
            } else {
                e.target.closest('.task').insertAdjacentElement('afterend', clonedTask);
                taskBefore = e.target.closest('.task');
            }
            
            const timerIndex = state.timers.findIndex(timer => timer.projectId === Number(state.currentProject) && timer.columnId === startingColumn && timer.taskId === taskId);
            if (timerIndex >= 0) state.timers[timerIndex].columnId = newColumnId;

            newTaskIndex = Array.from(document.querySelectorAll(`.column[data-columnId="${newColumnId}"] .task`)).indexOf(taskBefore) + 1;
            state.projects[state.currentProject].insertTaskAfter(task, taskId, startingColumn, newColumnId, newTaskIndex);

            document.querySelector('#quickDrop').remove();
            dragged.remove();
        }
    });
});