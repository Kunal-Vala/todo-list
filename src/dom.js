import { Project } from './project.js';
import { projects } from './state.js';
import { Task } from './task.js';
import { isToday, isBefore, isWithinInterval, addDays, format, startOfToday, startOfMinute, parseISO, isThisWeek } from 'date-fns';
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

  if (projects.some(p => p.title === title)) {
    alert("A project with this title already exists.");
    return;
  }
  const newProject = new Project(title, description);
  projects.push(newProject);

  // Save updated projects to localStorage
  saveProjects(projects);
  showToast("Project added!");
  renderProjectList();
}

function renderProjectList() {
  const main = document.querySelector("#main-content");
  main.innerHTML = "";

  // Add a heading
  const heading = document.createElement("h2");
  heading.textContent = "Your Projects";
  heading.style.marginBottom = "1.5rem";
  main.appendChild(heading);

  // Add "Create Project" button at the top
  const addButton = document.createElement("button");
  addButton.textContent = "+ New Project";
  addButton.className = "edit-button";
  addButton.style.marginBottom = "1.5rem";
  addButton.addEventListener("click", renderProjectForm);
  main.appendChild(addButton);

  if (projects.length === 0) {
    // Show a friendly empty state
    const empty = document.createElement("div");
    empty.style.textAlign = "center";
    empty.style.marginTop = "2rem";
    empty.innerHTML = `
    <p style="font-size:1.2rem; color:#888;">No projects yet.</p>
    <button class="edit-button" id="first-project-btn" style="margin-top:1rem;">Create your first project</button>
  `;
    main.appendChild(empty);
    document.getElementById("first-project-btn").addEventListener("click", renderProjectForm);
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("project-grid");
  grid.style.background = "#f6f6fa";
  grid.style.padding = "1.5rem";
  grid.style.borderRadius = "12px";

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.style.minHeight = "120px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "center";
    card.style.alignItems = "flex-start";
    card.style.boxShadow = "0 2px 8px #0001";
    card.innerHTML = `
      <div style="font-size:2rem; margin-bottom:0.5rem;">📁</div>
      <h3 style="margin:0 0 0.5rem 0; font-size:1.3rem;">${project.title}</h3>
      <p style="margin:0; color:#666;">${project.description || "<em>No description</em>"}</p>
    `;
    card.addEventListener("click", () => {
      renderProjectDetail(project);
    });
    grid.appendChild(card);
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
        showToast("Project deleted!");
        renderProjectList();
      }
    }
  });
  header.appendChild(deleteBtn);

  const clearTasksBtn = document.createElement('button');
  clearTasksBtn.textContent = "Clear All Tasks";
  clearTasksBtn.classList.add("clear-tasks-btn");
  clearTasksBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all tasks in this project?")) {
      project.clearAllTasks();
      saveProjects(projects);
      showToast("All tasks cleared!");
      renderProjectDetail(project);
    }
  });
  header.appendChild(clearTasksBtn);

  let taskList = renderTaskList(project, filteredTasks || null);
  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('search-wrapper');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search tasks by title...';
  searchInput.classList.add('task-search-input');
  searchWrapper.appendChild(searchInput);

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const baseTasks = filteredTasks || project.tasks; // Use a different variable name
    const searchedTasks = baseTasks.filter(task =>
      task.title.toLowerCase().includes(query)
    );
    // Re-render only the task list
    const newTaskList = renderTaskList(project, searchedTasks);
    taskList.replaceWith(newTaskList);
    taskList = newTaskList;
  });
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
  main.appendChild(searchWrapper)
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
      showToast(task.completed ? "Task marked as completed!" : "Task marked as pending!");
      renderProjectDetail(project);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete Task';

    deleteButton.addEventListener('click', () => {
      const deleteTaskIndex = project.tasks.indexOf(task);
      project.tasks.splice(deleteTaskIndex, 1);
      saveProjects(projects);
      showToast("Task deleted!");
      renderProjectDetail(project)
    });

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.textContent = 'Edit Task';

    editButton.addEventListener('click', () => {
      showEditTaskModal(project, task);
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

function showEditTaskModal(project, task) {
  // Remove any existing modal
  const oldModal = document.querySelector('.edit-modal-overlay');
  if (oldModal) oldModal.remove();

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'edit-modal-overlay';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'edit-modal';

  // Format date for input
  let dateValue = "";
  if (task.dueDate) {
    const d = new Date(task.dueDate);
    if (!isNaN(d)) {
      dateValue = d.toISOString().slice(0, 16);
    }
  }

  modal.innerHTML = `
    <h3>Edit Task</h3>
    <form id="edit-task-form">
      <label for="edit-title">Title</label>
      <input type="text" id="edit-title" name="title" value="${task.title}" required>

      <label for="edit-description">Description</label>
      <textarea id="edit-description" name="description" rows="3">${task.description || ""}</textarea>

      <label for="edit-due-date">Due Date & Time</label>
      <input type="datetime-local" id="edit-due-date" name="dueDate" value="${dateValue}" required>

      <label for="edit-priority">Priority</label>
      <select id="edit-priority" name="priority">
        <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
        <option value="urgent" ${task.priority === "urgent" ? "selected" : ""}>Urgent</option>
      </select>
      <div style="margin-top:1.2rem;">
        <button type="submit" class="edit-button">Save</button>
        <button type="button" class="cancel-button">Cancel</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Handle form submit
  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    task.title = modal.querySelector('#edit-title').value.trim();
    task.description = modal.querySelector('#edit-description').value.trim();
    task.dueDate = modal.querySelector('#edit-due-date').value;
    task.priority = modal.querySelector('#edit-priority').value;
    saveProjects(projects);
    showToast("Task updated!");
    overlay.remove();
    renderProjectDetail(project);
  });

  // Handle cancel
  modal.querySelector('.cancel-button').addEventListener('click', () => {
    overlay.remove();
  });

  // Close modal on overlay click (optional)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
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
    showToast("Task added!");
    renderProjectDetail(project); // Re-render with updated tasks
  });

  return form;
}

export { renderProjectDetail };

export { renderProjectForm, renderProjectList, initializeApp, renderTaskForm };


// Helper to get all tasks across all projects
function getAllTasks(projects) {
  return projects.flatMap(project =>
    project.tasks.map(task => ({ ...task, projectTitle: project.title }))
  );
}

// Render filtered tasks in main content
export function renderFilteredTasks(filterType) {
  const main = document.getElementById('main-content');
  main.innerHTML = `<h2>${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Tasks</h2>`;

  // You must have a global 'projects' array
  const allTasks = getAllTasks(projects);

  let filtered = [];
  const today = startOfToday();

  switch (filterType) {
    case 'today':
      filtered = allTasks.filter(task => isToday(parseISO(task.dueDate)));
      break;
    case 'week':
      filtered = allTasks.filter(task => isThisWeek(parseISO(task.dueDate), { weekStartsOn: 1 }));
      break;
    case 'overdue':
      filtered = allTasks.filter(task => !task.completed && isBefore(parseISO(task.dueDate), new Date()));
      break;
    case 'completed':
      filtered = allTasks.filter(task => task.completed);
      break;
    case 'pending':
      filtered = allTasks.filter(task => !task.completed);
      break;
    default:
      filtered = allTasks;
  }

  if (filtered.length === 0) {
    main.innerHTML += `<p>No tasks found.</p>`;
    return;
  }

  // Render each task (simple version)
  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority}`;
    if (task.completed) card.classList.add('completed');

    let formattedDate = "Invalid Date";
    const dateObj = new Date(task.dueDate);
    if (!isNaN(dateObj)) {
      formattedDate = format(dateObj, "EEE, dd MMM yyyy – hh:mm a");
    }

    card.innerHTML = `
  <h4>
    ${task.completed ? '<span class="checkmark">✔</span>' : ''}
    ${task.title}
    <small>(${task.projectTitle || ''})</small>
  </h4>
  <p>${task.description}</p>
  <p>📅 ${formattedDate}</p>
  <span class="priority-badge priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
  <span class="status-badge ${task.completed ? 'status-completed' : 'status-pending'}">
    ${task.completed ? 'Completed' : 'Pending'}
  </span>
`;
    main.appendChild(card);
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#39396b';
  toast.style.color = '#fff';
  toast.style.padding = '0.7rem 1.5rem';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = 2000;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}