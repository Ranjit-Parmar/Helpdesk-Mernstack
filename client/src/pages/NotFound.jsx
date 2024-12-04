import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-blue-500 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, the page you're looking for doesn't exist.</p>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Home
          </Link>
          <Link to="/dashboard" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
