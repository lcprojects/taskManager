export default class Task {
    constructor(id, description, state, priority, labels, duration, author, executers, dueDate, sateChangeRegistry) {
        this.id = id;
        this.description = description;
        this.state = state;
        this.priority = priority;
        this.labels = labels;
        this.author = author;
        this.executers = executers;
        this.dueDate = dueDate;
        this.duration = duration;
        this.elapsedTime = 0;
        this.stateChangeRegistry = sateChangeRegistry;
    }
    
    setDescription = (description) => {
        this.description = description;
    }

    setState = (state) => {
        this.state = state;
    }
    
    setPriority = (priority) => {
        this.priority = priority;
    }

    setLabels = (labels) => {
        this.labels = labels;
    }
    
    setDuration = (duration) => {
        this.duration = duration;
    }

    setElapsedTime = (elapsedTime) => {
        this.elapsedTime = elapsedTime;
    }
    
    getNextState() {
        if (this.state === 'todo') {
            return 'completed';
        } else if (this.state === 'wip') {
            return 'completed';
        } else {
            return '';
        }
    }
}