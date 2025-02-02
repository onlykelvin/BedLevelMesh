import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto text-center">
      <Grid3X3 className="h-24 w-24 text-indigo-600 mx-auto mb-8" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        3D Printer Bed Mesh Visualizer
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Visualize your 3D printer's bed mesh data with an interactive 3D representation.
        Simply paste your mesh data or input it manually to get started.
      </p>
      <button
        onClick={() => navigate('/input')}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Started
      </button>
    </div>
  );
}

export default Home;