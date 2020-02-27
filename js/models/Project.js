export default class Project {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.columns = [];
    }

    getColumnById(columnId) {
        const column = this.columns.filter(column => column.id === columnId);
        return column[0];
    }

    getTaskById(taskId, columnId) {
        return this.getColumnById(columnId).getTaskById(taskId);
    }

    setTaskState(state, taskId, columnId) {
        const columnIndex = this.columns.findIndex(column => column.id === columnId);
        const taskIndex = this.columns[columnIndex].tasks.findIndex(task => task.id === taskId);
        
        this.columns[columnIndex].tasks[taskIndex].setState(state);
    }

    insertTaskAfter(task, beforeTaskId, beforeColumnId, newColumnId, newTaskIndex) {
        const columnIndex = this.columns.findIndex(column => column.id === beforeColumnId);
        const taskIndex = this.columns[columnIndex].tasks.findIndex(task => task.id === beforeTaskId);
        const newColumnIndex = this.columns.findIndex(column => column.id === newColumnId);
               
        this.columns[columnIndex].tasks.splice(taskIndex, 1);
        this.columns[newColumnIndex].tasks.splice(newTaskIndex, 0, task);
    }

    addColumn(column) {
        this.columns.push(column)
    }

    addTask(task, columnId) {
        const columnIndex = this.columns.findIndex(column => column.id === columnId);

        this.columns[columnIndex].addTask(task);
    }

    deleteTask(taskId, columnId) {
        const tasks = this.getColumnById(columnId).tasks;
        let index;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id = taskId) {
                index = i;
                break;
            }
        }
        const columnIndex = this.columns.findIndex(column => column.id === columnId);
        this.columns[columnIndex].tasks.splice(index, 1);
    }

    deleteColumn(columnId) {
        let index;
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].id === columnId) {
                index = i;
                break;
            }
        }
        this.columns.splice(index, 1);
    }

    searchForTasks(query) {
        let resultProject = {id: this.id, columns: []};
        let first = true;
        let col = -1;
        for (let i = 0; i < this.columns.length; i++) {
            first = true;
            for(let k = 0; k < this.columns[i].tasks.length; k++) {
                if (this.columns[i].tasks[k].description.toLowerCase().includes(query)) {
                    if (first === true) {
                        first = false;
                        col++;
                        resultProject.columns[col] = {id: this.columns[i].id, tasks: []};
                    }
                    resultProject.columns[col].tasks.push(this.columns[i].tasks[k]);
                }
            }
        }
        return resultProject;
    }

    sortByPriority() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].sortByPriority();
        }
    }
    
    sortByState() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].sortByState();
        }
    }
}