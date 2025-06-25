import { Project } from './project.js';
import { projects } from './state.js';
import { Task } from './task.js';
import { isToday, isBefore, isWithinInterval, addDays, format, startOfToday } from 'date-fns';


function initializeApp() {
  const main = document.querySelector("#main-content");
  main.innerHTML = "";
  const addButton = createAddButton();
  main.appendChild(addButton);
  addButton.addEventListener("click", renderProjectForm);
}

function createAddButton() {
  const button = document.createElement("button");
  button.textContent = "Create Project";
  button.id = "add-project-btn";
  return button;
}

function renderProjectForm() {
  const main = document.querySelector("#main-content");
  main.innerHTML = "";

  const form = document.createElement("form");
  form.id = "project-form";

  form.innerHTML = `
    <label for="title">Title</label>
    <input type="text" id="title" name="title" >
    <label for="description">Description</label>
    <input type="text" id="description" name="description" >
    <button type="submit">Add Project</button>
  `;

  form.addEventListener("submit", handleFormSubmit);
  main.appendChild(form);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const description = e.target.description.value.trim();

  if (!title) {
    alert("Please fill in Title field.");
    return;
  }

  const newProject = new Project(title, description);
  projects.push(newProject);
  renderProjectList();
}

function renderProjectList() {
  const main = document.querySelector("#main-content");
  main.innerHTML = "";

  if (projects.length === 0) {
    main.textContent = "No projects yet.";
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("project-grid");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
    grid.appendChild(card);

    card.addEventListener("click", () => {
      renderProjectDetail(project);
    });

  });

  main.appendChild(grid);

}


// Renders a detailed project view with tasks and form
function renderProjectDetail(project) {
  const main = document.querySelector('#main-content');
  main.innerHTML = '';

  const header = document.createElement('div');
  header.innerHTML = `<h2>${project.title}</h2><p>${project.description}</p>`;
  header.classList.add("project-card-full");

  const taskList = renderTaskList(project);
  const taskForm = renderTaskForm(project);

  main.appendChild(header);
  main.appendChild(taskList);
  main.appendChild(taskForm);
}

// Renders all tasks for a given project
function renderTaskList(project) {
  const container = document.createElement('div');
  container.classList.add('task-list');

  if (project.tasks.length === 0) {
    container.textContent = "No tasks yet.";
    return container;
  }

  project.tasks.forEach(task => {
    const button = document.createElement("button");
    button.classList.add('toggle-button');
    button.textContent = 'Completed'
    button.addEventListener('click', () => {
      if(task.completed === true){
        button.textContent = "Pending";
        task.completed = !task.completed;
      }else{
        button.textContent = "Completed";
        task.completed = !task.completed;
      }
      renderProjectDetail(project)
    });
    const card = document.createElement('div');
    card.classList.add('task-card');
    switch (task.priority) {
      case 'low':
        card.classList.add('priority-low');
        break;

      case 'medium':
        card.classList.add('priority-medium');
        break;

      case 'high':
        card.classList.add('priority-high');
        break;

      case 'urgent':
        card.classList.add('priority-urgent');
        break;
    }
    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <p>📅 ${task.dueDate}</p>
      <p>⚡ ${task.priority}</p>
      <p>Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>
    `;

    card.appendChild(button);
    container.appendChild(card);
  });

  return container;
}

// Renders the task form and handles submission
function renderTaskForm(project) {
  const form = document.createElement("form");
  form.id = "task-form";

  const today = format(startOfToday(), "yyyy-MM-dd'T'HH:mm");

  form.innerHTML = `
    <h3>Add Task</h3>
    <label for="task-title">Title</label>
    <input type="text" id="task-title" name="task-title" >

    <label for="task-description">Description</label>
    <textarea id="task-description" name="task-description" rows="3"></textarea>

    <label for="task-due-date">Due Date & Time</label>
    <input type="datetime-local" id="due-date" name="due-date"  min="${today}">



    <label for="task-priority">Priority</label>
    <select id="task-priority" name="task-priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="urgent">Urgent</option>
    </select>

    <button type="submit">Add Task</button>
  `;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = form.querySelector('#task-title').value.trim();
    const description = form.querySelector('#task-description').value.trim();
    const dueDate = format(form.querySelector('#due-date').value, "EEE, dd MMM yyyy – hh:mm a");
    const priority = form.querySelector('#task-priority').value;

    if (!title || !dueDate) {
      alert("Title and Due Date are required.");
      return;
    }

    const newTask = new Task(title, description, dueDate, priority);
    project.addTask(newTask);

    renderProjectDetail(project); // Re-render with updated tasks
  });

  return form;
}

export { renderProjectDetail };







export { renderProjectForm, renderProjectList, initializeApp, renderTaskForm };