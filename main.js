import * as THREE from './node_modules/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor("#65647C");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateMatrix();
    console.log("hello");
})


const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({color: "#FFF6BD"});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(40, 0, 40);
scene.add(boxMesh);

const rendering = () => {
    requestAnimationFrame(rendering);
    boxMesh.rotation.z -= 0.005;
    boxMesh.rotation.x -= 0.01;

    renderer.render(scene, camera);
}

const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(3, 3, 3);
scene.add(light);

rendering();