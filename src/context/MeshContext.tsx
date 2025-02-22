import React, { createContext, useContext, useState } from 'react';

type MeshContextType = {
  meshData: number[][] | null;
  setMeshData: (data: number[][]) => void;
};

const MeshContext = createContext<MeshContextType | undefined>(undefined);

export const MeshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meshData, setMeshData] = useState<number[][] | null>(null);

  return (
    <MeshContext.Provider value={{ meshData, setMeshData }}>
      {children}
    </MeshContext.Provider>
  );
};

export const useMeshContext = () => {
  const context = useContext(MeshContext);
  if (context === undefined) {
    throw new Error('useMeshContext must be used within a MeshProvider');
  }
  return context;
};