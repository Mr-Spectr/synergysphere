import React, { useState } from 'react';
import api from '../services/api';

export default function Auth() {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        const res = await api.register(form);
        localStorage.setItem('token', res.token);
        alert('Registration successful! You are now logged in.');
        window.location.href = '/dashboard';
      } else {
        const res = await api.login(form);
        localStorage.setItem('token', res.token);
        alert('Login successful!');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = api.getGitHubOAuthUrl();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-indigo-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          SynergySphere {isRegister ? 'Register' : 'Login'}
        </h1>
        <form onSubmit={handleSubmit} aria-label={isRegister ? 'Register form' : 'Login form'}>
          {isRegister && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              aria-label="Username"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            aria-label="Email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            aria-label="Password"
            required
          />
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            aria-label={isRegister ? 'Register' : 'Login'}
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleGitHubLogin}
            className="bg-black text-white px-4 py-2 rounded mr-2"
            aria-label="Login with GitHub"
          >
            GitHub
          </button>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 underline ml-2"
            aria-label={isRegister ? 'Switch to login' : 'Switch to register'}
          >
            {isRegister ? 'Already have an account? Login' : 'Create a new account'}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              localStorage.setItem('token', 'demo-token');
              window.location.href = '/dashboard';
            }}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            aria-label="Demo Login"
          >
            Demo Login (Skip API)
          </button>
        </div>
      </div>
    </div>
  );
}
