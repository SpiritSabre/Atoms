class Nucleus {
    constructor(atomicNumber, minRadius = 10, maxRadius = 60, minAttractionBase = 0.05) {
        this.atomicNumber = atomicNumber;
        this.position = createVector(width / 2, height / 2);
        this.chargeMultiplier = 2000;
        this.radiusMultiplier = 1;
        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
        this.minAttractionBase = minAttractionBase;
        this.updateRadius();
        this.charge = 1 * this.chargeMultiplier;
        this.G = 0.005;

        this.nuclearRepulsionStrength = 1000;
        this.safeDistanceMultiplier = 1;
        this.safeDistance = this.radius * this.safeDistanceMultiplier;
    }

    updateRadius() {
        let calculatedRadius = this.atomicNumber * this.radiusMultiplier;
        this.radius = constrain(calculatedRadius, this.minRadius, this.maxRadius);
        this.safeDistance = this.radius * this.safeDistanceMultiplier;
    }

    show() {
        stroke(0);
        fill(100);
        circle(this.position.x, this.position.y, this.radius);
        stroke(0);
        strokeWeight(2);
        line(this.position.x - this.radius / 3, this.position.y, this.position.x + this.radius / 3, this.position.y);
        line(this.position.x, this.position.y - this.radius / 3, this.position.x, this.position.y + this.radius / 3);
        strokeWeight(1);
    }

    attract(electron) {
        let force = p5.Vector.sub(this.position, electron.position);
        let distance = force.mag();
        let distanceSq = constrain(distance * distance, 50, 20000);

        let calculatedStrength = (this.G * this.charge * electron.mass) / distanceSq;

        let minStrength = this.minAttractionBase * 5;
        let attractionStrength = max(calculatedStrength, minStrength);

        force.setMag(attractionStrength);

        if (distance < this.safeDistance) {
            let repulsionForce = p5.Vector.sub(electron.position, this.position);
            let repulsionStrength = this.nuclearRepulsionStrength / (distance * distance);
            repulsionForce.setMag(repulsionStrength);
            force.sub(repulsionForce);
        }
        return force;
    }

    setAtomicNumber(newAtomicNumber) {
        this.atomicNumber = newAtomicNumber;
        this.charge = this.atomicNumber * this.chargeMultiplier;
        this.updateRadius();
    }
}