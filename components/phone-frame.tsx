"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const REST = {
  rotation: { x: -0.6, y: 1.6, z: -0.24 },
  position: { x: 0, y: -0.5, z: 0 },
  scale: 0.13,
};

const SNAP_DELAY_MS = 6700;

export function PhoneFrame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const phoneRef = useRef<THREE.Group | null>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    rotX: REST.rotation.x,
    rotY: REST.rotation.y,
    rotZ: REST.rotation.z,
  });

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

    const scheduleSnap = () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => {
        const phone = phoneRef.current;
        if (!phone) return;
        gsap.to(phone.rotation, {
          x: REST.rotation.x,
          y: REST.rotation.y,
          z: REST.rotation.z,
          duration: 1.4,
          ease: "elastic.out(1, 0.6)",
          onComplete: () => {
            dragStartRef.current.rotX = REST.rotation.x;
            dragStartRef.current.rotY = REST.rotation.y;
            dragStartRef.current.rotZ = REST.rotation.z;
          },
        });
      }, SNAP_DELAY_MS);
    };

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

    let dragActive = false;

    const onPointerDown = (e: PointerEvent) => {
      dragActive = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        rotX: phoneRef.current?.rotation.x ?? REST.rotation.x,
        rotY: phoneRef.current?.rotation.y ?? REST.rotation.y,
        rotZ: phoneRef.current?.rotation.z ?? REST.rotation.z,
      };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragActive || !phoneRef.current) return;
      const { x, y, rotX, rotY, rotZ } = dragStartRef.current;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      phoneRef.current.rotation.y = rotY + dx * 0.008;
      phoneRef.current.rotation.x = rotX + dy * 0.008;
      phoneRef.current.rotation.z = rotZ - dx * 0.003;
    };

    const onPointerUp = () => {
      if (!dragActive) return;
      dragActive = false;
      canvas.style.cursor = "grab";
      scheduleSnap();
    };

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    const tick = () => {
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab" />;
}
