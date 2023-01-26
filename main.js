import * as THREE from './node_modules/three/build/three.module.js';
import { TrackballControls } from './node_modules/three/examples/jsm/controls/TrackballControls.js';

const BOX_COLOR = "#22A39F";
const SCENE_COLOR = "#F3EFE0";
const LIGHT_COLOR = "#FFFFFF";

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper)
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setClearColor(SCENE_COLOR);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateMatrix();
	console.log("hello");
})


const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({color: BOX_COLOR});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(45, 0, 45);
scene.add(boxMesh);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;

const rendering = () => {
	requestAnimationFrame(rendering);
	boxMesh.rotation.z -= 0.01;
	boxMesh.rotation.x -= 0.01;
	controls.update();
	renderer.render(scene, camera);
}

const lightData = [
	{color: 0xFFFFFF, intensity: 0.5, dist: 100, position: {x: 3, y: 3, z: 3}},
	{color: 0xFFFFFF, intensity: 1, dist: 100, position: {x: -3, y: -3, z: 3}},
	{color: 0xFFFFFF, intensity: 0/5, dist: 100, position: {x: 3, y: -3, z: -3}},
	{color: 0xFFFFFF, intensity: 1, dist: 100, position: {x: -3, y: 3, z: -3}},
// 	{color: LIGHT_COLOR, intensity: 1, dist: 100, position: {x: 3, y: 3, z: 3}},
// 	{color: LIGHT_COLOR, intensity: 1, dist: 100, position: {x: -3, y: -3, z: 3}},
// 	{color: LIGHT_COLOR, intensity: 1, dist: 100, position: {x: -3, y: 3, z: 3}},
// 	{color: LIGHT_COLOR, intensity: 1, dist: 100, position: {x: 3, y: -3, z: 3}},
]

for (let i = 0; i < lightData.length; i++) {
	const light = new THREE.PointLight(lightData[i].color, lightData[i].intensity, lightData[i].dist);
	light.position.set(lightData[i].position.x, lightData[i].position.y, lightData[i].position.z);
	const lightHelper = new THREE.PointLightHelper(light, 1, LIGHT_COLOR);
	// scene.add(lightHelper);
	scene.add(light);
}


rendering();