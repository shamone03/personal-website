import Boid from "./boid";

class FlockManager {
    boids: Boid[]
    perception: number;
    separation: number;
    alignment: number;
    cohesion: number;
    constructor(scene: THREE.Scene, numBoids: number, perception: number, separation: number, alignment: number, cohesion: number) {
        this.perception = perception;
        this.alignment = alignment;
        this.cohesion = cohesion;
        this.separation = separation;
        this.boids = [];
        for (let i = 0; i < numBoids; i++) {
            const b = new Boid(scene);
            this.boids.push(b);
            b.spawn();
        }
    }

    simulate(delta: number) {
        for (let boid of this.boids) {
            boid.update(delta, this.boids);
            boid.show();
        }
    }
}