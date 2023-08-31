import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';
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
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
camera.position.z = 10;

renderer.setClearColor(SCENE_COLOR);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({ color: "lightgreen" });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.x -= 2;
// boxMesh.position.y += 2
boxMesh.name = "mainBox";
scene.add(boxMesh);

const controls = new TrackballControls(camera, renderer.domElement);
controls.dynamicDampingFactor = 0.1;
controls.rotateSpeed = 4;
controls.noZoom = true;

function drawLine(start: THREE.Vector3, end: THREE.Vector3) {
	const mat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
	const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
	const line = new THREE.Line(lineGeometry, mat);
	// scene.add(line);
	return line;
}

function makeBoid() {
	const normMaterial = new THREE.MeshNormalMaterial();
	const boidMesh = new THREE.Mesh(new THREE.ConeGeometry, normMaterial);
	boidMesh.rotateZ(90 * (Math.PI / 180));
	boidMesh.scale.x = 0.5;
	boidMesh.scale.y = 1.5;
	boidMesh.scale.z = 0.5;
	return boidMesh;
}

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

window.addEventListener('pointermove', (e) => {
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

});

loader.load(`/models/tree${Math.ceil((Math.random() * 6) / 2)}.gltf`, (gltf) => {
	// scene.add(gltf.scene);
});


const boid = makeBoid();
const origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
origin.copy(boid.position);


console.log(boid.position.distanceTo(boxMesh.position));

boid.name = "boid";
scene.add(boid);
const direction = new THREE.Vector3();
const left = new THREE.Vector3(-1, 0, 0);

// scene.add(new THREE.ArrowHelper(direction.subVectors(left, boid.position).normalize(), boid.position, 2));


const rendering = () => {
	stats.begin();
	requestAnimationFrame(rendering);
	// console.clear();
	controls.update();
	raycaster.set(boid.position, direction.subVectors(left, boid.position).normalize());
	console.log(raycaster.intersectObjects(scene.children));
	
	// scene.rotation.x -= 0.01;
	// scene.rotation.z -= 0.01;
	// boid.rotation.y -= 0.01;
	renderer.render(scene, camera);
	stats.end();
}

lighting();
rendering();