import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useBakery } from '../context/BakeryContext';
import { Sparkles, Layers, RotateCcw, ChevronDown, ChevronUp, ShoppingBag, Eye, ArrowLeft } from 'lucide-react';

export const Atelier3DScene: React.FC = () => {
  const { setActiveView, addToCart, desserts } = useBakery();
  const mountRef = useRef<HTMLDivElement>(null);

  // UI Dock States
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 to 1
  const [activeFinish, setActiveFinish] = useState<'rubis' | 'opera' | 'pistache'>('rubis');
  const [activeCamPreset, setActiveCamPreset] = useState<'perspective' | 'exploded' | 'crown' | 'side'>('perspective');

  // Ref to pass user interactive controls to Three.js loop without re-triggering effect
  const controlStateRef = useRef({
    exploded: 0,
    finish: 'rubis' as 'rubis' | 'opera' | 'pistache',
    targetCamPos: new THREE.Vector3(0, 2.2, 4.6),
    targetLookAt: new THREE.Vector3(0, 0.9, 0),
    isInteracting: false,
  });

  // Keep ref synchronized with React states
  useEffect(() => {
    controlStateRef.current.exploded = explodedAmount;
  }, [explodedAmount]);

  useEffect(() => {
    controlStateRef.current.finish = activeFinish;
  }, [activeFinish]);

  const setCameraPreset = (preset: 'perspective' | 'exploded' | 'crown' | 'side') => {
    setActiveCamPreset(preset);
    if (preset === 'perspective') {
      controlStateRef.current.targetCamPos.set(0, 2.2, 4.6);
      controlStateRef.current.targetLookAt.set(0, 0.9, 0);
      setExplodedAmount(0);
    } else if (preset === 'exploded') {
      controlStateRef.current.targetCamPos.set(2.4, 2.8, 3.8);
      controlStateRef.current.targetLookAt.set(0, 1.4, 0);
      setExplodedAmount(0.85);
    } else if (preset === 'crown') {
      controlStateRef.current.targetCamPos.set(0, 3.6, 1.8);
      controlStateRef.current.targetLookAt.set(0, 1.3, 0);
    } else if (preset === 'side') {
      controlStateRef.current.targetCamPos.set(4.0, 1.2, 0);
      controlStateRef.current.targetLookAt.set(0, 0.8, 0);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera & WebGLRenderer Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf7f2);
    scene.fog = new THREE.FogExp2(0xfaf7f2, 0.038);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 4.6);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. Studio Environment Map (RoomEnvironment) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // --- 3. Studio PBR Lighting Rig ---
    const hemiLight = new THREE.HemisphereLight(0xfff7ea, 0x3d352e, 0.9);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffeed1, 2.4);
    keyLight.position.set(4, 7, 4);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd9ebff, 0.8);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc5a059, 1.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // --- 4. Contact Shadow Plane & Marble Surface ---
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x241d17,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // --- 5. Composite Procedural Haute Pâtisserie (THREE.Group) ---
    // 12 distinct functional & architectural components
    const entremetRoot = new THREE.Group();
    scene.add(entremetRoot);

    // Part 1: Matte porcelain display pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.65, 1.8, 0.16, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede3,
      roughness: 0.42,
      metalness: 0.04,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.08;
    pedestalMesh.receiveShadow = true;
    entremetRoot.add(pedestalMesh);

    // Part 2: Gold rim inlay around pedestal
    const pedestalRimGeo = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.95,
    });
    const pedestalRimMesh = new THREE.Mesh(pedestalRimGeo, goldMat);
    pedestalRimMesh.rotation.x = Math.PI / 2;
    pedestalRimMesh.position.y = 0.16;
    entremetRoot.add(pedestalRimMesh);

    // Group for the Explodable Dessert Layers
    const layersGroup = new THREE.Group();
    layersGroup.position.y = 0.16;
    entremetRoot.add(layersGroup);

    // Part 3: Almond Sablé Crust Base
    const sableGeo = new THREE.CylinderGeometry(1.28, 1.3, 0.14, 48);
    const sableMat = new THREE.MeshStandardMaterial({
      color: 0xd9b47e,
      roughness: 0.82,
      metalness: 0.05,
    });
    const sableMesh = new THREE.Mesh(sableGeo, sableMat);
    sableMesh.position.y = 0.07;
    sableMesh.castShadow = true;
    sableMesh.receiveShadow = true;
    layersGroup.add(sableMesh);

    // Part 4: Layered Joconde Sponge Cake
    const jocondeGeo = new THREE.CylinderGeometry(1.22, 1.25, 0.18, 48);
    const jocondeMat = new THREE.MeshStandardMaterial({
      color: 0xefd19f,
      roughness: 0.75,
      metalness: 0.05,
    });
    const jocondeMesh = new THREE.Mesh(jocondeGeo, jocondeMat);
    jocondeMesh.position.y = 0.23;
    jocondeMesh.castShadow = true;
    layersGroup.add(jocondeMesh);

    // Part 5: Wild Fruit Compote Confit Core
    const compoteGeo = new THREE.CylinderGeometry(1.12, 1.15, 0.16, 48);
    const compoteMat = new THREE.MeshStandardMaterial({
      color: 0x8a0f28,
      roughness: 0.15,
      metalness: 0.1,
    });
    const compoteMesh = new THREE.Mesh(compoteGeo, compoteMat);
    compoteMesh.position.y = 0.40;
    compoteMesh.castShadow = true;
    layersGroup.add(compoteMesh);

    // Part 6: Tahitian Vanilla Bean Mousse Interior
    const mousseGeo = new THREE.CylinderGeometry(1.18, 1.22, 0.32, 48);
    const mousseMat = new THREE.MeshStandardMaterial({
      color: 0xfffaea,
      roughness: 0.78,
      metalness: 0.02,
    });
    const mousseMesh = new THREE.Mesh(mousseGeo, mousseMat);
    mousseMesh.position.y = 0.64;
    mousseMesh.castShadow = true;
    layersGroup.add(mousseMesh);

    // Part 7: High-Gloss Mirror Glaze Dome
    const glazeGeo = new THREE.SphereGeometry(1.26, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const glazeMat = new THREE.MeshPhysicalMaterial({
      color: 0x9e122b,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
    });
    const glazeMesh = new THREE.Mesh(glazeGeo, glazeMat);
    glazeMesh.position.y = 0.64;
    glazeMesh.castShadow = true;
    layersGroup.add(glazeMesh);

    // Part 8: 24k Gold Leaf Trim Base Band
    const goldBandGeo = new THREE.TorusGeometry(1.24, 0.03, 16, 48);
    const goldBandMesh = new THREE.Mesh(goldBandGeo, goldMat);
    goldBandMesh.rotation.x = Math.PI / 2;
    goldBandMesh.position.y = 0.65;
    layersGroup.add(goldBandMesh);

    // Part 9: Crown Topping Group (Raspberries & Gold Flakes)
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 1.35;
    layersGroup.add(crownGroup);

    // 5 sculptural berry drupelet clusters
    const berryGeo = new THREE.DodecahedronGeometry(0.14, 1);
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0xb51230,
      roughness: 0.35,
      metalness: 0.05,
    });

    const berryOffsets = [
      [0, 0.02, 0],
      [0.24, -0.02, 0.12],
      [-0.22, -0.02, 0.14],
      [0.15, -0.02, -0.22],
      [-0.18, -0.02, -0.20],
    ];

    berryOffsets.forEach(([bx, by, bz]) => {
      const bMesh = new THREE.Mesh(berryGeo, berryMat);
      bMesh.position.set(bx, by, bz);
      bMesh.scale.set(1, 1.1, 1);
      bMesh.castShadow = true;
      crownGroup.add(bMesh);
    });

    // Part 10: Mint Micro-Leaf Accent
    const leafGeo = new THREE.ConeGeometry(0.1, 0.22, 5);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e6634,
      roughness: 0.45,
      metalness: 0.1,
    });
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.rotation.z = 0.6;
    leafMesh.position.set(0.18, 0.16, 0.08);
    crownGroup.add(leafMesh);

    // Part 11: 24k Gold Leaf Flakes atop the dome
    const flakeGeo = new THREE.PlaneGeometry(0.08, 0.08);
    for (let f = 0; f < 6; f++) {
      const flake = new THREE.Mesh(flakeGeo, goldMat);
      const angle = (f / 6) * Math.PI * 2;
      flake.position.set(Math.cos(angle) * 0.34, 0.06 + (f % 2) * 0.02, Math.sin(angle) * 0.34);
      flake.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
      crownGroup.add(flake);
    }

    // Part 12: Hand-Spun Caramel Sugar Halo
    const haloGeo = new THREE.TorusGeometry(0.55, 0.022, 16, 64);
    const haloMat = new THREE.MeshPhysicalMaterial({
      color: 0xf2a641,
      roughness: 0.1,
      transmission: 0.88,
      ior: 1.54,
      thickness: 0.4,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2 + 0.15;
    haloMesh.rotation.y = 0.2;
    haloMesh.position.set(0, 0.32, 0);
    crownGroup.add(haloMesh);

    // --- 6. Controls & Smooth Damping ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 2.2;
    controls.maxDistance = 8.5;
    controls.target.set(0, 0.9, 0);

    // Scratch math helpers outside tick (Zero GC in loop)
    const _targetCam = new THREE.Vector3();
    const _targetLook = new THREE.Vector3();

    // Base Y anchors for exploded separations
    const initialYs = {
      sable: 0.07,
      joconde: 0.23,
      compote: 0.40,
      mousse: 0.64,
      glaze: 0.64,
      goldBand: 0.65,
      crown: 1.35,
    };

    let isUserInteracting = false;
    controls.addEventListener('start', () => {
      isUserInteracting = true;
    });
    controls.addEventListener('end', () => {
      isUserInteracting = false;
    });

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const { exploded, finish, targetCamPos, targetLookAt } = controlStateRef.current;

      // 1. Update material colors based on active finish preset
      if (finish === 'rubis') {
        glazeMat.color.setHex(0x9e122b);
        compoteMat.color.setHex(0x8a0f28);
      } else if (finish === 'opera') {
        glazeMat.color.setHex(0x1a120c); // Dark mirror chocolate
        compoteMat.color.setHex(0x3d2719); // Espresso ganache
      } else if (finish === 'pistache') {
        glazeMat.color.setHex(0x43683a); // Pistachio emerald
        compoteMat.color.setHex(0xb26027); // Roasted praliné
      }

      // 2. Smoothly damp exploded layer separations
      sableMesh.position.y = THREE.MathUtils.damp(sableMesh.position.y, initialYs.sable, 10, delta);
      jocondeMesh.position.y = THREE.MathUtils.damp(jocondeMesh.position.y, initialYs.joconde + exploded * 0.45, 8, delta);
      compoteMesh.position.y = THREE.MathUtils.damp(compoteMesh.position.y, initialYs.compote + exploded * 0.95, 8, delta);
      mousseMesh.position.y = THREE.MathUtils.damp(mousseMesh.position.y, initialYs.mousse + exploded * 1.5, 8, delta);
      glazeMesh.position.y = THREE.MathUtils.damp(glazeMesh.position.y, initialYs.glaze + exploded * 2.1, 8, delta);
      goldBandMesh.position.y = THREE.MathUtils.damp(goldBandMesh.position.y, initialYs.goldBand + exploded * 2.1, 8, delta);
      crownGroup.position.y = THREE.MathUtils.damp(crownGroup.position.y, initialYs.crown + exploded * 2.65, 8, delta);

      // Subtle slow majestic rotation when idle
      if (!isUserInteracting) {
        entremetRoot.rotation.y += 0.003;
        haloMesh.rotation.z += 0.008;
      }

      // Smooth camera interpolation towards active preset
      _targetCam.copy(targetCamPos);
      _targetLook.copy(targetLookAt);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCam.x, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCam.y, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCam.z, 4, delta);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 5, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 5, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 5, delta);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleOrder3DCurrent = () => {
    const selected = activeFinish === 'opera' ? desserts[1] : desserts[0];
    addToCart({
      id: `3d-${Date.now()}`,
      type: 'single',
      dessertId: selected.id,
      dessertName: selected.name,
      unitPrice: selected.price,
      quantity: 1,
      imageUrl: selected.imageUrl,
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[640px] bg-[#FAF7F2] overflow-hidden select-none">
      {/* 100% Unobstructed 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Minimal Spec Badge (Non-obstructing) */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('showcase')}
            className="pointer-events-auto p-2.5 bg-stone-900 text-white hover:bg-[#9E7D3B] transition-colors rounded-none shadow-md flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Showcase</span>
          </button>

          <div className="bg-white/90 border border-[#E8E2D8] px-3.5 py-2 shadow-xs text-xs">
            <span className="text-[10px] uppercase font-semibold text-[#9E7D3B] tracking-wider block">
              3D Pâtisserie Atelier
            </span>
            <span className="font-serif text-sm font-semibold text-stone-900">
              {activeFinish === 'rubis' ? 'Le Rubis Framboise' : activeFinish === 'opera' ? "L'Opéra Millésime" : 'Le Pistache Impérial'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Instruction Overlay */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none hidden sm:block">
        <div className="bg-white/85 border border-[#E8E2D8] px-3.5 py-2 text-right shadow-xs text-xs text-stone-600">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">
            Interactive Viewport
          </span>
          <span>Click & Drag to Rotate · Scroll to Zoom</span>
        </div>
      </div>

      {/* Ergonomic Viewport-First Collapsible Bottom Control Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[840px] px-4 pointer-events-none">
        {/* Toggle Button attached to top of dock */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsDockOpen(!isDockOpen)}
            className="pointer-events-auto px-4 py-1.5 bg-stone-900 text-stone-200 hover:text-white hover:bg-[#9E7D3B] border border-stone-800 text-[11px] font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center gap-1 cursor-pointer"
          >
            {isDockOpen ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            )}
          </button>
        </div>

        {/* The Solid Dock Body (No backdrop-filter over WebGL to prevent stalls) */}
        {isDockOpen && (
          <div className="pointer-events-auto bg-stone-900 border border-[#C5A059] shadow-2xl p-4 sm:p-5 text-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Finish Swatches */}
              <div className="md:col-span-4 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  Glaze & Flavor Finish
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFinish('rubis')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                      activeFinish === 'rubis' ? 'border-[#C5A059] bg-[#9e122b]/40 text-white font-medium' : 'border-stone-700 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9e122b]" />
                    <span>Ruby</span>
                  </button>

                  <button
                    onClick={() => setActiveFinish('opera')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                      activeFinish === 'opera' ? 'border-[#C5A059] bg-stone-800 text-white font-medium' : 'border-stone-700 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3d2719]" />
                    <span>Opéra</span>
                  </button>

                  <button
                    onClick={() => setActiveFinish('pistache')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                      activeFinish === 'pistache' ? 'border-[#C5A059] bg-[#43683a]/40 text-white font-medium' : 'border-stone-700 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#43683a]" />
                    <span>Pistachio</span>
                  </button>
                </div>
              </div>

              {/* Exploded View Separation Slider */}
              <div className="md:col-span-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Architectural Layers</span>
                  </span>
                  <span className="text-white font-mono tabular-nums">{Math.round(explodedAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedAmount}
                  onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer h-1.5 bg-stone-700 rounded-none"
                />
              </div>

              {/* Add to Bag CTA */}
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={handleOrder3DCurrent}
                  className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#d6b26c] text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order ($16.50)</span>
                </button>
              </div>
            </div>

            {/* Camera Viewpoints & Status Strip */}
            <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mr-1">
                  Camera:
                </span>
                <button
                  onClick={() => setCameraPreset('perspective')}
                  className={`px-2 py-1 text-[11px] uppercase transition-colors cursor-pointer ${
                    activeCamPreset === 'perspective' ? 'bg-[#C5A059] text-stone-900 font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Perspective
                </button>
                <button
                  onClick={() => setCameraPreset('exploded')}
                  className={`px-2 py-1 text-[11px] uppercase transition-colors cursor-pointer ${
                    activeCamPreset === 'exploded' ? 'bg-[#C5A059] text-stone-900 font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Exploded
                </button>
                <button
                  onClick={() => setCameraPreset('crown')}
                  className={`px-2 py-1 text-[11px] uppercase transition-colors cursor-pointer ${
                    activeCamPreset === 'crown' ? 'bg-[#C5A059] text-stone-900 font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Crown View
                </button>
                <button
                  onClick={() => setCameraPreset('side')}
                  className={`px-2 py-1 text-[11px] uppercase transition-colors cursor-pointer ${
                    activeCamPreset === 'side' ? 'bg-[#C5A059] text-stone-900 font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Elevation
                </button>
              </div>

              {/* Clean Static Status Indicator (No Pulsing Dots) */}
              <div className="text-[10px] text-stone-400 font-mono tracking-tight flex items-center gap-2">
                <span>PBR STUDIO ENVIRONMENT</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-300">60 FPS DAMPED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
