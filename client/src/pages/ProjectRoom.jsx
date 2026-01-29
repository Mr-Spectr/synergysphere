import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjects, getTasks, saveTasks, getUsers } from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import ChartProgress from '../components/ChartProgress';
import DiscussionPanel from '../components/DiscussionPanel';
import ImportExport from '../components/ImportExport';
import TaskEditor from '../components/TaskEditor';

export default function ProjectRoom() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const projects = await getProjects();
      const currentProject = projects.find(p => p.id === projectId);
      setProject(currentProject);

      const allTasks = await getTasks();
      const projectTasks = allTasks.filter(t => t.projectId === projectId);
      setTasks(projectTasks);
    };
    loadData();
  }, [projectId]);

  const handleUpdateTask = async (updatedTask) => {
    const allTasks = await getTasks();
    let updatedTasks;

    if (updatedTask.delete) {
      // Delete task
      updatedTasks = allTasks.filter(t => t.id !== updatedTask.id);
    } else {
      // Update or add task
      const existingIndex = allTasks.findIndex(t => t.id === updatedTask.id);
      if (existingIndex !== -1) {
        updatedTasks = [...allTasks];
        updatedTasks[existingIndex] = updatedTask;
      } else {
        updatedTasks = [...allTasks, updatedTask];
      }
    }

    await saveTasks(updatedTasks);
    setTasks(updatedTasks.filter(t => t.projectId === projectId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskEditor(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">{project ? project.name : 'Loading...'}</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => setShowTaskEditor(true)}
          aria-label="Create New Task"
        >
          + New Task
        </button>
      </div>
      <KanbanBoard
        projectId={projectId}
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onEditTask={handleEditTask}
      />
      {showTaskEditor && (
        <TaskEditor
          project={project}
          task={editingTask}
          onClose={() => {
            setShowTaskEditor(false);
            setEditingTask(null);
          }}
          onSave={async (taskData) => {
            await handleUpdateTask(taskData);
            setShowTaskEditor(false);
            setEditingTask(null);
          }}
        />
      )}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartProgress tasks={tasks} />
        <DiscussionPanel
          discussions={project?.discussions || []}
          users={[]} // TODO: pass users list
          onAddMessage={(text) => {
            // TODO: implement add message
            alert('Add message: ' + text);
          }}
        />
      </div>
      <div className="mt-6">
        <ImportExport />
      </div>
    </div>
  );
}
