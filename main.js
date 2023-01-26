import * as THREE from './node_modules/three/build/three.module.js';
import { TrackballControls } from './node_modules/three/examples/jsm/controls/TrackballControls.js';

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
const boxMaterial = new THREE.MeshLambertMaterial({color: "#0E185F"});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(40, 0, 40);
scene.add(boxMesh);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.d

const rendering = () => {
	requestAnimationFrame(rendering);
	boxMesh.rotation.z -= 0.005;
	boxMesh.rotation.x -= 0.01;
	controls.update();
	renderer.render(scene, camera);
}

const lightData = [
	{color: "#FFFFFF", intensity: 1, dist: 100, position: {x: 3, y: 3, z: 3}},
	{color: "#FFFFFF", intensity: 1, dist: 100, position: {x: 3, y: 3, z: -3}},
	{color: "#FFFFFF", intensity: 1, dist: 100, position: {x: 3, y: -3, z: 3}},
	{color: "#FFFFFF", intensity: 1, dist: 100, position: {x: -3, y: 3, z: 3}}
]

for (let i = 0; i < lightData.length; i++) {
	const light = new THREE.PointLight(lightData[i].color, lightData[i].intensity, lightData[i].dist);
	light.position.set(lightData[i].position.x, lightData[i].position.y, lightData[i].position.z);
	scene.add(light);
}


rendering();