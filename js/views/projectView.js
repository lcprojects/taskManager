import UI from "./../UIElements.js";

import * as taskView from "./taskView.js"

export const renderProjectNames = (projects) => {
    const projectsNameHTML = `
        <li class="tab-begin-fill"></li>
        ${projects.length > 0 ? `<li class="tab-head tab-head-active" data-projectId="${projects[0].id}"><i class="fas fa-cube"></i> ${projects[0].name}</li>` : ''}
        ${projects.map((project, index) => { return index > 0 ? `<li class="tab-head" data-projectId="${project.id}"><i class="fas fa-cube"></i>${project.name}</li>` : ''; }).join('')}
        <div class="tooltip insert-project--js"><li class="tab-head-add"><i class="fa fa-plus"></i></li><div class="tooltiptext">Create a Project</div></div>
        <li class="tab-end-fill"></li>
    `;
    
    document.querySelector(UI.projectNamesList).innerHTML = projectsNameHTML;
}

export const renderNewProjectName = (project) => {
    const newProjectNameHTML = `
        <li class="tab-head tab-head-active" data-projectId="${project.id}"><i class="fas fa-cube"></i> ${project.name}</li>
    `;
    
    document.querySelectorAll(UI.projectTab).forEach((el, index) => { el.classList.remove('tab-head-active'); });

    document.querySelector(UI.projectNamesList).querySelector(UI.projectNameInsert).insertAdjacentHTML('beforebegin', newProjectNameHTML);
}

export const selectActiveTab = (id) => {
    document.querySelectorAll('.tab-head').forEach((el, index) => {
        el.classList.remove('tab-head-active');
    });
    document.querySelector(`.tab-head[data-projectid="${id}"]`).classList.add('tab-head-active');
}

export const renderCurrentProject = (project) => {
    let projectContentHTML = '';

    if (project && project.columns.length > 0) {
        for(const column of project.columns) {
            projectContentHTML += `<div class="column" data-columnId="${column.id}">
                                    <div class="column-header">${column.name}</div>`;
            for (const task of column.tasks) {
                projectContentHTML += taskView.renderTask(task, project.id, column.id);
            }
            projectContentHTML += `<div class="new-task">
                                        <div class="task-body m-0">
                                            <textarea name="" id="" cols="30" rows="5"></textarea>
                                        </div>
                                        <div class="task-footer">
                                            <div class="priority normal set-new-priority--js">normal</div>
                                            <div class="task-footer-separator"></div>
                                            <input class="m-r-sm add-label-input">
                                            <div class="btn btn-xs m-r-sm add-label--js"><i class="fas fa-tag"></i></div>
                                            <a class="btn btn-xs m-r-sm set-time--js"><i class="fa fa-clock"></i></a>
                                            <input class="m-r-sm add-time-input">
                                            <a class="btn btn-xs m-l-a m-r-sm delete-new-task--js"><i class="fa fa-trash"></i></a>
                                            <a href="#" class="btn btn-xs add-new-task--js"><i class="fa fa-plus"></i></a>
                                        </div>
                                    </div>
                                    <div class="add-task text-right">
                                        <a class="btn btn-secondary btn-xs add-task--js">
                                            <i class="fa fa-plus"></i> Add task
                                        </a>
                                        <a class="btn btn-secondary btn-xs delete-column-btn--js">
                                            <i class="fa fa-trash"></i> Delete Column
                                        </a>
                                    </div>`;
            projectContentHTML += '</div>';
        }
        projectContentHTML += `<div class="add-new-column">
                                    <div class="tooltip tooltip-top">
                                        <a class="btn add-column--js"><i class="fa fa-plus"></i></a>
                                        <div class="tooltiptext">Add Column</div>
                                    </div>
                                </div>`;
    } else if (project) {
        projectContentHTML += `<div class="add-new-column">
                                    <span class="m-r-sm no-columns-message">No columns yet.</span>
                                    <div class="tooltip tooltip-top">
                                        <a class="btn add-column--js"><i class="fa fa-plus"></i></a>
                                        <div class="tooltiptext">Add Column</div>
                                    </div>
                                </div>`;
    }


    document.querySelector(UI.projectContent).innerHTML = projectContentHTML;
}

export const toggleCreateProjectPopup = () => {
    document.querySelector(UI.projectCreatePopup).classList.toggle('hide');
}

export const toggleAddTask = (columnId) => {
    document.querySelector(`.column[data-columnId="${columnId}"] .add-task`).previousElementSibling.classList.toggle('show');
    document.querySelector(`.column[data-columnId="${columnId}"] .add-task`).classList.toggle('hide');
}

export const toggleNewColumnPopup = () => {
    document.querySelector(UI.projectAddColumnPopup).classList.toggle('hide');
}