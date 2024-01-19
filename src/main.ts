import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import Boid from "./boid";
import { color } from "three/examples/jsm/nodes/Nodes.js";
import FlockManager from "./flock";

const SCENE_COLOR = "#272727";
const LIGHT_COLOR = "#FFFFFF";
const PROD_BASE = "https://aryah.dev/models/"
const DEV_BASE = "./models/"
console.log(import.meta.url);
const scene = new THREE.Scene();
const stats = new Stats();
const loader = new GLTFLoader();
stats.showPanel(0);
// document.body.appendChild(stats.dom);
const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper)
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
camera.position.z = 110;

renderer.setClearColor(SCENE_COLOR);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})
const controls = new TrackballControls(camera, renderer.domElement);
controls.dynamicDampingFactor = 0.1;
controls.rotateSpeed = 4;
controls.noZoom = true;

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({ color: "lightgreen" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

boxMesh.name = "mainBox";
boxMesh.scale.multiplyScalar(10);
scene.add(boxMesh);
loader.load(`/models/tree${Math.ceil((Math.random() * 6) / 2)}.gltf`, (gltf) => {
	gltf.scene.scale.multiplyScalar(10);
	scene.add(gltf.scene);
});
const lighting = () => {
	const lightData = [
		{ color: 0xFFFFFF, intensity: 0.5, dist: 300, position: { x: 60, y: 60, z: 60 } },
		{ color: 0xFFFFFF, intensity: 1, dist: 300, position: { x: -60, y: -60, z: 60 } },
		{ color: 0xFFFFFF, intensity: 0.5, dist: 300, position: { x: 60, y: -60, z: -60 } },
		{ color: 0xFFFFFF, intensity: 1, dist: 300, position: { x: -60, y: 60, z: -60 } },
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

window.addEventListener('pointermove', (e) => {
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

});

function drawLine(start: THREE.Vector3, end: THREE.Vector3) {
	const mat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
	const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
	const line = new THREE.Line(lineGeometry, mat);
	// scene.add(line);
	return line;
}

// function makeBoid() {
// 	const normMaterial = new THREE.MeshNormalMaterial();
// 	const boidMesh = new THREE.Mesh(new THREE.ConeGeometry, normMaterial);
// 	boidMesh.rotateZ(90 * (Math.PI / 180));
// 	boidMesh.scale.x = 0.5;
// 	boidMesh.scale.y = 1.5;
// 	boidMesh.scale.z = 0.5;
// 	return boidMesh;
// }



// const boid = makeBoid();
// const origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
// origin.copy(boid.position);


// console.log(boid.position.distanceTo(boxMesh.position));

// boid.name = "boid";
// scene.add(boid);
// const direction = new THREE.Vector3();
// const left = new THREE.Vector3(-1, 0, 0);

// scene.add(new THREE.ArrowHelper(direction.subVectors(left, boid.position).normalize(), boid.position, 2));
// raycaster.set(boid.position, direction.subVectors(left, boid.position).normalize());
const avgPos = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
// scene.add(avgPos);
const numBoids = 150;
// const flock: Boid[] = [];
let delta = 0;
// for (let i = 0; i < numBoids; i++) {
// 	const b = new Boid(scene);
// 	flock.push(b);
// 	b.spawn();
// }
const inputs = document.getElementById("inputs") as HTMLDivElement;
const cohesionInput = document.getElementById("cohesion") as HTMLInputElement;
const alignmentInput = document.getElementById("alignment") as HTMLInputElement;
const separationInput = document.getElementById("separation") as HTMLInputElement;
const speedInput = document.getElementById("speed") as HTMLInputElement;
const perceptionInput = document.getElementById("perception") as HTMLInputElement;
const settingsButton = document.getElementById("settings") as HTMLButtonElement;


const flockManager = new FlockManager(scene, 500, 7.5, {cohesion: 1, alignment: 1, separation: 1})
cohesionInput.addEventListener('input', () => flockManager.updateCohesion(parseFloat(cohesionInput.value) / 100));
alignmentInput.addEventListener('input', () => flockManager.updateAlignment(parseFloat(alignmentInput.value) / 100));
separationInput.addEventListener('input', () => flockManager.updateSeparation(parseFloat(separationInput.value) / 100));
speedInput.addEventListener('input', () => flockManager.updateSpeed(parseFloat(speedInput.value)));
perceptionInput.addEventListener('input', () => flockManager.updatePerception(parseFloat(perceptionInput.value)));
settingsButton.addEventListener('click', () => inputs.classList.toggle("hidden"));
// stats.showPanel(1);
const rendering = () => {
	stats.update();
	requestAnimationFrame(rendering);
	delta = clock.getDelta();
	flockManager.simulate(delta);

	controls.update();
	renderer.render(scene, camera);

}

lighting();
rendering();