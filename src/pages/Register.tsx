/**
 * Register Page Component
 * Handles new user registration with firstname, lastname, userid, email, password
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { config } from '../config/env';

const Register = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/admin', { replace: true });
  }

  /**
   * Handles form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Validates the form data
   * @returns Error message or null if valid
   */
  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.username.trim()) return 'User name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  /**
   * Handles form submission
   * Uses authService to make API call to backend
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Check if we're in development mode with mock data
      // Remove this block when your backend is ready
      // if (config.app.isDevelopment && !config.api.baseUrl.includes('localhost:8080')) {
      //   // Mock registration for demonstration when no backend is available
      //   await new Promise(resolve => setTimeout(resolve, 1000));

      //   const mockPayload = {
      //     userId: formData.userId,
      //     email: formData.email,
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     exp: Math.floor(Date.now() / 1000) + config.auth.tokenExpiry,
      //   };
      //   const mockToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;

      //   login(mockToken);
      //   navigate('/admin', { replace: true });
      //   return;
      // }

      // Production API call using authService
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store token and update auth state
      login(response.data.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      // Handle API errors
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? (err as { message: string }).message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Register Card */}
        <div className="card bg-slate-800/80 backdrop-blur border border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Join {config.app.name} today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Development Mode Indicator */}
          {config.features.debugMode && (
            <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-400 text-xs text-center">
              🔧 Debug Mode - API: {config.api.baseUrl}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields - Two columns on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  placeholder="John"
                  required
                  autoComplete="given-name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  placeholder="Doe"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* User ID Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="Choose a unique user name"
                required
                autoComplete="username"
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="john@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
