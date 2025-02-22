import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeshContext } from '../context/MeshContext';
import { parseMeshData } from '../utils/meshParser';
import { FileText, Clipboard } from 'lucide-react';

const Input: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const { setMeshData } = useMeshContext();
  const navigate = useNavigate();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = parseMeshData(input);
      setMeshData(data);
      navigate('/visualize');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input format');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Input Mesh Data</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Input Format</h3>
        <p className="text-xs text-blue-700 mb-2">
          Each value must start with + or - sign, separated by spaces. All rows must have the same number of values.
        </p>
        <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
{`+1.291 +0.767 +0.205 -0.436 -1.064
+1.300 +0.731 +0.139 -0.506 -1.143
+1.204 +0.620 -0.003 -0.628 -1.270
+1.076 +0.501 -0.079 -0.703 -1.312
+0.975 +0.406 -0.156 -0.782 -1.406

+1.204 +0.620 -0.003
+1.076 +0.501 -0.079 
+0.975 +0.406 -0.156`}
        </pre>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="meshData" className="block text-sm font-medium text-gray-700">
                Paste your mesh data
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Clipboard className="h-4 w-4 mr-1" />
                Paste from clipboard
              </button>
            </div>
            <textarea
              id="meshData"
              rows={10}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
              placeholder="Paste your mesh data here..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
                setPasteSuccess(false);
              }}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {pasteSuccess && (
              <p className="mt-2 text-sm text-green-600">Successfully pasted from clipboard!</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Visualize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Input;