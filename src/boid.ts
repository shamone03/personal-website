import * as THREE from "three";
import { Material } from "three";

export default class Boid {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    arrow: THREE.ArrowHelper;
    scene: THREE.Scene;
    boidMesh: THREE.Mesh;
    perception: number;
    speed: number;

    constructor(scene: THREE.Scene) {
        this.speed = 1;
        this.position = new THREE.Vector3().random().subScalar(0.5).multiplyScalar(50);
        this.velocity = new THREE.Vector3().random().multiplyScalar(this.speed);
        this.perception = 5;
        this.arrow = new THREE.ArrowHelper;
        this.arrow.setLength(3);
        // this.deltaVel = new THREE.Vector3();
        // this.deltaVel.copy(this.velocity);
        this.scene = scene;
        const normMaterial = new THREE.MeshNormalMaterial();
        this.boidMesh = new THREE.Mesh(new THREE.SphereGeometry, normMaterial);
        this.boidMesh.add(this.arrow);
    }

    spawn() {
        this.scene.add(this.boidMesh);
        
        const helper = new THREE.SphereGeometry(this.perception);
        const wireframe = new THREE.WireframeGeometry(helper);
        const line = new THREE.LineSegments(wireframe);
        (line.material as Material).depthTest = false;
        (line.material as Material).opacity = 0.05;
        (line.material as Material).transparent = true;
        // this.boidMesh.add(line);
    }

    show() {
        this.arrow.setDirection(new THREE.Vector3().copy(this.velocity).normalize());
        this.boidMesh.position.copy(this.position);
    }

    alignment(flock: Boid[]): THREE.Vector3 {
        
        const align = new THREE.Vector3(0, 0, 0);
        let avg = new THREE.Vector3();
        let count = 0;
        for (let boid of flock) {
            const distance = this.position.distanceTo(boid.position);

            if (this !== boid && distance < this.perception) {
                avg.add(boid.velocity);
                count++;
            }
        }

        if (count > 0) {
            avg.divideScalar(count);
            align.copy(avg.sub(this.velocity)).setLength(this.speed);
        }
        align.clampLength(1, this.speed);

        return align;
    }

    update(delta: number, flock: Boid[]) {
        this.velocity.add(this.alignment(flock));
        this.returnToOrigin();
        this.applyVelocity(delta);
    }
    
    returnToOrigin() {
        const max = 50;
        if (this.position.x > max) this.position.x = -max + 1;
        if (this.position.x < -max) this.position.x = max - 1;
        if (this.position.y > max) this.position.y = -max + 1;
        if (this.position.y < -max) this.position.y = max - 1;
        if (this.position.z > max) this.position.z = -max + 1;
        if (this.position.z < -max) this.position.z = max - 1;
    }

    applyVelocity(delta: number) {
        this.position.add(new THREE.Vector3(1, 1, 1).multiply(this.velocity).multiplyScalar(delta));
    }
}