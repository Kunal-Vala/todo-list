import { Project } from './project.js';
import { projects } from './state.js';
import { Task } from './task.js';
import { isToday, isBefore, isWithinInterval, addDays, format, startOfToday, startOfMinute } from 'date-fns';
import { saveProjects } from './storage.js';


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

  // Save updated projects to localStorage
  saveProjects(projects);
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
function renderProjectDetail(project, filteredTasks = null, sortValue = "all") {
  const main = document.querySelector('#main-content');
  main.innerHTML = '';

  const header = document.createElement('div');
  header.innerHTML = `<h2>${project.title}</h2><p>${project.description}</p>`;
  header.classList.add("project-card-full");

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete Project";
  deleteBtn.classList.add("delete-project-btn");
  deleteBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete this project?")) {
      // Remove project from projects array
      const idx = projects.indexOf(project);
      if (idx !== -1) {
        projects.splice(idx, 1);
        saveProjects(projects);
        renderProjectList();
      }
    }
  });
  header.appendChild(deleteBtn);

  

  const taskList = renderTaskList(project, filteredTasks || null);
  const taskForm = renderTaskForm(project);

  const sortLabel = document.createElement('label');
  sortLabel.htmlFor = "sort-tasks";
  sortLabel.id = "sort-label";
  // Set label text based on selected option
  const sortText = {
    all: "All",
    priority: "Priority",
    dueDate: "Due Date",
    completed: "Completed",
    pending: "Pending"
  };
  sortLabel.textContent = `Sort/Filter By: ${sortText[sortValue] || "All"}`;

  const sortSelect = document.createElement('select');
  sortSelect.id = "sort-tasks";
  sortSelect.innerHTML = `
    <option value="all">All</option>
    <option value="priority">Priority</option>
    <option value="dueDate">Due Date</option>
    <option value="completed">Completed</option>
    <option value="pending">Pending</option>
  `;
  sortSelect.value = sortValue; // <-- Set the selected value

  sortSelect.addEventListener('change', (e) => {
    const selectedValue = sortSelect.value;
    sortLabel.textContent = `Sort/Filter By: ${sortText[selectedValue] || "All"}`;
    handleSortChange(e, project);
  });

  const sortWrapper = document.createElement('div');
  sortWrapper.classList.add('sort-wrapper');
  sortWrapper.appendChild(sortLabel);
  sortWrapper.appendChild(sortSelect);

  main.appendChild(header);
  main.appendChild(sortWrapper);
  main.appendChild(taskList);
  main.appendChild(taskForm);
}

function handleSortChange(event, project) {
  const value = event.target.value;

  let filteredTasks = [...project.tasks];

  switch (value) {
    case 'priority':
      project.sortByPriority();
      filteredTasks = [...project.tasks];
      break;
    case 'dueDate':
      project.sortByDueDate();
      filteredTasks = [...project.tasks];
      break;
    case 'completed':
      filteredTasks = project.tasks.filter(task => task.completed);
      break;
    case 'pending':
      filteredTasks = project.tasks.filter(task => !task.completed);
      break;
    case 'all':
    default:
      filteredTasks = [...project.tasks];
      break;
  }

  renderProjectDetail(project, filteredTasks, value); // Pass value here
}


// Renders all tasks for a given project
function renderTaskList(project, filteredTasks = null) {
  const tasksToShow = filteredTasks || project.tasks;
  const container = document.createElement('div');
  container.classList.add('task-list');

  if (project.tasks.length === 0) {
    container.textContent = "No tasks yet.";
    return container;
  }
  
  tasksToShow.forEach(task => {
    const toggleButton = document.createElement("button");
    toggleButton.classList.add('toggle-button');
    toggleButton.textContent = task.completed ? "Mark as Pending" : "Mark as Completed";

    toggleButton.addEventListener('click', () => {
      task.completed = !task.completed;
      saveProjects(projects);
      renderProjectDetail(project);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete Task';

    deleteButton.addEventListener('click', () => {
      const deleteTaskIndex = project.tasks.indexOf(task);
      project.tasks.splice(deleteTaskIndex, 1);
      saveProjects(projects);
      renderProjectDetail(project)
    });

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.textContent = 'Edit Task';

    editButton.addEventListener('click', () => {
      card.innerHTML = "";
      const form = document.createElement("form");
      const now = format((startOfMinute(new Date())), "yyyy-MM-dd'T'HH:mm");

      form.innerHTML = `
      <h3>Edit Task</h3>
      <label for="task-title">Title</label>
      <input type="text" id="task-title" name="task-title" value="${task.title}">

      <label for="task-description">Description</label>
      <textarea id="task-description" name="task-description" rows="3">${task.description}</textarea>

      <label for="task-due-date">Due Date & Time</label>
      <input type="datetime-local" id="due-date" name="due-date"  value="${now}">

      <label for="task-priority">Priority</label>
      <select id="task-priority" name="task-priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
        selected
      </select>

      <button type="submit">Save</button>
      <button type="cancel" class="cancel-button">Cancel</button>
      `;
      card.appendChild(form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = task.id;
        const title = form.querySelector('#task-title').value.trim();
        const description = form.querySelector('#task-description').value.trim();
        const rawValue = form.querySelector('#due-date').value;
        const priority = form.querySelector('#task-priority').value;
        const status = task.completed;

        if (!title || !rawValue) {
          alert("Title and Due Date are required.");
          return;
        }

        const updates = { title, description, dueDate: rawValue, priority, status };

        project.editTaskById(id, updates);
        saveProjects(projects);
        renderProjectDetail(project);
      });
      const cancelButton = form.querySelector('.cancel-button');
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        renderProjectDetail(project);
      });
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

    let formattedDate = "Invalid Date";
    const dateObj = new Date(task.dueDate);
    if (!isNaN(dateObj)) {
      formattedDate = format(dateObj, "EEE, dd MMM yyyy – hh:mm a");
    }

    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <p>📅 ${formattedDate}</p>
      <p>⚡ ${task.priority}</p>
      <p>Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>
    `;

    card.appendChild(editButton);
    card.appendChild(deleteButton);
    card.appendChild(toggleButton);
    container.appendChild(card);
  });

  return container;
}

// Renders the task form and handles submission
function renderTaskForm(project) {
  const form = document.createElement("form");
  form.id = "task-form";

  const today = format(startOfToday(), "yyyy-MM-dd'T'HH:mm");
  const now = format((startOfMinute(new Date())), "yyyy-MM-dd'T'HH:mm");
  form.innerHTML = `
    <h3>Add Task</h3>
    <label for="task-title">Title</label>
    <input type="text" id="task-title" name="task-title" >

    <label for="task-description">Description</label>
    <textarea id="task-description" name="task-description" rows="3"></textarea>

    <label for="task-due-date">Due Date & Time</label>
    <input type="datetime-local" id="due-date" name="due-date"  min="${today}" value = "${now}" >

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
    const dueDate = form.querySelector('#due-date').value; // ISO string
    const priority = form.querySelector('#task-priority').value;

    if (!title || !dueDate) {
      alert("Title and Due Date are required.");
      return;
    }

    const newTask = new Task(title, description, dueDate, priority);
    project.addTask(newTask);
    saveProjects(projects);
    renderProjectDetail(project); // Re-render with updated tasks
  });

  return form;
}

export { renderProjectDetail };

export { renderProjectForm, renderProjectList, initializeApp, renderTaskForm };
