import React, { useState } from 'react';

const Login = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    
    // Mock successful login
    const userData = {
      username: formData.email.split('@')[0] || 'User',
      email: formData.email
    };
    onLogin(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 w-full max-w-md shadow-2xl relative">
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ←
        </button>
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-white">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 border-gray-400 rounded bg-white/10" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-gray-300 hover:text-white hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-gray-300">
          <p>
            Don’t have an account?{' '}
            <a href="#" className="text-white hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
