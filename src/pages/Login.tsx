/**
 * Login Page Component
 * Handles user authentication with userId and password
 */

import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { config } from '../config/env';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoggedIn } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    if (isLoggedIn) {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
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
     * Handles form submission
     * Uses authService to make API call to backend
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Check if we're in development mode with mock data
            // Remove this block when your backend is ready
            // if (config.app.isDevelopment && !config.api.baseUrl.includes('localhost:8080')) {
            //     // Mock login for demonstration when no backend is available
            //     await new Promise(resolve => setTimeout(resolve, 1000));

            //     if (formData.userId && formData.password) {
            //         const mockPayload = {
            //             userId: formData.userId,
            //             email: `${formData.userId}@example.com`,
            //             firstName: 'Demo',
            //             lastName: 'User',
            //             exp: Math.floor(Date.now() / 1000) + config.auth.tokenExpiry,
            //         };
            //         const mockToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
            //         login(mockToken);

            //         const from = location.state?.from?.pathname || '/admin';
            //         navigate(from, { replace: true });
            //         return;
            //     }
            // }

            // Production API call using authService
            const response = await authService.login({
                username: formData.userId,
                password: formData.password,
            });

            // Store token and update auth state
            login(response.data.token);

            // Redirect to the page they were trying to access, or admin
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } catch (err) {
            // Handle API errors
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="card bg-slate-800/80 backdrop-blur border border-slate-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to your account</p>
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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User ID Field */}
                        <div>
                            <label
                                htmlFor="userId"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                placeholder="Enter your user ID"
                                required
                                autoComplete="username"
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
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
