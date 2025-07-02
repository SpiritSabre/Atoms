class Electron {
    constructor(initialPosition, shell) {
        this.mass = 1;
        this.position = initialPosition.copy();
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.damping = 1; // No damping for stable orbit
        this.orbitRadius = initialPosition.dist(nucleus.position); // Initial orbit radius
        
        // Calculate initial tangential velocity to start in a circular orbit
        // This is a basic calculation assuming only nuclear attraction for the initial state
        // Use nucleus.G and nucleus.charge for initial speed calculation
        let initialSpeed = sqrt(nucleus.G * nucleus.charge * this.mass / this.orbitRadius);
        let toNucleus = p5.Vector.sub(nucleus.position, this.position).normalize();
        let tangential = createVector(-toNucleus.y, toNucleus.x); // Perpendicular vector
        tangential.mult(initialSpeed);
        this.velocity.add(tangential);
        
        this.shell = shell;
        this.trail = [];
        this.trailLength = 25; // Adjusted trail length
        this.repulsionStrength = 0.1; // Adjust this value to control the strength of repulsion

        // New properties for radial restoring force
        this.springConstant = 0.005; // Slightly stronger spring
        this.minOrbitRadius = 20; // Prevents electrons from getting too close to nucleus
        this.maxOrbitRadius = 600; // Prevents electrons from flying too far (should be larger than max initialOrbitRadii)
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    repel(other) {
        let force = p5.Vector.sub(this.position, other.position);
        let distanceSq = force.magSq();

        // Repulsion only kicks in when electrons are close
        if (distanceSq > 0 && distanceSq < 1500) { // Adjusted: Smaller interaction range
            let strength = this.repulsionStrength / distanceSq * 2; // Adjusted: Stronger repulsion
            force.normalize();
            force.mult(strength);
            return force;
        } else {
            return createVector(0, 0); // No repulsion if too far
        }
    }

    update() {
        // 1. Apply calculated forces and update position
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        // 2. Apply Radial Restoring Force (Spring Model)
        // This pulls the electron back towards its intended shell radius
        let targetRadius = initialOrbitRadii[this.shell - 1]; // Get target radius for its shell
        let currentDistance = this.position.dist(nucleus.position);
        let deviation = currentDistance - targetRadius;

        // Force direction: towards nucleus if too far, away from nucleus if too close
        let restoringForceDirection = p5.Vector.sub(nucleus.position, this.position).normalize();
        let restoringForceMagnitude = deviation * this.springConstant;
        this.applyForce(restoringForceDirection.mult(restoringForceMagnitude));

        // Optional: Hard clamp to prevent extreme distances (can be jarring)
        let vectorFromNucleus = p5.Vector.sub(this.position, nucleus.position);
        if (vectorFromNucleus.mag() < this.minOrbitRadius) {
            vectorFromNucleus.setMag(this.minOrbitRadius);
            this.position = p5.Vector.add(nucleus.position, vectorFromNucleus);
            this.velocity.mult(-0.2); // Bounce off with some energy loss
        } else if (vectorFromNucleus.mag() > this.maxOrbitRadius) {
            vectorFromNucleus.setMag(this.maxOrbitRadius);
            this.position = p5.Vector.add(nucleus.position, vectorFromNucleus);
            this.velocity.mult(-0.2); // Bounce off with some energy loss
        }

        // 3. Adjust Velocity to be Tangential (Perpendicularity Enforcement)
        // This ensures the velocity vector remains perpendicular to the radius vector
        let currentSpeed = this.velocity.mag();

        if (currentSpeed > 0.001) { // Only adjust if there's significant movement
            let toElectron = p5.Vector.sub(this.position, nucleus.position);
            // Get a vector perpendicular to 'toElectron' (tangential direction)
            let tangentialDirection = createVector(-toElectron.y, toElectron.x).normalize();

            // Ensure tangentialDirection matches current orbit direction
            if (this.velocity.dot(tangentialDirection) < 0) {
                 tangentialDirection.mult(-1);
            }

            // Re-align the velocity to this tangential direction, maintaining current speed
            this.velocity = tangentialDirection.mult(currentSpeed);
        } else {
            // If electron somehow stopped, give it a small nudge to restart orbital motion
            let toElectron = p5.Vector.sub(this.position, nucleus.position);
            let tangentialDirection = createVector(-toElectron.y, toElectron.x).normalize();
            this.velocity = tangentialDirection.mult(0.5); // A small initial speed
        }

        // 4. Update Trail
        this.trail.push(this.position.copy()); // Add current position to trail
        if (this.trail.length > this.trailLength) {
            this.trail.splice(0, 1); // Remove the oldest position
        }
    }

    show() {
        noStroke();
        let shellColor;
        if (this.shell === 1) {
            shellColor = color(255, 0, 0, 200);      // Red for shell 1
        } else if (this.shell === 2) {
            shellColor = color(0, 255, 0, 200);      // Green for shell 2
        } else if (this.shell === 3) {
            shellColor = color(0, 0, 255, 200);      // Blue for shell 3
        } else if (this.shell === 4) {
            shellColor = color(255, 165, 0, 200);    // Orange for shell 4
        } else if (this.shell === 5) {
            shellColor = color(128, 0, 128, 200);    // Purple for shell 5
        } else {
            shellColor = color(255, 255, 255, 200); // White for other shells (if any)
        }
        fill(shellColor);
        circle(this.position.x, this.position.y, 12);
        stroke(0);
        strokeWeight(2);
        line(this.position.x - 4, this.position.y, this.position.x + 4, this.position.y);
        strokeWeight(1);
    }

    showTrail() {
        stroke(255, 255, 255, 50); // Color of the trail
        strokeWeight(1);
        noFill();
        beginShape();
        for (let v of this.trail) {
            vertex(v.x, v.y);
        }
        endShape();
    }
}