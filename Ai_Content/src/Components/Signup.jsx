import React, { useState, useEffect } from "react";

// Mock register function
const mockRegister = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful registration
      const user = {
        id: Date.now(),
        username,
        email,
        createdAt: new Date().toISOString()
      };
      resolve(user);
    }, 1000);
  });
};

const Signup = ({ onSignupSuccess, onClose, onShowLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Use mock register instead of API call
      const user = await mockRegister(formData.fullName, formData.email, formData.password);
      onSignupSuccess(user);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {/* Signup Card */}
      <div
        className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 w-full max-w-md shadow-xl transform transition-all duration-700 relative ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ×
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
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 active:scale-95 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400">
          <p>
            Already have an account?{" "}
            <button
              onClick={onShowLogin}
              className="text-white underline hover:text-gray-300"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;