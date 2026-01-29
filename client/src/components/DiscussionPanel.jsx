import React, { useState } from 'react';

export default function DiscussionPanel({ discussions, users, onAddMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onAddMessage(message.trim());
      setMessage('');
    }
  };

  const getUserById = (id) => users.find(u => u.id === id) || { name: 'Unknown', avatar: '' };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Discussion</h3>
      <div className="flex-1 overflow-auto mb-4">
        {discussions.map(d => {
          const author = getUserById(d.authorId);
          return (
            <div key={d.id} className="mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full" />
                <span className="font-semibold text-sm">{author.name}</span>
                <span className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm">{d.text}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-1"
          aria-label="Message input"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700">
          Send
        </button>
      </form>
    </div>
  );
}
