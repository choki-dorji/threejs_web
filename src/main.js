/** @format */

import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import atmospherevertexShader from "../shaders/atmospherevertex.glsl";
import atmospherefragmentShader from "../shaders/atmospherefragment.glsl";
import gsap from "gsap";
const canvascontainer = document.querySelector("#canvascontainer");

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  canvascontainer.offsetWidth / canvascontainer.offsetHeight,
  0.1,
  1000
);

console.log(vertexShader);

const renderer = new THREE.WebGLRenderer({
  antialias: true, //create smooth effects
  canvas: document.querySelector("canvas"),
});
renderer.setSize(canvascontainer.offsetWidth, canvascontainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

//sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("images.jpg"),
      },
    },
    // map: new THREE.TextureLoader().load("image1.jpg"),
    // color: 0xff0000,
  })
);

//effect around the globe
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader: atmospherevertexShader,
    fragmentShader: atmospherefragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    // map: new THREE.TextureLoader().load("image1.jpg"),
    // color: 0xff0000,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);
camera.position.z = 15;

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const startVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  startVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(startVertices, 3) // to get [(x,y,z)....]
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.006;
  gsap.to(group.rotation, {
    x: -mouse.y,
    y: mouse.x,
    duration: 1,
  });
}
animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 - 1;
  console.log(mouse);
});
