import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Share2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: '3D Printer Bed Mesh Visualizer',
        text: 'Check out this awesome 3D printer bed mesh visualization tool!',
        url: window.location.href
      });
    } catch (error) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
      >
        Get Started
      </button>
      <div>
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>
      </div>
    </div>
  );
}

export default Home;