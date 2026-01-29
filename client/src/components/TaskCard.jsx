import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-2">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{task.title}</h4>
        <div className="flex space-x-1">
          <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-gray-700">✏️</button>
          <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-700">🗑️</button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {task.tags.map(tag => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
          <span className="text-xs text-gray-500">{task.assigneeId}</span>
        </div>
        <div className="flex space-x-1">
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, 'todo')}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              title="Move to To Do"
            >
              ← To Do
            </button>
          )}
          {task.status !== 'inprogress' && (
            <button
              onClick={() => onMove(task.id, 'inprogress')}
              className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
              title="Move to In Progress"
            >
              In Progress
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, 'done')}
              className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded"
              title="Move to Done"
            >
              Done →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
