
import { Task } from './task.js';
import { isToday, isBefore, isWithinInterval, addDays, startOfToday } from 'date-fns';

class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.tasks = [];
  }

  addTask(task) {
    if (task instanceof Task) this.tasks.push(task);
    else throw new Error('Only Task instances can be added');
  }

  removeTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    }
  }

  showProject() {
    console.table({ title: this.title, description: this.description });
  }

  showTasks() {
    console.log(`\nProject: ${this.title}`);
    this.tasks.forEach((task, i) => task.showResult());
  }

  findTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  editTaskById(id, updates) {
    const task = this.findTaskById(id);
    if (task) task.editTask(updates);
  }

  deleteTaskById(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) this.tasks.splice(index, 1);
  }

  sortByDueDate() {
    this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  sortByPriority() {
    const order = { urgent: 1, high: 2, medium: 3, low: 4 };
    this.tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  deleteProject(title) {
    if (this.title === title) {
      this.title = null;
      this.description = null;
      this.tasks = [];
    }
  }

  clearAllTasks() {
    this.tasks = [];
  }
}

export { Project };
