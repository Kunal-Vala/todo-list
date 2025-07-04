class Task {
  constructor(title, description, dueDate, priority = 'low', completed = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  toggleStatus() {
    this.completed = !this.completed;
  }

  showResult() {
    console.table(this);
  }

  editTask({ title, description, dueDate, priority = 'low', completed = false }) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }
}

export { Task };
