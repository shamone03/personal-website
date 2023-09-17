import Boid from "./boid";
import { Multipliers } from "./types";

export default class FlockManager {
    boids: Boid[]
    perception: number;
    multipliers: Multipliers;


    constructor(scene: THREE.Scene, numBoids: number, perception: number, multipliers: Multipliers) {
        this.perception = perception;
        this.multipliers = multipliers;
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

    public updateCohesion(cohesion: number) {
        for (let boid of this.boids) {
            boid.multipliers = { ...boid.multipliers, cohesion: cohesion }
        }
    }
    
    public updateAlignment(alignment: number) {
        for (let boid of this.boids) {
            boid.multipliers = { ...boid.multipliers, alignment: alignment }
        }
    }
    
    public updateSeparation(separation: number) {
        for (let boid of this.boids) {
            boid.multipliers = { ...boid.multipliers, separation: separation }
        }
    }

    public updateSpeed(speed: number) {
        for (let boid of this.boids) {
            boid.speed = speed;
        }
    }

    public updatePerception(perception: number) {
        for (let boid of this.boids) {
            boid.perception = perception;
        }
    }
}