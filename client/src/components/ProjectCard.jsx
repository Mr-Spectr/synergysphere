import React from 'react';

export default function ProjectCard({ project, onClick }) {
  const daysLeft = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div
      className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{project.name}</h3>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <p className="text-gray-600 mb-2">{project.description}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {project.tags.map(tag => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Tasks: {project.tasks.length}</span>
        <span className={`text-sm ${daysLeft < 0 ? 'text-red-500' : 'text-green-500'}`}>
          D-{Math.abs(daysLeft)}
        </span>
      </div>
      <div className="flex space-x-1">
        {project.images.slice(0, 3).map((img, index) => (
          <div key={index} className="w-8 h-8 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
}
