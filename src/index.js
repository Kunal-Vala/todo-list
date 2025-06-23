// import { Project } from "./project";
// import { Task } from "./task";

// const project = new Project("Web Dev", "Todo List App");

// const task1 = new Task("Setup Webpack", "Configure base setup", "2025-06-24", "high");
// const task2 = new Task("Design UI", "Create basic layout", "2025-06-20", "medium");

// project.addTask(task1);
// project.addTask(task2);

// task1.toggleStatus();
// // task2.toggleStatus();

// project.showProject();
// project.showTasks();

// // project.deleteTask(task1.title);
// // project.showTasks();

// const task3 = new Task("New", "Create  layout", "2028-06-20", "urgent");
// const task4 = new Task("New", "Create  layout", "2028-07-20", "urgent");

// project.addTask(task4);
// project.addTask(task3);
// project.editTask(task3);
// project.showTasks();
// console.log("due date")
// project.sortByDueDate();
// project.showTasks();

// project.searchTask("Design UI");

// console.log("by priority")

// project.sortByPriority();
// project.showTasks();

// console.log("completed tasks");
// project.showCompletedTasks();

// console.log("pending tasks");
// project.showPendingTasks();

// project.filterByTitle("Des");

// project.filterByPriority("urgent")
// project.filterByPriority("high")
// project.filterByPriority("low")

// project.groupByDueDate();

// console.log("clearinggg");
// project.clearAllTasks();
// project.showTasks();


// console.log("project deleting");
// project.deleteProject(project);
// project.showTasks();




import { Project } from './project.js';
import { Task } from './task.js';

const project = new Project("Web Dev", "ToDo List App");

const task1 = new Task("Setup Webpack", "Configure base", "2025-06-24", "high");
const task2 = new Task("Design UI", "Build layout", "2025-06-20", "medium");
const task3 = new Task("New Feature", "Add login", "2025-06-28", "urgent");

project.addTask(task1);
project.addTask(task2);
project.addTask(task3);

// Toggle status
task1.toggleStatus();

// Show project
project.showProject();
project.showTasks();

// Search
project.searchTask("Design");

// Filter/Sort
project.sortByDueDate();
project.sortByPriority();
project.filterByTitle("setup");
project.filterByPriority("urgent");

// Grouping
project.groupByDueDate();

// Edit by ID
project.editTaskById(task3.id, {
  title: "Updated Feature",
  description: "Updated description",
  dueDate: "2025-07-01",
  priority: "high",
  completed: true
});
project.showTasks();

// Delete by ID
// project.deleteTaskById(task2.id);
// project.showTasks();


console.log("📌 All Tasks Initially:");
project.showTasks();

console.log("🗑️ Deleting one task...");
project.deleteTaskById(task1.id);
project.showTasks();

console.log("❌ Deleting entire project...");
project.deleteProject("Web Dev");
project.showProject();  // Should show null values
project.showTasks();    // Should be empty
