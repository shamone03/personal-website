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
	camera.updateProjectionMatrix();
	console.log("hello");
})

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshLambertMaterial({color: BOX_COLOR});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.rotation.set(45, 0, 45);
scene.add(boxMesh);

const controls = new TrackballControls(camera, renderer.domElement);
controls.dynamicDampingFactor = 0.1;
controls.rotateSpeed = 4;
controls.noZoom = true;


const lighting = () => {
	const lightData = [
		{color: 0xFFFFFF, intensity: 0.5, dist: 100, position: {x: 3, y: 3, z: 3}},
		{color: 0xFFFFFF, intensity: 1, dist: 100, position: {x: -3, y: -3, z: 3}},
		{color: 0xFFFFFF, intensity: 0.5, dist: 100, position: {x: 3, y: -3, z: -3}},
		{color: 0xFFFFFF, intensity: 1, dist: 100, position: {x: -3, y: 3, z: -3}},
	]

	for (let i = 0; i < lightData.length; i++) {
		const light = new THREE.PointLight(lightData[i].color, lightData[i].intensity, lightData[i].dist);
		light.position.set(lightData[i].position.x, lightData[i].position.y, lightData[i].position.z);
		const lightHelper = new THREE.PointLightHelper(light, 1, LIGHT_COLOR);
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshLambertMaterial({color: LIGHT_COLOR}));
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
	pointer.y = (e.clientY / window.innerHeight) * 2 + 1;
	// console.log("pointer move");

})
const rendering = () => {
	requestAnimationFrame(rendering);
	// console.log(boxMesh);

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	// if (intersects.length > 0) {
	// 	console.log("intersect");
	// }
	for (let i = 0; i < intersects.length; i++) {
		intersects[i].object.material.color.set("#FFFFFF");
		console.log("intersect");
		// console.log(intersects[i].object);
	}
	boxMesh.rotation.z -= 0.01;
	boxMesh.rotation.x -= 0.01;
	controls.update();
	renderer.render(scene, camera);
}

lighting();
rendering();