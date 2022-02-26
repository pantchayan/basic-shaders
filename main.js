// IMPORTING ORBIT CONTROLS
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const textureLoader = new THREE.TextureLoader();

const canvas = document.querySelector("canvas");
const sizes = { width: window.innerWidth, height: window.innerHeight };
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
});

const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneBufferGeometry(4, 4, 1, 1);
const planeMaterial = new THREE.RawShaderMaterial({
  vertexShader: /* cpp */ `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  attribute vec3 position;
  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
  }
  `,
  fragmentShader: /* glsl */ `
  precision mediump float;
  varying float vColor;
  void main()
  {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
  `,
});

planeMaterial.wireframe = true;

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const ambientLight = new THREE.AmbientLight(new THREE.Color("white"), 1);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.z = 10;
camera.position.y = 0;

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
let animate = () => {
  let elapsedTime = clock.getElapsedTime();
  
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
};

animate();
