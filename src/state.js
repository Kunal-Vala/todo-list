import { loadProjects, saveProjects } from './storage.js';

export let projects = loadProjects(); // Load projects from localStorage when app starts
