import * as THREE from "three";
import { gsap } from "./config.js";

export function animateDesign() {
  const cleanups = [];
  const planetCleanup = initCosmicPlanet("canvas-container");
  if (planetCleanup) cleanups.push(planetCleanup);
  const revealCleanup = animateReveal();
  if (revealCleanup) cleanups.push(revealCleanup);
  return () => cleanups.forEach((fn) => fn());
}

export function initCosmicPlanet(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // --- Scene Setup ---
  const scene = new THREE.Scene();

  // --- Camera Setup ---
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 16;

  // --- Renderer Setup (transparent background) ---
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // Transparent background
  container.appendChild(renderer.domElement);

  // --- Particles Configuration ---
  const planetCount = 2500;
  const ringCount = 1200;
  const starCount = 0;
  const totalParticles = planetCount + ringCount + starCount;

  const positions = new Float32Array(totalParticles * 3);
  const colors = new Float32Array(totalParticles * 3);
  const sizes = new Float32Array(totalParticles);
  const initialPositions = new Float32Array(totalParticles * 3);
  const velocities = new Float32Array(totalParticles * 3);

  const nebulaColors = {
  primary: new THREE.Color("#AB37FF"),   
  secondary: new THREE.Color("#000"), 
  accent: new THREE.Color("#fff"),    

  };

  const tempColor = new THREE.Color();

  for (let i = 0; i < totalParticles; i++) {
    let x = 0, y = 0, z = 0;
    let r = 0, g = 0, b = 0;
    let particleSize = 1.2;

    if (i < planetCount) {
      // 1. Globe surface (Fibonacci Sphere formulation for evenly distributed particles)
      const radius = 3;
      const phi = Math.acos(-1 + (2 * i) / planetCount);
      const theta = Math.sqrt(planetCount * Math.PI) * phi;

      const rEff = radius + (Math.random() - 0.5) * 0.15;
      x = rEff * Math.sin(phi) * Math.cos(theta);
      y = rEff * Math.sin(phi) * Math.sin(theta);
      z = rEff * Math.cos(phi);

      const mixRatio = (y + radius) / (radius * 2); 
      tempColor.copy(nebulaColors.primary).lerp(nebulaColors.secondary, mixRatio);
      r = tempColor.r;
      g = tempColor.g;
      b = tempColor.b;
      particleSize = Math.random() * 1.5 + 0.8;

    } else if (i < planetCount + ringCount) {
      // 2. Orbital Flat Ring
      const ringIndex = i - planetCount;
      const innerRadius = 3.6;
      const outerRadius = 6;
      const rRing = innerRadius + (ringIndex / ringCount) * (outerRadius - innerRadius) + (Math.random() - 0.5) * 0.2;
      const angle = Math.random() * Math.PI * 2;

      const tempX = rRing * Math.cos(angle);
      const tempZ = rRing * Math.sin(angle);
      const tempY = (Math.random() - 0.5) * 0.15;

      x = tempX;
      y = tempY;
      z = tempZ;

      const mixRatio = (rRing - innerRadius) / (outerRadius - innerRadius);
      tempColor.copy(nebulaColors.accent).lerp(nebulaColors.secondary, mixRatio);
      r = tempColor.r;
      g = tempColor.g;
      b = tempColor.b;
      particleSize = Math.random() * 1.8 + 0.5;

    } else {
      // 3. Ambient surrounding stardust field
      const starIndex = i - (planetCount + ringCount);
      const rStar = 9.0 + Math.random() * 6.0;
      const phi = Math.acos(-1 + (2 * starIndex) / starCount);
      const theta = Math.sqrt(starCount * Math.PI) * phi;

      x = rStar * Math.sin(phi) * Math.cos(theta);
      y = rStar * Math.sin(phi) * Math.sin(theta);
      z = rStar * Math.cos(phi);

      tempColor.copy(nebulaColors.accent).multiplyScalar(0.7);
      r = tempColor.r;
      g = tempColor.g;
      b = tempColor.b;
      particleSize = Math.random() * 1.0 + 0.5;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    initialPositions[i * 3] = x;
    initialPositions[i * 3 + 1] = y;
    initialPositions[i * 3 + 2] = z;

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;

    sizes[i] = particleSize;

    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;
  }

  const particleTexture = createCircularParticleTexture();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Material with blending and soft round points
  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: particleTexture,
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Ambient core wireframe and glowing mesh
  const coreGeometry = new THREE.SphereGeometry(2.5, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: nebulaColors.primary,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(coreMesh);

  const auraGeometry = new THREE.IcosahedronGeometry(3, 2);
  const auraMaterial = new THREE.MeshBasicMaterial({
    color: nebulaColors.secondary,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
  });
  const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
  scene.add(auraMesh);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(nebulaColors.primary, 3, 20);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // --- Mouse interaction ---
  const mouse = new THREE.Vector2(-9999, -9999);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouse3D = new THREE.Vector3();
  let hasMoved = false;

  const handleMouseMove = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    hasMoved = true;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handleMouseLeave = () => {
    mouse.set(-9999, -9999);
    hasMoved = false;
  };

  renderer.domElement.addEventListener("mousemove", handleMouseMove);
  renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

  // --- Animation loop ---
  let frameId;
  const rotateSpeedY = 0.003;

  const animate = () => {
    frameId = requestAnimationFrame(animate);

    coreMesh.rotation.y += 0.001;
    coreMesh.rotation.x += 0.0005;
    auraMesh.rotation.y -= 0.002;

    if (hasMoved) {
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);
    } else {
      mouse3D.set(-9999, -9999, -9999);
    }

    const posAttr = geometry.getAttribute("position");
    const positionsArray = posAttr.array;

    const mouseRepulsionRadius = 2.2;
    const repulsionStrength = 0.16;
    const springBackCoeff = 0.07;
    const friction = 0.88;

    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3;
      let px = positionsArray[i3];
      let py = positionsArray[i3 + 1];
      let pz = positionsArray[i3 + 2];

      const ix = initialPositions[i3];
      const iy = initialPositions[i3 + 1];
      const iz = initialPositions[i3 + 2];

      // Safe rotate targets
      const actualRotSpeedY = (i < planetCount) ? rotateSpeedY : (i < planetCount + ringCount) ? rotateSpeedY * 1.5 : rotateSpeedY * 0.1;
      const cosAngleY = Math.cos(actualRotSpeedY);
      const sinAngleY = Math.sin(actualRotSpeedY);

      // Rotate around Y-axis
      const rotatedY_X = ix * cosAngleY - iz * sinAngleY;
      const rotatedY_Z = ix * sinAngleY + iz * cosAngleY;
      const rotatedY_Y = iy;

      // Add small vertical rotation around X-axis
      const actualRotSpeedX = actualRotSpeedY * 0.15;
      const cosAngleX = Math.cos(actualRotSpeedX);
      const sinAngleX = Math.sin(actualRotSpeedX);

      const rotatedTargetX = rotatedY_X;
      const rotatedTargetY = rotatedY_Y * cosAngleX - rotatedY_Z * sinAngleX;
      const rotatedTargetZ = rotatedY_Y * sinAngleX + rotatedY_Z * cosAngleX;

      initialPositions[i3] = rotatedTargetX;
      initialPositions[i3 + 1] = rotatedTargetY;
      initialPositions[i3 + 2] = rotatedTargetZ;

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2];

      // Displacement
      const dx = px - mouse3D.x;
      const dy = py - mouse3D.y;
      const dz = pz - mouse3D.z;
      const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distToMouse < mouseRepulsionRadius && distToMouse > 0.01) {
        const nx = dx / distToMouse;
        const ny = dy / distToMouse;
        const nz = dz / distToMouse;
        const force = (1.0 - distToMouse / mouseRepulsionRadius) * repulsionStrength;
        
        vx += nx * force;
        vy += ny * force;
        vz += nz * force;
      }

      // Restoring force
      const rdx = rotatedTargetX - px;
      const rdy = rotatedTargetY - py;
      const rdz = rotatedTargetZ - pz;

      vx += rdx * springBackCoeff;
      vy += rdy * springBackCoeff;
      vz += rdz * springBackCoeff;

      vx *= friction;
      vy *= friction;
      vz *= friction;

      if (i >= planetCount + ringCount) {
        vx += (Math.random() - 0.5) * 0.01;
        vy += (Math.random() - 0.5) * 0.01;
        vz += (Math.random() - 0.5) * 0.01;
      }

      px += vx;
      py += vy;
      pz += vz;

      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;

      positionsArray[i3] = px;
      positionsArray[i3 + 1] = py;
      positionsArray[i3 + 2] = pz;
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
  };

  animate();

  const handleResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  resizeObserver.observe(container);

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    if (renderer.domElement && container.contains(renderer.domElement)) {
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
      container.removeChild(renderer.domElement);
    }
  };

  function createCircularParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    return new THREE.CanvasTexture(canvas);
  }
}

function animateReveal() {
  const section = document.querySelector("#design");
  if (!section) return;

  const title = section.querySelector(".title");
  const left = section.querySelector(".design__left");
  const right = section.querySelector(".design__right");
  const items = section.querySelectorAll(".design__item");
  const elements = [title, left, right].filter(Boolean);

  if (!elements.length) return;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add({ all: "all", stacked: "(max-width: 1023px)" }, (context) => {
      const isStacked = context.conditions.stacked;

      gsap.set(elements, { y: 60, opacity: 0 });
      gsap.set(items, { y: 30, opacity: 0 });

      if (isStacked) {
        [...elements, ...items].forEach((item) => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          });
        });
      } else {
        gsap.to(title, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        });

        gsap.to([left, right], {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        });

        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: left,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        });
      }
    });
  }, section);

  return () => ctx.revert();
}
