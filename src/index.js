import './style.css';
import { renderProjectForm, renderProjectList, initializeApp, renderTaskForm ,renderFilteredTasks} from './dom.js';

document.getElementById('toggle-sidebar').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('minimized');
});

document.getElementById('add-project-btn').addEventListener('click', () => {
  renderProjectForm();
});

document.getElementById('show-project-btn').addEventListener('click', () => {
  renderProjectList();
  
});
document.getElementById('today-btn').addEventListener('click', () => {
  renderFilteredTasks('today');
});
document.getElementById('week-btn').addEventListener('click', () => {
  renderFilteredTasks('week');
});
document.getElementById('overdue-btn').addEventListener('click', () => {
  renderFilteredTasks('overdue');
});
document.getElementById('completed-btn').addEventListener('click', () => {
  renderFilteredTasks('completed');
});
document.getElementById('pending-btn').addEventListener('click', () => {
  renderFilteredTasks('pending');
});


initializeApp();