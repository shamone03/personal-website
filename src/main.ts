import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';
const SCENE_COLOR = "#F3EFE0";
const LIGHT_COLOR = "#FFFFFF";

const scene = new THREE.Scene();
const stats = new Stats();
const loader = new GLTFLoader();
stats.showPanel(0);
// document.body.appendChild(stats.dom);
const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper)
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(SCENE_COLOR);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})

const boxGeometry = new THREE.BoxGeometry(2, 2, 2).toNonIndexed();
const boxMaterial = new THREE.MeshLambertMaterial({ color: "lightgreen", wireframe: false });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(0, 0, 0);
boxMesh.name = "mainBox";
scene.add(boxMesh);

const controls = new TrackballControls(camera, renderer.domElement);
controls.dynamicDampingFactor = 0.1;
controls.rotateSpeed = 4;
controls.noZoom = true;


const lighting = () => {
	const lightData = [
		{ color: 0xFFFFFF, intensity: 0.5, dist: 100, position: { x: 10, y: 10, z: 10 } },
		{ color: 0xFFFFFF, intensity: 1, dist: 100, position: { x: -10, y: -10, z: 10 } },
		{ color: 0xFFFFFF, intensity: 0.5, dist: 100, position: { x: 10, y: -10, z: -10 } },
		{ color: 0xFFFFFF, intensity: 1, dist: 100, position: { x: -10, y: 10, z: -10 } },
	]

	for (let i = 0; i < lightData.length; i++) {
		const light = new THREE.PointLight(lightData[i].color, lightData[i].intensity, lightData[i].dist);
		light.position.set(lightData[i].position.x, lightData[i].position.y, lightData[i].position.z);
		const lightHelper = new THREE.PointLightHelper(light, 1, LIGHT_COLOR);
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshLambertMaterial({ color: LIGHT_COLOR }));
		sphere.position.set(lightData[i].position.x, lightData[i].position.y, lightData[i].position.z);
		// scene.add(sphere);
		// scene.add(lightHelper);
		scene.add(light);
	}
}
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.addEventListener('pointermove', (e) => {
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

});

loader.load(`../models/tree${Math.ceil((Math.random() * 6) / 2)}.gltf`, (gltf) => {
	scene.add(gltf.scene);
});

const rendering = () => {
	stats.begin();
	requestAnimationFrame(rendering);

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children, false);

	controls.update();
	renderer.render(scene, camera);
	stats.end();
}

lighting();
rendering();