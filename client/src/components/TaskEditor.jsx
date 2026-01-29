import React, { useState, useEffect } from 'react';

export default function TaskEditor({ project, onClose, onSave, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('todo');
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Load project members as available users for assignee selection
    if (project && project.memberIds) {
      // TODO: Fetch user details for memberIds
      // For now, just set empty array or mock data
      setAvailableUsers([]);
    }
  }, [project]);

  useEffect(() => {
    // Populate form fields when editing an existing task
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setAssigneeId(task.assigneeId || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority || 'low');
      setTags(task.tags || []);
      setStatus(task.status || 'todo');
    }
  }, [task]);

  const handleTagChange = (e) => {
    const value = e.target.value;
    const tagList = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    setTags(tagList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required');
      return;
    }
    const taskData = {
      id: task ? task.id : 't' + Date.now(),
      projectId: project.id,
      title,
      description,
      assigneeId,
      dueDate,
      priority,
      tags,
      status,
      createdAt: task ? task.createdAt : new Date().toISOString(),
    };
    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        className="bg-white rounded p-6 w-full max-w-lg shadow-lg"
        onSubmit={handleSubmit}
        aria-label="Task Editor Form"
      >
        <h3 className="text-xl font-semibold mb-4">New Task</h3>
        <div className="mb-3">
          <label htmlFor="title" className="block font-medium mb-1">Title *</label>
          <input
            id="title"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="assignee" className="block font-medium mb-1">Assignee</label>
          <select
            id="assignee"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="block font-medium mb-1">Deadline</label>
          <input
            id="dueDate"
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <span className="block font-medium mb-1">Priority</span>
          <label className="mr-4">
            <input
              type="radio"
              name="priority"
              value="low"
              checked={priority === 'low'}
              onChange={e => setPriority(e.target.value)}
            /> Low
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="priority"
              value="medium"
              checked={priority === 'medium'}
              onChange={e => setPriority(e.target.value)}
            /> Medium
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="high"
              checked={priority === 'high'}
              onChange={e => setPriority(e.target.value)}
            /> High
          </label>
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="block font-medium mb-1">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={tags.join(', ')}
            onChange={handleTagChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="block font-medium mb-1">Status</label>
          <select
            id="status"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
