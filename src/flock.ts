import Boid from "./boid";

class FlockManager {
    boids: Boid[]

    constructor(scene: THREE.Scene, numBoids: number, perception: number, separation: number, alignment: number, cohesion: number) {
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