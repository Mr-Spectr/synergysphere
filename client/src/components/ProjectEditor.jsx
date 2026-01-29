import React, { useState, useEffect } from 'react';

export default function ProjectEditor({ onClose, onSave, existingProject, users }) {
  const [name, setName] = useState(existingProject?.name || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [tags, setTags] = useState(existingProject?.tags?.join(', ') || '');
  const [managerId, setManagerId] = useState(existingProject?.managerId || '');
  const [deadline, setDeadline] = useState(existingProject?.deadline?.slice(0,10) || '');
  const [priority, setPriority] = useState(existingProject?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert('Project name is required');
      return;
    }
    const newProject = {
      ...existingProject,
      id: existingProject?.id || 'p' + Date.now(),
      name,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      managerId,
      deadline,
      priority,
      memberIds: existingProject?.memberIds || [],
      images: existingProject?.images || [],
      tasks: existingProject?.tasks || [],
      discussions: existingProject?.discussions || [],
    };
    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        className="bg-white rounded p-6 w-full max-w-lg shadow-lg"
        onSubmit={handleSubmit}
        aria-label="Project Editor Form"
      >
        <h3 className="text-xl font-semibold mb-4">{existingProject ? 'Edit Project' : 'New Project'}</h3>
        <div className="mb-3">
          <label htmlFor="name" className="block font-medium mb-1">Name *</label>
          <input
            id="name"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
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
          <label htmlFor="tags" className="block font-medium mb-1">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="manager" className="block font-medium mb-1">Project Manager</label>
          <select
            id="manager"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={managerId}
            onChange={e => setManagerId(e.target.value)}
          >
            <option value="">Select Manager</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="deadline" className="block font-medium mb-1">Deadline</label>
          <input
            id="deadline"
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
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
