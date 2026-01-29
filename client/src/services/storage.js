// localStorage wrapper for SynergySphere data persistence

const STORAGE_KEY = 'synergysphere_v1';

const defaultData = {
  users: [],
  projects: [],
  tasks: [],
  currentUser: null
};

export function getUsers() {
  const data = getData();
  return data.users;
}

export function getProjects() {
  const data = getData();
  return data.projects;
}

export function getTasks() {
  const data = getData();
  return data.tasks;
}

export function getCurrentUser() {
  const data = getData();
  return data.currentUser;
}

export function saveProjects(projects) {
  const data = getData();
  data.projects = projects;
  saveData(data);
}

export function saveTasks(tasks) {
  const data = getData();
  data.tasks = tasks;
  saveData(data);
}

export function saveUsers(users) {
  const data = getData();
  data.users = users;
  saveData(data);
}

export function setCurrentUser(user) {
  const data = getData();
  data.currentUser = user;
  saveData(data);
}

export function seedDemoData() {
  const demoUsers = [
    { id: 'u1', name: 'You', email: 'you@demo.test', avatar: '/assets/avatar1.png' },
    { id: 'u2', name: 'Ava', email: 'ava@demo.test', avatar: '/assets/avatar2.png' },
    { id: 'u3', name: 'Raj', email: 'raj@demo.test', avatar: '/assets/avatar3.png' }
  ];

  const demoProjects = [
    {
      id: 'p1',
      name: 'RD Services',
      description: 'Customer care and support services',
      tags: ['Services', 'Customer Care'],
      managerId: 'u1',
      memberIds: ['u1', 'u2'],
      deadline: '2025-08-25T00:00:00Z',
      priority: 'medium',
      images: ['/assets/p1-1.png', '/assets/p1-2.png'],
      tasks: ['t1', 't2'],
      discussions: [
        { id: 'm1', authorId: 'u2', text: 'Kickoff 10am', createdAt: new Date().toISOString() }
      ]
    },
    {
      id: 'p2',
      name: 'UI Upgrade',
      description: 'Modernize the user interface',
      tags: ['UI', 'Upgrade'],
      managerId: 'u1',
      memberIds: ['u1', 'u3'],
      deadline: '2025-09-15T00:00:00Z',
      priority: 'high',
      images: ['/assets/p2-1.png'],
      tasks: ['t3', 't4'],
      discussions: []
    }
  ];

  const demoTasks = [
    {
      id: 't1',
      projectId: 'p1',
      title: 'Design Login',
      description: 'Create wireframes for login page',
      assigneeId: 'u2',
      dueDate: '2025-08-20T00:00:00Z',
      status: 'todo',
      priority: 'high',
      tags: ['ui'],
      createdAt: new Date().toISOString()
    },
    {
      id: 't2',
      projectId: 'p1',
      title: 'Implement API',
      description: 'Build backend API endpoints',
      assigneeId: 'u1',
      dueDate: '2025-08-22T00:00:00Z',
      status: 'inprogress',
      priority: 'medium',
      tags: ['backend'],
      createdAt: new Date().toISOString()
    },
    {
      id: 't3',
      projectId: 'p2',
      title: 'Update Components',
      description: 'Refactor old components',
      assigneeId: 'u3',
      dueDate: '2025-09-10T00:00:00Z',
      status: 'done',
      priority: 'low',
      tags: ['ui'],
      createdAt: new Date().toISOString()
    },
    {
      id: 't4',
      projectId: 'p2',
      title: 'Test New UI',
      description: 'QA the updated interface',
      assigneeId: 'u1',
      dueDate: '2025-09-12T00:00:00Z',
      status: 'todo',
      priority: 'medium',
      tags: ['qa'],
      createdAt: new Date().toISOString()
    }
  ];

  saveUsers(demoUsers);
  saveProjects(demoProjects);
  saveTasks(demoTasks);
  setCurrentUser(demoUsers[0]);
}

export function exportJSON() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'synergysphere-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Basic validation
        if (data.users && data.projects && data.tasks) {
          saveData(data);
          resolve();
        } else {
          reject(new Error('Invalid JSON structure'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}

function getData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { ...defaultData };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
