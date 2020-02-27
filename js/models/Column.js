export default class Column {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.tasks = [];
    }

    getTaskById = (taskId) => {
        const task = this.tasks.filter(task => task.id === taskId);
        return task[0];
    }

    addTask = (task) => {
        this.tasks.push(task);
    }

    sortByState = () => {
        this.tasks.sort((a, b) => {
            if (a.state === 'todo') {
                return -1;
            } else if (a.state === 'completed') {
                return 1;
            } else if (a.state === 'wip' && b.state === 'completed') {
                return -1;
            } else {
                return 0
            }
        });
    }

    sortByPriority = () => {
        this.tasks.sort((a, b) => {
            if (a.priority === 'critical') {
                return -1;
            } else if (a.priority === 'low') {
                return 1;
            } else if (b.priority === 'low') {
                return -1;
            } else if (a.priority === 'normal' && b.priority === 'high') {
                return 1;
            } else if (a.priority === 'high' && b.priority === 'normal') {
                return -1;
            } else {
                return 0
            }
        });
    }

}