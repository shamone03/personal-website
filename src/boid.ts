import * as THREE from "three";
import { Material } from "three";

export default class Boid {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
    arrow: THREE.ArrowHelper;
    scene: THREE.Scene;
    boidMesh: THREE.Mesh;
    perception: number;
    speed: number;

    constructor(scene: THREE.Scene) {
        this.speed = 3;
        this.position = new THREE.Vector3().random().subScalar(0.5).multiplyScalar(100);
        this.velocity = new THREE.Vector3().random().subScalar(0.5).multiplyScalar(this.speed);
        this.acceleration = new THREE.Vector3();
        this.perception = 10;
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
        let steering = new THREE.Vector3();
        let count = 0;
        for (let boid of flock) {
            const distance = this.position.distanceTo(boid.position);

            if (this !== boid && distance < this.perception) {
                steering.add(boid.velocity);
                count++;
            }
        }

        if (count > 0) {
            steering.divideScalar(count);
            steering.sub(this.velocity)
            steering.setLength(this.speed);
        }
        align.copy(steering);

        return align;
    }

    cohesion(flock: Boid[]) {
        const cohesion = new THREE.Vector3(0, 0, 0);
        let steering = new THREE.Vector3();
        let count = 0;
        for (let boid of flock) {
            const distance = this.position.distanceTo(boid.position);

            if (this !== boid && distance < this.perception) {
                steering.add(boid.position);
                count++;
            }
        }

        if (count > 0) {
            steering.divideScalar(count);
            steering.sub(this.position);
            steering.setLength(this.speed);
        }
        cohesion.copy(steering);

        return cohesion;
    }

    separation(flock: Boid[]) {
        const separation = new THREE.Vector3(0, 0, 0);
        let avg = new THREE.Vector3();
        let count = 0;
        for (let boid of flock) {
            const distance = this.position.distanceTo(boid.position);

            if (this !== boid && distance < this.perception) {
                const direction = new THREE.Vector3().subVectors(this.position, boid.position);
                direction.divideScalar(distance);
                avg.add(direction);
                count++;
            }
        }

        if (count > 0) {
            avg.divideScalar(count);
            avg.setLength(this.speed);
            // avg.sub(this.velocity);
            separation.copy(avg);
        }
        separation.clampLength(0.1, this.speed);

        return separation;
    }

    update(delta: number, flock: Boid[]) {
        this.acceleration.add(this.alignment(flock));
        this.acceleration.add(this.cohesion(flock));
        this.acceleration.add(this.separation(flock));
        this.velocity.add(this.acceleration);
        this.velocity.clampLength(0, this.speed * 25);
        this.acceleration.multiplyScalar(0);

        console.log(this.velocity.length());
        this.bounds();
        this.applyVelocity(delta);
    }
    
    bounds() {
        const max = 100;
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