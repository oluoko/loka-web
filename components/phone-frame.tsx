"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const REST = {
  rotation: { x: -0, y: 1.15, z: -0.11 },
  position: { x: 0, y: -0.5, z: 0 },
  scale: 0.15,
};

export function PhoneFrame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const phoneRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    new GLTFLoader().load("/phone-frame.gltf", (gltf) => {
      const phone = gltf.scene;
      phone.scale.setScalar(REST.scale);
      phone.rotation.set(REST.rotation.x, REST.rotation.y, REST.rotation.z);
      phone.position.set(REST.position.x, REST.position.y, REST.position.z);
      scene.add(phone);
      phoneRef.current = phone;
    });

    const onScroll = () => {
      const phone = phoneRef.current;
      if (!phone) return;
      gsap.to(phone.position, {
        y: REST.position.y - 0.04,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () =>
          gsap.to(phone.position, {
            y: REST.position.y,
            duration: 0.4,
            ease: "power2.out",
          }),
      });
    };

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    const tick = () => {
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
