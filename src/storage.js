import { Project } from "./project";
import { Task } from "./task";

function saveProjects(projects) {
    const data = JSON.stringify(projects);
    localStorage.setItem("todo-projects", data);
}

function loadProjects() {
    const rawData = localStorage.getItem("todo-projects");
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);

    const reconstructed = [];

    parsed.forEach(p => {
        const project = new Project(p.title, p.description);

        p.tasks.forEach(t => {
            const task = new Task(t.title, t.description, t.dueDate, t.priority, t.completed);
            project.addTask(task);
        });

        reconstructed.push(project);
    });

    return reconstructed;
}

export {loadProjects , saveProjects };