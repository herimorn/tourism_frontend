import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Maximize2, MinusCircle, PlusCircle, Info } from 'lucide-react';

interface VRViewerProps {
  scenes: {
    url: string;
    label?: string;
    hotspots?: Array<{
      position: [number, number, number];
      label: string;
      description?: string;
    }>;
  }[];
  initialScene?: number;
  onSceneChange?: (index: number) => void;
}

interface SceneProps {
  url: string;
  visible: boolean;
  hotspots?: Array<{
    position: [number, number, number];
    label: string;
    description?: string;
  }>;
  onHotspotClick: (hotspot: any) => void;
}

function Scene({ url, visible, hotspots, onHotspotClick }: SceneProps) {
  const texture = useTexture(url);
  const { camera } = useThree();
  
  useEffect(() => {
    if (visible) {
      camera.rotation.set(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [visible, camera]);

  return (
    <group visible={visible}>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      {hotspots?.map((hotspot, index) => (
        <group key={index} position={hotspot.position}>
          <Html center>
            <button
              onClick={() => onHotspotClick(hotspot)}
              className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Info className="w-4 h-4 text-blue-600" />
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="text-white text-center">
        <div className="mb-4">Loading Scene...</div>
        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function VRViewer({ scenes, initialScene = 0, onSceneChange }: VRViewerProps) {
  const [currentScene, setCurrentScene] = useState(initialScene);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const handleSceneChange = (newScene: number) => {
    setCurrentScene(newScene);
    onSceneChange?.(newScene);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      controlsRef.current.object.fov = Math.max(30, Math.min(90, controlsRef.current.object.fov + delta));
      controlsRef.current.object.updateProjectionMatrix();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-full h-[600px]'} rounded-lg overflow-hidden`}
    >
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Environment preset="sunset" />
        {scenes.map((scene, index) => (
          <Scene
            key={index}
            url={scene.url}
            visible={currentScene === index}
            hotspots={scene.hotspots}
            onHotspotClick={setSelectedHotspot}
          />
        ))}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          autoRotate={false}
          rotateSpeed={-0.5}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
        <LoadingScreen />
      </Canvas>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full text-white">
        <button
          onClick={() => handleSceneChange(Math.max(0, currentScene - 1))}
          disabled={currentScene === 0}
          className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-sm font-medium">
            {scenes[currentScene]?.label || `Scene ${currentScene + 1}/${scenes.length}`}
          </span>
        </div>

        <button
          onClick={() => handleSceneChange(Math.min(scenes.length - 1, currentScene + 1))}
          disabled={currentScene === scenes.length - 1}
          className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="border-l border-white/20 h-8 mx-2" />

        <button
          onClick={() => handleZoom(-10)}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleZoom(10)}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <MinusCircle className="w-5 h-5" />
        </button>

        <button
          onClick={handleFullscreen}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hotspot Info */}
      {selectedHotspot && (
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">{selectedHotspot.label}</h3>
          {selectedHotspot.description && (
            <p className="text-sm text-gray-600">{selectedHotspot.description}</p>
          )}
          <button
            onClick={() => setSelectedHotspot(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}