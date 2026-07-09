"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls, Html, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import { motion, AnimatePresence } from "framer-motion";

const screens = [
  { id: "code", bg: "#000000" },
  { id: "terminal", bg: "#1E1E1E" },
  { id: "wp", bg: "#F0F0F1" },
  { id: "analytics", bg: "#0F172A" },
];

function MiniCodeEditor() {
  return (
    <div className="w-full h-full p-8 font-mono text-left bg-[#1E1E1E] text-[#D4D4D4] flex flex-col relative overflow-hidden">
      <div className="flex gap-2 mb-6 border-b border-[#333] pb-2">
        <span className="text-[#569CD6]">import</span>
        <span className="text-[#4EC9B0]">React</span>
        <span className="text-[#569CD6]">from</span>
        <span className="text-[#CE9178]">&apos;react&apos;</span>;
      </div>
      <div className="space-y-2 opacity-80 text-sm">
        <div className="flex gap-2"><span className="text-[#569CD6]">export default function</span> <span className="text-[#DCDCAA]">PremiumExperience</span>() {'{'}</div>
        <div className="pl-6 flex gap-2"><span className="text-[#569CD6]">return</span> (</div>
        <div className="pl-12 flex gap-2"><span className="text-[#808080]">&lt;</span><span className="text-[#569CD6]">div</span> <span className="text-[#9CDCFE]">className</span>=<span className="text-[#CE9178]">&quot;flex items-center&quot;</span><span className="text-[#808080]">&gt;</span></div>
        <div className="pl-18 flex gap-2"><span className="text-[#808080]">&lt;</span><span className="text-[#4EC9B0]">HighPerformance</span> <span className="text-[#808080]">/&gt;</span></div>
        <div className="pl-12 flex gap-2"><span className="text-[#808080]">&lt;/</span><span className="text-[#569CD6]">div</span><span className="text-[#808080]">&gt;</span></div>
        <div className="pl-6 flex gap-2">);</div>
        <div className="flex gap-2">{'}'}</div>
      </div>
      <div className="absolute bottom-6 right-6 text-2xl font-bold text-white/10 select-none">Next.js</div>
    </div>
  );
}

function MiniTerminal() {
  return (
    <div className="w-full h-full p-8 font-mono text-left bg-black text-[#00FF00] flex flex-col relative overflow-hidden">
      <div className="space-y-2">
        <div><span className="text-blue-400">uzair@server</span>:<span className="text-white">~</span>$ ssh root@production</div>
        <div className="opacity-80">Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)</div>
        <div className="opacity-80 pb-4">Last login: Thu Jul 9 10:23:45 2026 from 192.168.1.1</div>
        <div><span className="text-red-400">root@production</span>:<span className="text-white">~</span># htop</div>
        <div className="mt-4 border border-[#00FF00]/30 p-2 text-xs opacity-70">
          <div className="flex justify-between border-b border-[#00FF00]/30 pb-1 mb-1">
            <span>CPU[||||      ] 24.1%</span>
            <span>Tasks: 42, 120 thr</span>
          </div>
          <div className="flex justify-between">
            <span>Mem[|||       ] 1.2G/8G</span>
            <span>Uptime: 45 days</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 text-2xl font-bold text-[#00FF00]/20 select-none">Linux / Docker</div>
    </div>
  );
}

function MiniWordPress() {
  return (
    <div className="w-full h-full bg-[#F0F0F1] flex text-left relative overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-[#1D2327] text-white/80 p-4 flex flex-col gap-3 text-sm">
        <div className="font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-4 h-4 bg-[#0073AA] rounded-sm"></div>
          Dashboard
        </div>
        <div>Posts</div>
        <div>Media</div>
        <div>Pages</div>
        <div className="text-[#0073AA] font-bold">WooCommerce</div>
        <div>Products</div>
        <div>Appearance</div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 bg-white text-[#1D2327]">
        <h1 className="text-3xl font-normal mb-8">WooCommerce Status</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-200 p-4 rounded-md shadow-sm">
            <div className="text-gray-500 text-sm">Net sales this month</div>
            <div className="text-2xl font-semibold">$45,231.89</div>
          </div>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm">
            <div className="text-gray-500 text-sm">Orders</div>
            <div className="text-2xl font-semibold">1,204</div>
          </div>
          <div className="col-span-2 h-32 bg-gray-50 rounded-md border border-gray-100 flex items-end p-4 gap-2">
            {[40, 60, 45, 80, 55, 90, 70, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-[#0073AA]/80 rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniAnalytics() {
  return (
    <div className="w-full h-full bg-[#0F172A] p-8 flex flex-col text-left relative overflow-hidden text-white">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-semibold">Traffic Overview</h2>
        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">+42.5%</div>
      </div>
      <div className="flex-1 flex gap-6 items-end">
        {[20, 35, 25, 45, 55, 40, 60, 75, 65, 85, 100].map((h, i) => (
          <div key={i} className="flex-1 relative group h-full flex items-end">
            <div 
              className="w-full bg-gradient-to-t from-blue-500/80 to-purple-500/80 rounded-t-md transition-all duration-1000" 
              style={{ height: `${h}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaptopScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderScreen = () => {
    switch (screens[currentScreen].id) {
      case "code": return <MiniCodeEditor />;
      case "terminal": return <MiniTerminal />;
      case "wp": return <MiniWordPress />;
      case "analytics": return <MiniAnalytics />;
      default: return null;
    }
  };

  return (
    <div
      style={{
        width: "914px",
        height: "583px",
        backgroundColor: screens[currentScreen].bg,
        display: "flex",
        flexDirection: "column",
        color: "white",
        fontFamily: "var(--font-inter)",
      }}
      className="rounded-t-lg overflow-hidden relative shadow-[inset_0_0_100px_rgba(255,255,255,0.05)] filter brightness-110 transition-colors duration-500 border border-white/5"
    >
      {/* Fake browser header */}
      <div className="w-full h-12 bg-black/40 backdrop-blur-md flex items-center px-4 space-x-2 z-20 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        <div className="flex-grow mx-4 bg-white/10 h-6 rounded-md shadow-inner flex items-center px-4">
          <span className="text-white/40 text-xs">https://uzair.dev/dashboard</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LaptopModel() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 4) / 4;
      group.current.rotation.z = Math.sin(t / 4) / 20;
      group.current.position.y = Math.sin(t / 1.5) / 10;
    }
  });

  return (
    <group ref={group}>
      {/* Screen Frame */}
      <mesh position={[0, 0, -1.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.1, 2.1, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} envMapIntensity={2} />
      </mesh>
      
      {/* Screen Content via HTML */}
      <Html
        transform
        wrapperClass="htmlScreen"
        distanceFactor={1.17}
        position={[0, 0, -1.17]}
        rotation={[0, 0, 0]}
      >
        <LaptopScreen />
      </Html>

      {/* Keyboard Base */}
      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2 + 0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 2.3, 0.1]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
      
      {/* Keyboard inner */}
      <mesh position={[0, -0.96, -0.1]} rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
        <boxGeometry args={[2.8, 1.3, 0.05]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
      </mesh>
      
      {/* Trackpad */}
      <mesh position={[0, -0.96, 0.75]} rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Glowing Apple Logo alternative (Light strip on back) */}
      <mesh position={[0, 0, -1.23]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function Hero3DLaptop() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative z-10 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#38bdf8" />
        <directionalLight position={[5, 5, -5]} intensity={1} color="#c084fc" />
        <Environment preset="city" />
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          snap={true}
        >
          <Float rotationIntensity={0.4} floatIntensity={2} speed={1.5}>
            <LaptopModel />
          </Float>
        </PresentationControls>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
