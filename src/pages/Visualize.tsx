import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeshContext } from '../context/MeshContext';
import { Maximize2, Minimize2, Box, Eye, Sidebar as SidebarRight, HelpCircle, MousePointer } from 'lucide-react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface Point {
  x: number;
  y: number;
  value: number;
}

const DataPoint: React.FC<{
  position: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}> = ({ position, color, isSelected, onSelect, onHover }) => {
  const sphereSize = 0.015; // Reduced sphere size for better proportions
  
  return (
    <mesh
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
        onHover(false);
      }}
    >
      <sphereGeometry args={[sphereSize, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={isSelected ? '#ffffff' : undefined}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
};

const MeshGeometry: React.FC<{
  data: number[][];
  selectedPoint: Point | null;
  onPointSelect: (point: Point) => void;
  hoveredPoint: Point | null;
  onPointHover: (point: Point | null) => void;
  interactive: boolean;
  showLabels: boolean;
}> = ({ data, selectedPoint, onPointSelect, hoveredPoint, onPointHover, interactive, showLabels }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [minValue, maxValue] = useMemo(() => {
    const values = data.flat();
    return [Math.min(...values), Math.max(...values)];
  }, [data]);

  const generateGeometry = () => {
    if (!data || data.length === 0 || data[0].length === 0) return null;
    
    // Create a custom geometry using point positions
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];
    const colorArray = new THREE.Color();
    const range = maxValue - minValue;

    // Generate vertices using the same calculation as points
    data.forEach((row, i) => {
      row.forEach((value, j) => {
        const cols = data[0].length;
        const rows = data.length;
        const aspectRatio = cols / rows;
        
        let x, y;
        if (aspectRatio > 1) {
          x = (j / (cols - 1) - 0.5);
          y = ((rows - 1 - i) / (rows - 1) - 0.5) / aspectRatio;
        } else {
          x = (j / (cols - 1) - 0.5) * aspectRatio;
          y = ((rows - 1 - i) / (rows - 1) - 0.5);
        }
        
        const z = value * 0.1;
        vertices.push(x, y, z);

        // Generate color for vertex
        const normalizedValue = (value - minValue) / range;
        colorArray.setHSL((1 - normalizedValue) * 0.6, 1, 0.5);
        colors.push(colorArray.r, colorArray.g, colorArray.b);
      });
    });

    // Generate triangle indices
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = 0; j < data[0].length - 1; j++) {
        const topLeft = i * data[0].length + j;
        const topRight = topLeft + 1;
        const bottomLeft = (i + 1) * data[0].length + j;
        const bottomRight = bottomLeft + 1;

        // First triangle
        indices.push(topLeft, bottomLeft, topRight);
        // Second triangle
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };

  useEffect(() => {
    if (meshRef.current) {
      const geometry = generateGeometry();
      if (geometry) {
        meshRef.current.geometry = geometry;
      }
    }
  }, [data, minValue, maxValue]);
  
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {showLabels && (
        <>
          <Text
            position={[0, -0.7, 0]}
            fontSize={0.05}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Front
          </Text>
          <Text
            position={[0.7, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            fontSize={0.05}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Right
          </Text>
        </>
      )}
      <mesh ref={meshRef}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.3}
          transparent={interactive}
          opacity={interactive ? 0.9 : 1}
        />
      </mesh>
      {interactive && data.map((row, i) => 
        row.map((value, j) => {
          // Calculate normalized coordinates
          const cols = data[0].length;
          const rows = data.length;
          const aspectRatio = cols / rows;
          
          // Center and scale coordinates
          let x, y;
          if (aspectRatio > 1) {
            x = (j / (cols - 1) - 0.5);
            // Flip Y coordinate to match mesh orientation
            y = ((rows - 1 - i) / (rows - 1) - 0.5) / aspectRatio;
          } else {
            x = (j / (cols - 1) - 0.5) * aspectRatio;
            // Flip Y coordinate to match mesh orientation
            y = ((rows - 1 - i) / (rows - 1) - 0.5);
          }
          
          const z = value * 0.1; // Scale height
          const normalizedValue = (value - minValue) / (maxValue - minValue);
          const color = new THREE.Color().setHSL(
            (1 - normalizedValue) * 0.6,
            1,
            0.5
          ).getStyle();
          
          return (
            <DataPoint
              key={`${i}-${j}`}
              position={[x, y, z]} // Points now align with mesh vertices
              color={color}
              isSelected={selectedPoint?.x === j && selectedPoint?.y === i}
              onSelect={() => onPointSelect({ x: j, y: i, value })}
              onHover={(hover) => onPointHover(hover ? { x: j, y: i, value } : null)}
            />
          );
        })
      )}
    </group>
  );
};

const Visualize: React.FC = () => {
  const { meshData } = useMeshContext();
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(false);
  const controlsRef = useRef<any>(null);
  const [showHelp, setShowHelp] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [interactive, setInteractive] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const setViewpoint = (position: [number, number, number]) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      controls.reset();
      camera.position.set(...position);
      
      // For top view, ensure correct orientation
      if (position[1] > 0 && position[0] === 0 && position[2] === 0) {
        camera.up.set(0, 0, 1);
      } else {
        camera.up.set(0, 1, 0);
      }
      camera.updateProjectionMatrix();
      controls.update();
    }
  };

  // Auto-hide help overlay after 5 seconds
  useEffect(() => {
    if (showHelp) {
      const timer = setTimeout(() => {
        setShowHelp(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showHelp]);

  if (!meshData) {
    navigate('/input');
    return null;
  }

  return (
    <div className={`grid ${fullscreen ? '' : 'grid-cols-1 lg:grid-cols-3'} gap-8 max-w-full overflow-hidden`}>
      {!fullscreen && (
        <div className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Mesh Data</h3>
              <div className="text-sm text-gray-500">
                {meshData.length}x{meshData[0].length} grid
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Min Value</div>
                    <div className="text-lg font-semibold text-indigo-600">
                      {Math.min(...meshData.flat()).toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Max Value</div>
                    <div className="text-lg font-semibold text-indigo-600">
                      {Math.max(...meshData.flat()).toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meshData.map((row, i) => (
                      <tr key={i}>
                        {row.map((value, j) => (
                          <td
                            key={j}
                            onClick={() => interactive && setSelectedPoint({ x: j, y: i, value })}
                            onMouseEnter={() => interactive && setHoveredPoint({ x: j, y: i, value })}
                            onMouseLeave={() => interactive && setHoveredPoint(null)}
                            className={`px-3 py-2 text-sm font-mono cursor-pointer transition-colors ${
                              selectedPoint?.x === j && selectedPoint?.y === i
                                ? 'bg-indigo-100 font-bold'
                                : hoveredPoint?.x === j && hoveredPoint?.y === i
                                ? 'bg-gray-50'
                                : '',
                              value > 0
                                ? 'text-red-600'
                                : value < 0
                                ? 'text-blue-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {value > 0 ? '+' : ''}
                            {value.toFixed(3)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={fullscreen ? 'h-[80vh]' : 'lg:col-span-2 h-[60vh]'}>
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Visualization</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowHelp(true)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                  title="Show help"
                >
                  <HelpCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                  title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {fullscreen ? (
                    <Minimize2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  ) : (
                    <Maximize2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-left">
              <div className="inline-flex bg-gray-100 p-1.5 sm:p-2 rounded-lg">
                <button
                  onClick={() => setViewpoint([0.5, 0.8, 0.8])}
                  className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-colors"
                  title="Isometric view"
                >
                  <Box className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewpoint([0, 2, 0])}
                  className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-colors"
                  title="Top view"
                >
                  <Eye className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewpoint([2, 0, 0])}
                  className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-colors"
                  title="Side view"
                >
                  <SidebarRight className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => {
                    setInteractive(!interactive);
                    setSelectedPoint(null);
                    setHoveredPoint(null);
                  }}
                  className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                    interactive 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                  title={interactive ? "Disable interaction" : "Enable interaction"}
                >
                  <MousePointer className="w-[18px] h-[18px] sm:w-5 sm:h-5" />                  
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                    showLabels 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                  title={showLabels ? "Hide labels" : "Show labels"}
                >
                  <span className="font-mono text-xs sm:text-sm">XYZ</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full border border-gray-200 rounded-lg overflow-hidden relative" style={{ height: fullscreen ? 'calc(80vh - 180px)' : 'calc(60vh - 180px)' }}>
            {showHelp && (
              <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg z-10 max-w-xs transition-opacity duration-300">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Interactive Controls</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Click on points to highlight data</li>
                  <li>• Left click + drag to rotate</li>
                  <li>• Right click + drag to pan</li>
                  <li>• Scroll to zoom</li>
                </ul>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 mt-2"
                >
                  Got it
                </button>
              </div>
            )}
            <Canvas>
              <PerspectiveCamera
                makeDefault
                position={[0.8, 0.8, 0.8]}
                up={[0, 1, 0]}
              />
              <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              {meshData && (
                <MeshGeometry
                  data={meshData}
                  selectedPoint={selectedPoint}
                  onPointSelect={setSelectedPoint}
                  hoveredPoint={hoveredPoint}
                  onPointHover={setHoveredPoint}
                  interactive={interactive}
                  showLabels={showLabels}
                />
              )}
              <gridHelper args={[2, 20]} />
            </Canvas>
            {(selectedPoint || hoveredPoint) && (
              <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg">
                <p className="text-sm">
                  Point (
                  <span className="font-mono">
                    {(selectedPoint || hoveredPoint)?.x}, 
                    {(selectedPoint || hoveredPoint)?.y}
                  </span>
                  ) = 
                  <span className={`font-mono font-medium ml-1 ${
                    (selectedPoint || hoveredPoint)?.value > 0
                      ? 'text-red-600'
                      : (selectedPoint || hoveredPoint)?.value < 0
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}>
                    {(selectedPoint || hoveredPoint)?.value > 0 ? '+' : ''}
                    {(selectedPoint || hoveredPoint)?.value.toFixed(3)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Visualize