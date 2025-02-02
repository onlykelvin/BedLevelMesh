import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Input from './pages/Input';
import Visualize from './pages/Visualize';
import { MeshProvider } from './context/MeshContext';

function App() {
  return (
    <MeshProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="input" element={<Input />} />
          <Route path="visualize" element={<Visualize />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MeshProvider>
  );
}

export default App;
