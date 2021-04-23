import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, particles, controls, saturn;
let width = window.innerWidth;
let height = window.innerHeight;

const init = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x2a3340);
  renderer.shadowMap.enabled = true;

  controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x663344, 2);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(200, 100, 200);
  light.castShadow = true;
  light.shadow.camera.left = -400;
  light.shadow.camera.right = 400;
  light.shadow.camera.top = 400;
  light.shadow.camera.bottom = -400;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  scene.add(light);

  drawParticles();
  drawSaturn();

  document.getElementById("world").appendChild(renderer.domElement);
  window.addEventListener("resize", onResize);
};

const onResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  particles.rotation.x += 0.001;
  particles.rotation.y -= 0.004;
  saturn.rotation.y += 0.003;
  renderer.render(scene, camera);
};

const drawParticles = () => {
  particles = new THREE.Group();
  scene.add(particles);
  const geometry = new THREE.TetrahedronGeometry(2, 0);

  for (let i = 0; i < 1000; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.2, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(200 + Math.random() * 700);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    particles.add(mesh);
  }
};

const drawSaturn = () => {
  saturn = new THREE.Group();
  saturn.rotation.set(0.4, 0.3, 0);
  scene.add(saturn);

  const planetGeometry = new THREE.IcosahedronGeometry(100, 1);

  const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x37be95,
    shading: THREE.FlatShading,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.set(0, 40, 0);
  saturn.add(planet);

  const ringGeometry = new THREE.TorusGeometry(140, 12, 6, 15);
  const ringMeterial = new THREE.MeshStandardMaterial({
    color: 0x6549c0,
    shading: THREE.FlatShading,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMeterial);
  ring.position.set(0, 40, 0);
  ring.rotateX(80);
  ring.castShadow = true;
  ring.receiveShadow = true;
  saturn.add(ring);
};

init();
animate();
