import { Project } from './project.js';
import { projects } from './state.js';

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
    <input type="text" id="title" name="title" required>
    <label for="description">Description</label>
    <input type="text" id="description" name="description" required>
    <button type="submit">Add Project</button>
  `;

  form.addEventListener("submit", handleFormSubmit);
  main.appendChild(form);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const description = e.target.description.value.trim();

  if (!title || !description) {
    alert("Please fill in both fields.");
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
  });

  main.appendChild(grid);
}

export { renderProjectForm, renderProjectList ,initializeApp };
