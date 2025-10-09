import React, { useState, useEffect } from "react";

const Signup = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Animation trigger on load
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
    
    // Mock successful signup and login
    const userData = {
      username: formData.fullName || formData.email.split('@')[0] || 'User',
      email: formData.email
    };
    onLogin(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-sans">
      {/* Signup Card */}
      <div
        className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 w-full max-w-md shadow-xl transform transition-all duration-700 relative ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ←
        </button>
        <h2 className="text-3xl font-bold text-center mb-8 tracking-wide">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-300 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-300 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 rounded border-gray-500 bg-black text-white focus:ring-white"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
              I agree to the{" "}
              <a href="#" className="text-white underline hover:text-gray-300">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 active:scale-95 transition duration-300 shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400">
          <p>
            Already have an account?{" "}
            <a href="#" className="text-white underline hover:text-gray-300">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
