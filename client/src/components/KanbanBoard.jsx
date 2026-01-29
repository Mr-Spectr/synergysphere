import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';

export default function KanbanBoard({ projectId, tasks, onUpdateTask, onEditTask }) {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] }
  });

  useEffect(() => {
    const newColumns = {
      todo: { id: 'todo', title: 'To Do', taskIds: [] },
      inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
      done: { id: 'done', title: 'Done', taskIds: [] }
    };

    tasks.forEach(task => {
      if (newColumns[task.status]) {
        newColumns[task.status].taskIds.push(task.id);
      }
    });

    setColumns(newColumns);
  }, [tasks]);

  const handleMoveTask = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, status: newStatus });
    }
  };

  const handleEditTask = (task) => {
    // Open edit modal - this will be handled by parent component
    onUpdateTask(task);
  };

  const handleDeleteTask = (taskId) => {
    // Delete task from storage
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    onUpdateTask({ id: taskId, delete: true });
  };

  return (
    <div className="flex space-x-4 p-4">
      {Object.values(columns).map(column => (
        <div key={column.id} className="flex-1">
          <h3 className="font-semibold mb-4 text-center">{column.title}</h3>
          <div className="min-h-96 p-2 rounded bg-gray-50">
            {column.taskIds.map((taskId) => {
              const task = tasks.find(t => t.id === taskId);
              return (
                <div key={taskId} className="mb-2">
                  <TaskCard
                    task={task}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onMove={handleMoveTask}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
