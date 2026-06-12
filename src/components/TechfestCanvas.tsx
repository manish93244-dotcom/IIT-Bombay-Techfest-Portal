import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TECHFEST_EVENTS } from '../data';
import { VisualMode } from '../types';
import { getFuzzyEventScore } from '../utils/fuzzySearch';

interface TechfestCanvasProps {
  selectedEventId: string | null;
  onNodeSelect: (id: string | null) => void;
  activeCategory: 'all' | 'competitions' | 'lectures' | 'workshops' | 'exhibitions';
  visualMode: VisualMode;
  hoveredNodeId: string | null;
  onNodeHover: (id: string | null) => void;
  searchQuery: string;
  isHighContrast: boolean;
}

export default function TechfestCanvas({
  selectedEventId,
  onNodeSelect,
  activeCategory,
  visualMode,
  hoveredNodeId,
  onNodeHover,
  searchQuery,
  isHighContrast
}: TechfestCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedEventIdRef = useRef<string | null>(selectedEventId);
  const activeCategoryRef = useRef(activeCategory);
  const visualModeRef = useRef(visualMode);
  const hoveredNodeIdRef = useRef<string | null>(hoveredNodeId);
  const searchQueryRef = useRef(searchQuery);
  const isHighContrastRef = useRef(isHighContrast);

  // Maintain refs to avoid restarting the Three.js canvas on state changes
  useEffect(() => {
    selectedEventIdRef.current = selectedEventId;
  }, [selectedEventId]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    visualModeRef.current = visualMode;
  }, [visualMode]);

  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    isHighContrastRef.current = isHighContrast;
  }, [isHighContrast]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();

    // --- 2. Camera Setup ---
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5.5;

    // --- 3. Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 4. Interactive Group Structure ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // This group holds everything that rotates automatically
    const globeGroup = new THREE.Group();
    rootGroup.add(globeGroup);

    // --- 5. Generate Atmospheric Constellations (Global Stars) ---
    const starsNum = 1500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsNum * 3);
    const starColors = new Float32Array(starsNum * 3);

    for (let i = 0; i < starsNum; i++) {
      // Create a large sphere field of stars
      const radius = 6 + Math.random() * 12;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      // Color scheme: Cyber cyan, violet, and white
      const colorRand = Math.random();
      if (isHighContrast) {
        // High contrast star colors: deep slate, indigo, and charcoal
        if (colorRand > 0.70) {
          starColors[i * 3] = 0.31; // R (indigo-600)
          starColors[i * 3 + 1] = 0.27; // G
          starColors[i * 3 + 2] = 0.9; // B
        } else if (colorRand > 0.40) {
          starColors[i * 3] = 0.09; // R (slate-800)
          starColors[i * 3 + 1] = 0.13; // B
          starColors[i * 3 + 2] = 0.24; // G
        } else {
          starColors[i * 3] = 0.4;
          starColors[i * 3 + 1] = 0.4;
          starColors[i * 3 + 2] = 0.45;
        }
      } else {
        if (colorRand > 0.70) {
          starColors[i * 3] = 0.0; // R
          starColors[i * 3 + 1] = 0.94; // G
          starColors[i * 3 + 2] = 1.0; // B
        } else if (colorRand > 0.40) {
          starColors[i * 3] = 0.54; // R
          starColors[i * 3 + 1] = 0.36; // G
          starColors[i * 3 + 2] = 0.96; // B
        } else {
          starColors[i * 3] = 0.9;
          starColors[i * 3 + 1] = 0.95;
          starColors[i * 3 + 2] = 1.0;
        }
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: isHighContrast ? 0.4 : 0.8,
      blending: isHighContrast ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // --- 6. Core 3D Wireframe Globe ---
    // Outer wireframe shell
    const coreGeometry = new THREE.IcosahedronGeometry(2.0, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isHighContrast ? 0x4f46e5 : 0x0ea5e9, // indigo-600 vs sky-500
      wireframe: true,
      transparent: true,
      opacity: isHighContrast ? 0.25 : 0.12,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // Dense inner mesh layer for dynamic grid reflection
    const denseCoreGeometry = new THREE.IcosahedronGeometry(1.98, 3);
    const denseCoreMaterial = new THREE.MeshBasicMaterial({
      color: isHighContrast ? 0x475569 : 0x8b5cf6, // slate-600 vs violet-500
      wireframe: true,
      transparent: true,
      opacity: isHighContrast ? 0.1 : 0.04,
    });
    const denseCoreMesh = new THREE.Mesh(denseCoreGeometry, denseCoreMaterial);
    globeGroup.add(denseCoreMesh);

    // Subtle equatorial tech-ring
    const equatorialRingGeo = new THREE.RingGeometry(2.3, 2.35, 64);
    const equatorialRingMat = new THREE.MeshBasicMaterial({
      color: isHighContrast ? 0x4f46e5 : 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isHighContrast ? 0.3 : 0.15,
      wireframe: true
    });
    const equatorialRing = new THREE.Mesh(equatorialRingGeo, equatorialRingMat);
    equatorialRing.rotation.x = Math.PI / 2;
    globeGroup.add(equatorialRing);

    // Secondary vertical polar ring
    const polarRingGeo = new THREE.RingGeometry(2.1, 2.15, 64);
    const polarRingMat = new THREE.MeshBasicMaterial({
      color: isHighContrast ? 0x9333ea : 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isHighContrast ? 0.2 : 0.08,
      wireframe: true
    });
    const polarRing = new THREE.Mesh(polarRingGeo, polarRingMat);
    polarRing.rotation.y = Math.PI / 4;
    globeGroup.add(polarRing);

    // --- 7. Plotting Dynamic Event Nodes ---
    const nodeMeshes: THREE.Mesh[] = [];
    const interactionColliders: THREE.Mesh[] = [];
    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);

    // Safe lookup map for index reference in raycasting
    const nodeToEventMap = new Map<string, string>();

    TECHFEST_EVENTS.forEach((event) => {
      // Calculate normalized spherical position coordinates matching original nodePosition config
      const normalPos = new THREE.Vector3(
        event.nodePosition.x,
        event.nodePosition.y,
        event.nodePosition.z
      ).normalize().multiplyScalar(2.0); // radius matching outer core

      // Component: Visual Core Node (Small bright glowing point)
      const coreGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: event.category === 'competitions' ? 0x10b981 :
               event.category === 'lectures' ? 0xef4444 :
               event.category === 'workshops' ? 0xf59e0b : 0x06b6d4,
        transparent: true,
        opacity: 0.95
      });
      const nodeCore = new THREE.Mesh(coreGeo, coreMat);
      nodeCore.position.copy(normalPos);
      nodesGroup.add(nodeCore);

      // Component: Glowing aura ring
      const auraGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: nodeCore.material.color,
        transparent: true,
        opacity: isHighContrast ? 0.4 : 0.25,
        blending: isHighContrast ? THREE.NormalBlending : THREE.AdditiveBlending
      });
      const nodeAura = new THREE.Mesh(auraGeo, auraMat);
      nodeAura.position.copy(normalPos);
      nodeCore.add(nodeAura);

      // Component: Virtual wide target collider for easy mouse pointer raycasting
      const colliderGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const colliderMat = new THREE.MeshBasicMaterial({
        visible: false // completely transparent, solely for mouse raycasting
      });
      const collider = new THREE.Mesh(colliderGeo, colliderMat);
      collider.position.copy(normalPos);
      nodesGroup.add(collider);

      // Custom attributes for retrieval inside main animation tick loop
      nodeCore.userData = { id: event.id, category: event.category, baseScale: 1.0, activeAura: nodeAura, positionVec: normalPos };
      collider.userData = { id: event.id };

      nodeMeshes.push(nodeCore);
      interactionColliders.push(collider);
      nodeToEventMap.set(collider.uuid, event.id);
    });

    // --- 8. Dynamic Tech Constellation Lines Connecting Nodes ---
    const lineMat = new THREE.LineBasicMaterial({
      color: isHighContrast ? 0x4f46e5 : 0x38bdf8,
      transparent: true,
      opacity: isHighContrast ? 0.35 : 0.25,
      blending: isHighContrast ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const activeLines: THREE.LineSegments[] = [];

    const rebuildConnections = () => {
      // Clear older lines
      activeLines.forEach((line) => nodesGroup.remove(line));
      activeLines.length = 0;

      const linePoints: THREE.Vector3[] = [];
      const currentCategory = activeCategoryRef.current;
      const searchQ = searchQueryRef.current;
      const hasSearch = searchQ.trim().length > 0;

      // Pairwise connection of nodes depending on proximity and filter categories and search
      for (let i = 0; i < nodeMeshes.length; i++) {
        const uNode = nodeMeshes[i];
        const uEvent = TECHFEST_EVENTS.find((e) => e.id === uNode.userData.id);
        if (!uEvent) continue;

        const isUActiveCat = currentCategory === 'all' || uEvent.category === currentCategory;
        const isUMatchSearch = !hasSearch || getFuzzyEventScore(uEvent, searchQ) > 0;
        const isUActive = isUActiveCat && isUMatchSearch;

        for (let j = i + 1; j < nodeMeshes.length; j++) {
          const vNode = nodeMeshes[j];
          const vEvent = TECHFEST_EVENTS.find((e) => e.id === vNode.userData.id);
          if (!vEvent) continue;

          const isVActiveCat = currentCategory === 'all' || vEvent.category === currentCategory;
          const isVMatchSearch = !hasSearch || getFuzzyEventScore(vEvent, searchQ) > 0;
          const isVActive = isVActiveCat && isVMatchSearch;

          // Connect close pairs if BOTH nodes are active and match query
          const dist = uNode.userData.positionVec.distanceTo(vNode.userData.positionVec);
          if (dist < 3.2 && (isUActive && isVActive)) {
            linePoints.push(uNode.userData.positionVec);
            linePoints.push(vNode.userData.positionVec);
          }
        }
      }

      if (linePoints.length > 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
        nodesGroup.add(connectionLines);
        activeLines.push(connectionLines);
      }
    };

    rebuildConnections();

    // --- 9. Mouse Tracker & Parallax Physics variables ---
    const mouse = new THREE.Vector2();
    let isMouseOverCanvas = false;

    // Direct mouse position targeting for smooth easing
    const targetEuler = new THREE.Euler(0, 0, 0);
    const currentEuler = new THREE.Euler(0, 0, 0);

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Update Normalized device coords
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
      isMouseOverCanvas = true;

      // Targeted angles based on mouse offset - subtle degree tilt
      targetEuler.y = mouse.x * 0.45;
      targetEuler.x = -mouse.y * 0.45;
    };

    const onMouseLeave = () => {
      isMouseOverCanvas = false;
      targetEuler.x = 0;
      targetEuler.y = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // --- 10. Click Raycasting ---
    const raycaster = new THREE.Raycaster();

    const onCanvasClick = () => {
      if (!isMouseOverCanvas) return;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactionColliders);

      if (intersects.length > 0) {
        const hitCollider = intersects[0].object as THREE.Mesh;
        const targetEventId = hitCollider.userData.id;
        onNodeSelect(targetEventId);
      } else {
        // If clicking on empty canvas space, deselect active node
        onNodeSelect(null);
      }
    };

    container.addEventListener('click', onCanvasClick);

    // --- 11. Core Animation Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      // Mode-specific aesthetic physics transformations
      const curMode = visualModeRef.current;
      const curActiveCat = activeCategoryRef.current;
      const isHC = isHighContrastRef.current;

      // Adjust wireframe & star material properties on the fly for high-contrast accessibility
      if (isHC) {
        starMaterial.color.setHex(0x1e293b); // Deep dark slate particles on light background
        starMaterial.blending = THREE.NormalBlending;
        starMaterial.opacity = 0.55;

        coreMaterial.color.setHex(0x334155); // Slate slate-700
        denseCoreMaterial.color.setHex(0x64748b); // Slate slate-500
        
        equatorialRingMat.color.setHex(0x0284c7); // sky-600
        equatorialRingMat.opacity = 0.45;
        polarRingMat.color.setHex(0x7c3aed); // violet-600
        polarRingMat.opacity = 0.35;

        lineMat.color.setHex(0x0284c7); // sky-600
        lineMat.opacity = 0.55;
        lineMat.blending = THREE.NormalBlending;
      } else {
        starMaterial.color.setHex(0xffffff); // Default white multiplication
        starMaterial.blending = THREE.AdditiveBlending;
        starMaterial.opacity = 0.8;

        coreMaterial.color.setHex(0x0ea5e9);
        denseCoreMaterial.color.setHex(0x8b5cf6);

        equatorialRingMat.color.setHex(0x00f0ff);
        equatorialRingMat.opacity = 0.15;
        polarRingMat.color.setHex(0xa855f7);
        polarRingMat.opacity = 0.08;

        lineMat.color.setHex(0x38bdf8);
        lineMat.opacity = 0.25;
        lineMat.blending = THREE.AdditiveBlending;
      }

      // Rebuild connection lines fluidly when activeCategory changes dynamically
      rebuildConnections();

      // Rotate inner elements depending on aesthetic configuration
      if (curMode === 'constellation') {
        // Starfield dynamic float pulse
        starField.rotation.y = elapsedTime * 0.02;
        starField.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;
        globeGroup.rotation.y += 0.002;
        coreMaterial.opacity = isHC ? 0.08 : 0.02;
        denseCoreMaterial.opacity = isHC ? 0.04 : 0.01;
        equatorialRing.visible = false;
        polarRing.visible = false;
      } else if (curMode === 'quantum') {
        // Fast quantum energy loop rotation
        starField.rotation.y = elapsedTime * 0.01;
        globeGroup.rotation.y += 0.009;
        globeGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        coreMaterial.opacity = isHC ? 0.25 : 0.08;
        denseCoreMaterial.opacity = isHC ? 0.35 : 0.12;
        equatorialRing.visible = true;
        polarRing.visible = true;
        equatorialRing.rotation.z = -elapsedTime * 0.6;
        polarRing.rotation.z = elapsedTime * 0.4;
      } else {
        // Classic Standard Globe
        starField.rotation.y = elapsedTime * 0.005;
        globeGroup.rotation.y += 0.004;
        coreMaterial.opacity = isHC ? 0.38 : 0.14;
        denseCoreMaterial.opacity = isHC ? 0.15 : 0.05;
        equatorialRing.visible = true;
        polarRing.visible = true;
        equatorialRing.rotation.z = -elapsedTime * 0.15;
        polarRing.rotation.z = elapsedTime * 0.1;
      }

      // Parallax mouse damping system (lerp mechanics)
      currentEuler.y += (targetEuler.y - currentEuler.y) * 0.08;
      currentEuler.x += (targetEuler.x - currentEuler.x) * 0.08;
      rootGroup.rotation.y = currentEuler.y;
      rootGroup.rotation.x = currentEuler.x;

      // Hover Raycasting Check (Runs continuously)
      let currentHoveredId: string | null = null;
      if (isMouseOverCanvas) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactionColliders);
        if (intersects.length > 0) {
          currentHoveredId = (intersects[0].object as THREE.Mesh).userData.id;
        }
      }

      if (currentHoveredId !== hoveredNodeIdRef.current) {
        onNodeHover(currentHoveredId);
      }

      // Update Node scale, opacity, and active indicator animations based on state
      const selEventId = selectedEventIdRef.current;
      const searchQ = searchQueryRef.current;
      const hasSearch = searchQ.trim().length > 0;

      nodeMeshes.forEach((mesh) => {
        const eventId = mesh.userData.id;
        const eventCat = mesh.userData.category;
        const aura = mesh.userData.activeAura as THREE.Mesh;
        const isTargeted = eventId === selEventId;
        const isHovered = eventId === currentHoveredId;
        
        const eventItem = TECHFEST_EVENTS.find((e) => e.id === eventId);
        const matchesSearch = !hasSearch || (eventItem && getFuzzyEventScore(eventItem, searchQ) > 0);

        // Check if filtered out by category or fuzzy search
        const isDimmedByCategory = curActiveCat !== 'all' && eventCat !== curActiveCat;
        const isDimmedBySearch = hasSearch && !matchesSearch;
        const isDimmed = isDimmedByCategory || isDimmedBySearch;

        // Dynamic visual properties
        let targetScale = 1.0;
        let targetOpacity = isDimmed ? (isHC ? 0.18 : 0.08) : 0.95;
        let auraScale = 1.5 + Math.sin(elapsedTime * 6) * 0.4; // breathing animation

        const meshMat = mesh.material as THREE.MeshBasicMaterial;
        const auraMat = aura ? (aura.material as THREE.MeshBasicMaterial) : null;

        if (isTargeted) {
          targetScale = 1.8;
          targetOpacity = 1.0;
          auraScale = 2.4 + Math.sin(elapsedTime * 12) * 0.6; // High frequency glow
          meshMat.color.setHex(isHC ? 0x090d16 : 0xffffff); // Deep dark slate in Light Mode, white in Dark Mode
        } else if (isHovered) {
          targetScale = 1.4;
          targetOpacity = 1.0;
          meshMat.color.setHex(isHC ? 0x0284c7 : 0x00ffff); // Deep blue / Cyan highlight
        } else {
          // Revert back to original category colors
          // Deeper high-contrast colors in Light Mode, bright neon in Dark Mode
          const originalColor = isHC
            ? (eventCat === 'competitions' ? 0x047857 : // darker emerald-700
               eventCat === 'lectures' ? 0xb91c1c : // darker red-700
               eventCat === 'workshops' ? 0xb45309 : 0x0369a1) // darker amber-700, sky-700
            : (eventCat === 'competitions' ? 0x10b981 :
               eventCat === 'lectures' ? 0xef4444 :
               eventCat === 'workshops' ? 0xf59e0b : 0x06b6d4);
          meshMat.color.setHex(originalColor);

          if (hasSearch && matchesSearch) {
            // High-intensity dynamic breathing pulse for active search results
            targetScale = 1.35 + Math.sin(elapsedTime * 5 + eventId.charCodeAt(0)) * 0.15;
            targetOpacity = 1.0;
          } else if (hasSearch && !matchesSearch) {
            targetScale = 0.45;
            targetOpacity = 0.05;
          } else if (isDimmedByCategory) {
            targetScale = 0.6;
            targetOpacity = 0.12;
          }
        }

        // Apply smooth scale interpolations
        mesh.scale.setScalar(
          THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.15)
        );
        meshMat.opacity = THREE.MathUtils.lerp(meshMat.opacity, targetOpacity, 0.15);
        if (aura && auraMat) {
          aura.scale.setScalar(auraScale);
          auraMat.opacity = isDimmed ? (isHC ? 0.06 : 0.03) : (isTargeted ? 0.6 : (isHovered ? 0.4 : 0.25));
        }
      });

      // Camera dynamic interpolation fly-to mechanism
      if (selEventId) {
        const activeNode = nodeMeshes.find((m) => m.userData.id === selEventId);
        if (activeNode) {
          // Calculate the world coordinate location of this specific node
          const worldPos = new THREE.Vector3();
          activeNode.getWorldPosition(worldPos);

          // Position the camera slightly pulled back and aligned with coordinates of the node
          const targetCamPos = worldPos.clone().normalize().multiplyScalar(4.5);
          
          // Smoothly look at and ease towards target
          camera.position.lerp(targetCamPos, 0.05);
          
          // Re-establish beautiful perspective orientation
          const currentLookAt = new THREE.Vector3(0, 0, 0);
          camera.lookAt(currentLookAt);
        }
      } else {
        // Return camera back to default standard perspective
        const defaultCamPos = new THREE.Vector3(0, 0, 5.5);
        camera.position.lerp(defaultCamPos, 0.05);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 12. Perfect Realtime Canvas Resize Handler ---
    const handleResize = () => {
      const activeWidth = container.clientWidth;
      const activeHeight = container.clientHeight;

      camera.aspect = activeWidth / activeHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(activeWidth, activeHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // --- 13. Component Cleanup ---
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onCanvasClick);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Deep dispose geometries and materials to avoid webGL visual leakage
      coreGeometry.dispose();
      coreMaterial.dispose();
      denseCoreGeometry.dispose();
      denseCoreMaterial.dispose();
      equatorialRingGeo.dispose();
      equatorialRingMat.dispose();
      polarRingGeo.dispose();
      polarRingMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      lineMat.dispose();

      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        const aura = mesh.userData.activeAura as THREE.Mesh;
        if (aura) {
          aura.geometry.dispose();
          (aura.material as THREE.Material).dispose();
        }
      });

      interactionColliders.forEach((collider) => {
        collider.geometry.dispose();
        (collider.material as THREE.Material).dispose();
      });

      activeLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, onNodeSelect, onNodeHover, searchQuery, isHighContrast]);

  return (
    <div
      ref={containerRef}
      id="techfest-canvas-container"
      className="absolute inset-0 w-full h-full z-0 overflow-hidden cursor-crosshair transition-colors duration-500"
      style={{
        background: isHighContrast
          ? 'radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgb(203, 213, 225) 100%)'
          : 'radial-gradient(circle at center, rgb(15, 23, 42) 0%, rgb(3, 7, 18) 100%)',
      }}
    />
  );
}
