import UI from "./../UIElements.js";

export const renderNewColumn = (column) => {
    const newColumnHTML = `<div class="column" data-columnId="${column.id}">
                                <div class="column-header">${column.name}</div>
                                <div class="new-task">
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
                                </div>
                            </div>`;
    document.querySelector('.no-columns-message') ? document.querySelector('.no-columns-message').remove() : null;
    document.querySelector(UI.projectNewColumn).insertAdjacentHTML('beforebegin', newColumnHTML);
}

export const removeColumn = (columnId) => {
    document.querySelector(`.column[data-columnId="${columnId}"]`).remove();
}