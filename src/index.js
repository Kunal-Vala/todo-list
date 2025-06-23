import { Project } from "./project";
import { Task } from "./task";

const project = new Project("Web Dev", "Todo List App");

const task1 = new Task("Setup Webpack", "Configure base setup", "2025-06-24", "high");
const task2 = new Task("Design UI", "Create basic layout", "2025-06-25", "medium");

project.addTask(task1);
project.addTask(task2);

project.showProject();
project.showTasks();