import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Input from './pages/Input';
import Visualize from './pages/Visualize';
import { MeshProvider } from './context/MeshContext';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    window.insidee?.init("b476a359-d384-475e-a6d5-72c365d59b15");
  }, []);

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
