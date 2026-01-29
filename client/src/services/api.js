const USE_API = false; // Toggle between localStorage and API mode

const API_BASE_URL = 'http://localhost:4000';

async function request(path, options = {}) {
  const url = API_BASE_URL + path;
  const headers = options.headers || {};
  if (localStorage.getItem('token')) {
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
}

export async function register({ username, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function getGitHubOAuthUrl() {
  return API_BASE_URL + '/auth/github';
}

export async function getCurrentUser() {
  return request('/auth/me');
}

export async function getProjects() {
  return request('/projects');
}

export async function createProject(project) {
  return request('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
}

export async function updateProject(id, project) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export async function getTasks(projectId) {
  try {
    if (projectId) {
      return await request(`/projects/${projectId}/tasks`);
    } else {
      // Get all tasks if no projectId specified
      return await request('/tasks');
    }
  } catch (error) {
    // Fallback to localStorage if API fails
    const storedTasks = localStorage.getItem('tasks');
    const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    return projectId ? allTasks.filter(t => t.projectId === projectId) : allTasks;
  }
}

export async function createTask(projectId, task) {
  return request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export async function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

export async function addDiscussion(projectId, message) {
  return request(`/projects/${projectId}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}

export async function exportJSON() {
  // Placeholder: Implement export logic or call backend API
  alert('Export functionality not implemented yet.');
}

export async function importJSON(file) {
  // Placeholder: Implement import logic or call backend API
  alert('Import functionality not implemented yet.');
}

export async function saveTasks(tasks) {
  // Save tasks to localStorage for now
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return tasks;
}

export async function getUsers() {
  // Placeholder: Implement get users logic or call backend API
  return [];
}

export default {
  register,
  login,
  getGitHubOAuthUrl,
  getCurrentUser,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addDiscussion,
  exportJSON,
  importJSON,
};
