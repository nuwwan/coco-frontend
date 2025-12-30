/**
 * Home Page Component
 * Landing page for the Coco App
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
            Hello{' '}
            <span className="text-emerald-400">Coco App</span>
            {' '}🥥
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Welcome to your new React application. 
            This is a boilerplate ready for your amazing ideas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isLoggedIn ? (
              <>
                <p className="text-emerald-400 text-lg mb-4 sm:mb-0">
                  Welcome back, {user?.firstName || user?.userId}! 👋
                </p>
                <Link 
                  to="/admin" 
                  className="btn-primary text-lg px-8 py-3"
                >
                  Go to Admin Panel
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="btn-primary text-lg px-8 py-3"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast & Modern</h3>
            <p className="text-slate-400">
              Built with Vite, React 19, and TypeScript for blazing fast development.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Auth</h3>
            <p className="text-slate-400">
              JWT-based authentication ready to connect with your backend.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-2">Responsive</h3>
            <p className="text-slate-400">
              Fully responsive design with Tailwind CSS that looks great everywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>© 2025 Coco App. Built with ❤️ using React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

