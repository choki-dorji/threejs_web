/** @format */

import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import atmospherevertexShader from "../shaders/atmospherevertex.glsl";
import atmospherefragmentShader from "../shaders/atmospherefragment.glsl";
import gsap from "gsap";
import countries from "../countries.json";
const canvascontainer = document.querySelector("#canvascontainer");

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  canvascontainer.offsetWidth / canvascontainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true, //create smooth effects
  canvas: document.querySelector("canvas"),
});
renderer.setSize(canvascontainer.offsetWidth, canvascontainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

//sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 64, 64),
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
  new THREE.SphereGeometry(6, 64, 64),
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

function createPoint({ lat, long, country, population }) {
  const point = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.8),
    new THREE.MeshBasicMaterial({
      // map: new THREE.TextureLoader().load("image1.jpg"),
      color: 0x3bf7ff,
      opacity: 0.4,
      transparent: true,
    })
  );
  //23.6345 , 102.5528 display the small sphere on mexico
  //  as of now thw coordinates are in degree we need to convert it to the radian so we divide by 180 and multiplu by PI
  const latitude = (lat / 180) * Math.PI;
  const longititude = (long / 180) * Math.PI;
  const radius = 5;
  const x = radius * Math.cos(latitude) * Math.sin(longititude);
  const y = radius * Math.sin(latitude);
  const z = radius * Math.cos(latitude) * Math.cos(longititude);

  point.position.z = z;
  point.position.y = y;
  point.position.x = x;
  point.lookAt(0, 0, 0);
  point.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));
  group.add(point);
  gsap.to(point.scale, {
    z: 1.4,
    duration: 2,
    yoyo: true, //animate between 0 and 0.8
    repeat: -1, //-1 makes it infinate
    ease: "linear",
    delay: Math.random(),
  });
  point.country = country;
  point.population = population;
  // point.scale.z =
}
function createBoxes(countries) {
  countries.forEach((country) => {
    const scale = country.population / 1000000000;
    const point = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(0.1, 0.2 * scale),
        Math.max(0.1, 0.2 * scale),
        Math.max(0.8 * scale, 0.4)
      ),
      new THREE.MeshBasicMaterial({
        // map: new THREE.TextureLoader().load("image1.jpg"),
        color: 0x3bf7ff,
        opacity: 0.4,
        transparent: true,
      })
    );
    //23.6345 , 102.5528 display the small sphere on mexico
    //  as of now thw coordinates are in degree we need to convert it to the radian so we divide by 180 and multiplu by PI
    const latitude = (country.latlng[0] / 180) * Math.PI;
    const longititude = (country.latlng[1] / 180) * Math.PI;
    const radius = 5;
    const x = radius * Math.cos(latitude) * Math.sin(longititude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.cos(longititude);

    point.position.z = z;
    point.position.y = y;
    point.position.x = x;
    point.lookAt(0, 0, 0);
    point.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, 0, -0.4 * scale)
    );
    group.add(point);
    gsap.to(point.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true, //animate between 0 and 0.8
      repeat: -1, //-1 makes it infinate
      ease: "linear",
      delay: Math.random(),
    });
    point.country = country.name.official;
    point.population = country.population;
    // point.scale.z =
  });
}
createBoxes(countries);
//if its on south it should be - sign and also for west
// createPoint({
//   lat: 23.6345,
//   long: -102.5528,
//   country: "Mexico",
//   population: "126.7 million",
// });
// createPoint({
//   lat: 20.5937,
//   long: 78.9629,
//   country: "India",
//   population: "1.408 billion",
// });
// createPoint({
//   lat: 27.5142,
//   long: 90.4336,
//   country: "Bhutan",
//   population: "777,486",
// });
// createPoint({
//   lat: 100.5142,
//   long: 100.4336,
//   country: "Somewhere",
//   population: "0",
// });

sphere.rotation.y = -Math.PI / 2;

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
group.rotation.offset = {
  x: 0,
  y: 0,
};
const mouse = {
  x: undefined,
  y: undefined,
  down: false,
  xprev: undefined,
  yprev: undefined,
};

const raycaster = new THREE.Raycaster();
const popup = document.querySelector("#popup");
const population = document.querySelector("#population");
const value = document.querySelector("#value");

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // group.rotation.y += 0.006;

  // if (mouse.x) {
  //   gsap.to(group.rotation, {
  //     x: -mouse.y * 0.8,
  //     y: mouse.x * 0.8,
  //     duration: 2,
  //   });
  // }
  raycaster.setFromCamera(mouse, camera);
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(
    group.children.filter((mesh) => {
      // console.log(mesh.geometry.type);
      return mesh.geometry.type === "BoxGeometry";
    })
  );

  group.children.forEach((mesh) => {
    mesh.material.opacity = 0.4;
  });
  gsap.set(popup, {
    display: "none",
  });
  for (let i = 0; i < intersects.length; i++) {
    const box = intersects[i].object;
    box.material.opacity = 1;
    gsap.set(popup, {
      display: "block",
    });
    population.innerHTML = box.country;
    value.innerHTML = box.population;
  }

  renderer.render(scene, camera);
}
animate();
canvascontainer.addEventListener("mousedown", ({ clientX, clientY }) => {
  mouse.down = true;
  mouse.xprev = clientX;
  mouse.yprev = clientY;
});

addEventListener("mousemove", (event) => {
  if (innerWidth >= 1280) {
    mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  } else {
    const offset = canvascontainer.getBoundingClientRect().top;
    console.log(offset);
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1;
  }
  gsap.set(popup, {
    x: event.clientX,
    y: event.clientY,
  });
  if (mouse.down) {
    event.preventDefault();

    const deltaX = event.clientX - mouse.xprev;
    const deltaY = event.clientY - mouse.yprev;
    group.rotation.offset.x += deltaX * 0.005;
    group.rotation.offset.y += deltaY * 0.005;
    gsap.to(group.rotation, {
      y: group.rotation.offset.x,
      x: group.rotation.offset.y,
    });
    // group.rotation.y += deltaX * 0.005;
    // group.rotation.x += deltaY * 0.005;
    mouse.xprev = event.clientX;
    mouse.yprev = event.clientY;
  }
});
addEventListener("mouseup", (event) => {
  mouse.down = false;
  console.log("mouse down", mouse.down);
});

addEventListener("resize", () => {
  renderer.setSize(canvascontainer.offsetWidth, canvascontainer.offsetHeight);
  camera = new THREE.PerspectiveCamera(
    75,
    canvascontainer.offsetWidth / canvascontainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 15;
});

addEventListener("touchmove", (event) => {
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;

  const doesintersect = raycaster.intersectObject(sphere);
  if (doesintersect.length === 0) return;
  mouse.down = true;

  const offset = canvascontainer.getBoundingClientRect().top;
  console.log(offset);
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1;

  gsap.set(popup, {
    x: event.clientX,
    y: event.clientY,
  });
  if (mouse.down) {
    event.preventDefault();

    const deltaX = event.clientX - mouse.xprev;
    const deltaY = event.clientY - mouse.yprev;
    group.rotation.offset.x += deltaX * 0.005;
    group.rotation.offset.y += deltaY * 0.005;
    gsap.to(group.rotation, {
      y: group.rotation.offset.x,
      x: group.rotation.offset.y,
    });
    // group.rotation.y += deltaX * 0.005;
    // group.rotation.x += deltaY * 0.005;
    mouse.xprev = event.clientX;
    mouse.yprev = event.clientY;
  }
}, {passive: flase});
addEventListener("touchend", (event) => {
  mouse.down = false;
  console.log("mouse down", mouse.down);
});
