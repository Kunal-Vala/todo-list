import './style.css';
import { renderProjectForm, renderProjectList,initializeApp} from './dom.js';

document.getElementById('toggle-sidebar').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('minimized');
});

document.getElementById('add-project-btn').addEventListener('click', () => {
  renderProjectForm();
});

document.getElementById('show-project-btn').addEventListener('click', () => {
  renderProjectList();
});
initializeApp();