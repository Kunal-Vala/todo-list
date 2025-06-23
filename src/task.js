class Task{
    constructor(title, description, dueDate, priority = 'low', completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority; // 'low', 'high', 'urgent'
        this.completed = completed;
    }

    toggleStatus(){
        this.completed = !this.completed;
    }

    showResult(){
        console.table(this);
    }
}

export {Task};