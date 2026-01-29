import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getCurrentUser } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProjectEditor from '../components/ProjectEditor';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      const projs = await getProjects();
      setProjects(projs);
    };
    loadData();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const [showProjectEditor, setShowProjectEditor] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const loadUsers = async () => {
      // TODO: fetch users for project manager selection
      setUsers([]);
    };
    loadUsers();
  }, []);

  const handleSaveProject = async (newProject) => {
    // TODO: save project to storage and update list
    setProjects(prev => [...prev, newProject]);
    setShowProjectEditor(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => setShowProjectEditor(true)}
          aria-label="Create New Project"
        >
          + New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project.id)}
          />
        ))}
      </div>
      {showProjectEditor && (
        <ProjectEditor
          onClose={() => setShowProjectEditor(false)}
          onSave={handleSaveProject}
          users={users}
        />
      )}
    </div>
  );
}
