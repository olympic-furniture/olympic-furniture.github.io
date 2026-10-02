import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

import { finishes, type Room, type Motion } from "./room-presets";
import { roomMotion } from "./room-motion";

export function createRoomScene(host: HTMLDivElement) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2");
  if (!context) throw new Error("WebGL is unavailable");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4.5, 4.5, 3.3, -3.3, 0.1, 40);
  camera.position.set(8, 7.5, 10);
  camera.lookAt(0, 1.1, 0);
  scene.add(new THREE.HemisphereLight("#fff7e8", "#a39581", 2.1));
  const sunlight = new THREE.DirectionalLight("#fff3dc", 3);
  sunlight.position.set(-3, 8, 5);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, {
    left: -5,
    right: 5,
    top: 5,
    bottom: -5,
    near: 0.5,
    far: 20,
  });
  sunlight.shadow.normalBias = 0.025;
  sunlight.shadow.bias = -0.0001;
  scene.add(sunlight);
  const material = (color: string) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.88 });
  const wood = material(finishes[1].color);
  const floorMaterial = material(finishes[1].floor);
  const cream = material("#f2e7d3");
  const green = material("#61714d");
  const clay = material("#bb8060");
  const dark = material("#3c4137");
  const wall = material("#f6efdf");
  const rug = material("#e5dac3");
  const screenMaterial = material("#b6c0ad");
  const allMaterials = [
    wood,
    floorMaterial,
    cream,
    green,
    clay,
    dark,
    wall,
    rug,
    screenMaterial,
  ];
  const shell = new THREE.Group();
  scene.add(shell);
  function box(
    parent: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    radius = 0.025,
  ) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w / 3, h / 3, d / 3)),
      mat,
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  type AssemblyPart = {
    group: THREE.Object3D;
    target: THREE.Vector3;
    offset: THREE.Vector3;
    delay: number;
    duration: number;
    rotation: THREE.Euler;
    turn: THREE.Vector3;
    materials: THREE.Material[];
    meshes: THREE.Mesh[];
  };
  const architecture: AssemblyPart[] = [];
  let pieces: AssemblyPart[] = [];
  let furnitureIndex = 0;
  box(shell, 0, -0.1, 0, 5.6, 0.2, 4.5, wood);
  for (let i = 0; i < 14; i++) {
    assemblyPart(
      box(
        shell,
        -2.6 + i * 0.4,
        0.015,
        0,
        0.39,
        0.045,
        4.48,
        floorMaterial,
        0.003,
      ),
      new THREE.Vector3(0, 0.16, 0),
      100 + i * 32,
      700,
      new THREE.Vector3(),
      architecture,
    );
  }
  const backWall = new THREE.Group();
  backWall.position.z = -2.2;
  shell.add(backWall);
  box(backWall, 0, 1.45, 0, 5.6, 2.9, 0.12, wall);
  assemblyPart(
    backWall,
    new THREE.Vector3(),
    650,
    1150,
    new THREE.Vector3(Math.PI / 2, 0, 0),
    architecture,
  );
  const sideWall = new THREE.Group();
  sideWall.position.x = -2.74;
  shell.add(sideWall);
  // The window and its wall unfold together around the floor edge.
  box(sideWall, 0, 0.5, 0, 0.12, 1, 4.4, wall);
  box(sideWall, 0, 2.65, 0, 0.12, 0.5, 4.4, wall);
  box(sideWall, 0, 1.7, -1.55, 0.12, 1.4, 1.3, wall);
  box(sideWall, 0, 1.7, 1.55, 0.12, 1.4, 1.3, wall);
  for (const y of [1, 1.7, 2.4])
    box(sideWall, 0.04, y, 0, 0.17, 0.045, 1.8, wood, 0.008);
  for (const z of [-0.9, 0, 0.9])
    box(sideWall, 0.04, 1.7, z, 0.17, 1.4, 0.045, wood, 0.008);
  box(sideWall, 0.16, 0.99, 0, 0.4, 0.055, 1.95, wood);
  assemblyPart(
    sideWall,
    new THREE.Vector3(),
    900,
    1150,
    new THREE.Vector3(0, 0, -Math.PI / 2),
    architecture,
  );
  const furniture = new THREE.Group();
  scene.add(furniture);
  let motion: Motion = "playing";
  let elapsed = 0;
  let lastTime = 0;
  let frame = 0;
  let visible = true;
  let disposed = false;
  function draw() {
    renderer.render(scene, camera);
  }
  function arrange() {
    const progress =
      motion === "off" ? 1 : Math.min(1, elapsed / roomMotion.duration);
    const cameraProgress = 1 - Math.pow(1 - progress, 3);
    camera.position.set(
      9.4 - 1.4 * cameraProgress,
      7.8 - 0.3 * cameraProgress,
      9.2 + 0.8 * cameraProgress,
    );
    camera.lookAt(0, 1.23, 0);
    camera.zoom = 1 + 0.08 * cameraProgress;
    camera.updateProjectionMatrix();
    for (const part of [...architecture, ...pieces]) {
      const { group, target, offset, delay, duration, rotation, turn } = part;
      const t =
        motion === "off"
          ? 1
          : Math.min(1, Math.max(0, (elapsed - delay) / duration));
      const remaining = Math.pow(1 - t, 3);
      const opacity =
        motion === "off"
          ? 1
          : Math.min(1, Math.max(0, (elapsed - delay) / 180));
      group.visible = opacity > 0;
      group.position.copy(target).addScaledVector(offset, remaining);
      group.rotation.set(
        rotation.x + turn.x * remaining,
        rotation.y + turn.y * remaining,
        rotation.z + turn.z * remaining,
      );
      group.scale.setScalar(1 - 0.035 * remaining);
      for (const mat of part.materials) mat.opacity = opacity;
      for (const mesh of part.meshes) mesh.castShadow = opacity > 0.65;
    }
    host.dataset.assembly =
      elapsed >= roomMotion.duration || motion === "off"
        ? "assembled"
        : "assembling";
    draw();
  }
  function tick(time: number) {
    frame = 0;
    if (disposed || motion !== "playing" || !visible || document.hidden) return;
    if (lastTime) elapsed += Math.min(time - lastTime, 50);
    lastTime = time;
    arrange();
    if (elapsed < roomMotion.duration) frame = requestAnimationFrame(tick);
  }
  function start() {
    cancelAnimationFrame(frame);
    lastTime = 0;
    arrange();
    if (
      motion === "playing" &&
      visible &&
      !document.hidden &&
      elapsed < roomMotion.duration
    )
      frame = requestAnimationFrame(tick);
  }
  function clearFurniture() {
    furniture.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    furniture.clear();
    for (const part of pieces) part.materials.forEach((mat) => mat.dispose());
    pieces = [];
    furnitureIndex = 0;
  }
  function assemblyPart(
    group: THREE.Object3D,
    offset: THREE.Vector3,
    delay: number,
    duration = 1200,
    turn = new THREE.Vector3(),
    collection = pieces,
  ) {
    const materials: THREE.Material[] = [];
    const meshes: THREE.Mesh[] = [];
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = (object.material as THREE.Material).clone();
      object.material.transparent = true;
      materials.push(object.material);
      meshes.push(object);
    });
    collection.push({
      group,
      target: group.position.clone(),
      offset,
      delay,
      duration,
      rotation: group.rotation.clone(),
      turn,
      materials,
      meshes,
    });
    return group;
  }
  function piece(x: number, z: number, offsetX: number, offsetZ: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.userData.entrance = {
      offset: new THREE.Vector3(offsetX, 0, offsetZ),
      delay: 1600 + furnitureIndex++ * 700,
      duration: 1200,
      turn: new THREE.Vector3(0, offsetX * 0.18 - offsetZ * 0.12, 0),
    };
    furniture.add(group);
    return group;
  }
  function legs(
    parent: THREE.Group,
    width: number,
    depth: number,
    height: number,
  ) {
    for (const x of [-width / 2 + 0.1, width / 2 - 0.1])
      for (const z of [-depth / 2 + 0.1, depth / 2 - 0.1])
        box(parent, x, height / 2, z, 0.07, height, 0.07, wood);
  }
  function plant() {
    const group = piece(2.05, -1.4, -0.15, 0.55);
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.16, 0.42, 24),
      clay,
    );
    pot.position.y = 0.23;
    pot.castShadow = true;
    group.add(pot);
    box(group, 0, 0.9, 0, 0.035, 1.35, 0.035, wood);
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), green);
      const angle = i * 2.4;
      leaf.scale.set(0.12, 0.29, 0.055);
      leaf.position.set(
        Math.sin(angle) * 0.17,
        0.72 + i * 0.1,
        Math.cos(angle) * 0.14,
      );
      leaf.rotation.z = Math.sin(angle) * 0.6;
      leaf.castShadow = true;
      group.add(leaf);
    }
  }
  function setRoom(room: Room) {
    clearFurniture();
    const storage = piece(-1.95, -1.2, 0.35, 0.55);
    const cabinetHeight = room === "bedroom" ? 2.25 : 1.3;
    box(
      storage,
      0,
      cabinetHeight / 2 + 0.12,
      0,
      0.85,
      cabinetHeight,
      0.55,
      wood,
    );
    for (const x of [-0.215, 0.215]) {
      const door = box(
        storage,
        x,
        cabinetHeight / 2 + 0.12,
        0.287,
        0.405,
        cabinetHeight - 0.06,
        0.035,
        cream,
        0.005,
      );
      box(door, x > 0 ? -0.155 : 0.155, -0.02, 0.03, 0.025, 0.18, 0.025, wood);
    }
    if (room === "living") {
      const sofa = piece(0.35, -1.23, 0, 1.1);
      legs(sofa, 2.55, 0.86, 0.2);
      box(sofa, 0, 0.33, 0, 2.6, 0.28, 0.9, green, 0.08);
      box(sofa, 0, 0.8, -0.36, 2.55, 0.8, 0.24, green, 0.09);
      for (const x of [-1.18, 1.18])
        box(sofa, x, 0.63, 0, 0.25, 0.58, 0.94, green, 0.08);
      for (const x of [-0.55, 0.55]) {
        box(sofa, x, 0.53, 0.05, 1.03, 0.2, 0.7, cream, 0.08);
        box(sofa, x, 0.87, -0.15, 1.01, 0.53, 0.19, green, 0.075);
      }
      const cushion = box(
        sofa,
        -0.73,
        0.84,
        0.02,
        0.38,
        0.38,
        0.17,
        clay,
        0.075,
      );
      cushion.rotation.z = -0.15;
      const rugGroup = new THREE.Group();
      rugGroup.position.set(0.3, 0, 0.7);
      furniture.add(rugGroup);
      box(rugGroup, 0, 0.035, 0, 2.7, 0.045, 1.55, rug, 0.015);
      assemblyPart(rugGroup, new THREE.Vector3(0, 0.06, 0), 1350, 1000);
      const table = piece(0.3, 0.7, 0.65, 0.6);
      legs(table, 1.25, 0.67, 0.39);
      box(table, 0, 0.45, 0, 1.45, 0.11, 0.82, wood, 0.08);
      box(table, 0.22, 0.535, -0.02, 0.35, 0.05, 0.23, cream, 0.006);
    } else if (room === "bedroom") {
      const bed = piece(0.45, -0.15, 0, -0.8);
      legs(bed, 1.8, 2.5, 0.18);
      box(bed, 0, 0.27, 0, 1.95, 0.3, 2.6, wood, 0.05);
      box(bed, 0, 0.54, 0, 1.87, 0.3, 2.5, cream, 0.12);
      box(bed, 0, 0.8, -1.25, 1.99, 1.35, 0.16, wood, 0.04);
      box(bed, 0, 0.72, 0.4, 1.89, 0.14, 1.75, green, 0.06);
      for (const x of [-0.46, 0.46])
        box(bed, x, 0.76, -0.79, 0.77, 0.18, 0.55, cream, 0.08);
      const bedside = piece(1.95, -1.14, 0.8, 0);
      box(bedside, 0, 0.31, 0, 0.53, 0.58, 0.55, wood);
      box(bedside, 0, 0.36, 0.286, 0.46, 0.3, 0.025, cream);
      box(bedside, 0, 0.76, 0, 0.05, 0.3, 0.05, wood);
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.2, 0.24, 24),
        cream,
      );
      shade.position.y = 0.95;
      shade.castShadow = true;
      bedside.add(shade);
    } else {
      const desk = piece(0.45, -1.1, 0, -0.8);
      legs(desk, 2.05, 0.85, 0.94);
      box(desk, 0, 1, 0, 2.25, 0.1, 1.03, wood);
      box(desk, -0.73, 0.72, 0, 0.62, 0.47, 0.75, cream);
      box(desk, 0.34, 1.2, -0.16, 0.08, 0.36, 0.08, dark);
      box(desk, 0.34, 1.52, -0.2, 0.87, 0.56, 0.08, dark);
      box(desk, 0.34, 1.52, -0.151, 0.77, 0.46, 0.015, screenMaterial);
      box(desk, 0.31, 1.085, 0.22, 0.55, 0.03, 0.19, cream);
      const chair = piece(0.6, 0.3, 0.4, 0.9);
      legs(chair, 0.58, 0.59, 0.49);
      box(chair, 0, 0.54, 0, 0.69, 0.15, 0.7, green, 0.07);
      box(chair, 0, 0.92, 0.27, 0.65, 0.77, 0.16, green, 0.08);
    }
    if (room !== "bedroom") plant();
    for (const group of furniture.children) {
      const entrance = group.userData.entrance as
        | {
            offset: THREE.Vector3;
            delay: number;
            duration: number;
            turn: THREE.Vector3;
          }
        | undefined;
      if (entrance)
        assemblyPart(
          group,
          entrance.offset,
          entrance.delay,
          entrance.duration,
          entrance.turn,
        );
    }
    elapsed = 0;
    host.dataset.room = room;
    start();
  }
  const resize = new ResizeObserver(() => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    draw();
  });
  resize.observe(host);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  });
  visibility.observe(host);
  document.addEventListener("visibilitychange", start);
  renderer.setSize(host.clientWidth, host.clientHeight, false);
  host.dataset.renderer = "webgl";
  return {
    captureAssemblyFrames(count = roomMotion.frames) {
      const previousMotion = motion;
      const previousElapsed = elapsed;
      cancelAnimationFrame(frame);
      motion = "playing";
      const frames = Array.from({ length: count }, (_, index) => {
        elapsed = (roomMotion.duration * index) / (count - 1);
        arrange();
        return renderer.domElement.toDataURL("image/png");
      });
      motion = previousMotion;
      elapsed = previousElapsed;
      start();
      return frames;
    },
    setRoom,
    setFinish(index: number) {
      wood.color.set(finishes[index].color);
      floorMaterial.color.set(finishes[index].floor);
      host.dataset.finish = String(index);
      draw();
    },
    setMotion(value: Motion) {
      motion = value;
      if (value === "off") elapsed = roomMotion.duration;
      start();
    },
    replay() {
      elapsed = 0;
      start();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", start);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [...architecture, ...pieces].forEach((part) =>
        part.materials.forEach((mat) => mat.dispose()),
      );
      allMaterials.forEach((mat) => mat.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
