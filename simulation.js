class Car {
    constructor(x, y, velocity, mass, color, name) {
        this.x = x;
        this.y = y;
        this.velocity = velocity; // m/s
        this.mass = mass; // kg
        this.color = color;
        this.name = name;
        this.width = 80;
        this.height = 40;
        this.hasCollided = false;
        this.originalVelocity = velocity;
    }
    
    update() {
        if (!this.hasCollided) {
            this.x += this.velocity;
        }
    }
    
    draw(ctx) {
        // Draw car body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw car outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(this.x + 10, this.y + 5, this.width - 20, this.height - 10);
        ctx.strokeRect(this.x + 10, this.y + 5, this.width - 20, this.height - 10);
        
        // Draw wheels
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + this.height + 5, 8, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 15, this.y + this.height + 5, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw velocity vector (arrow)
        if (Math.abs(this.velocity) > 0.1) {
            const arrowLength = Math.abs(this.velocity) * 2;
            const arrowX = this.x + this.width / 2;
            const arrowY = this.y - 20;
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX + (this.velocity > 0 ? arrowLength : -arrowLength), arrowY);
            ctx.stroke();
            
            // Arrow head
            const headSize = 8;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.velocity > 0) {
                ctx.moveTo(arrowX + arrowLength, arrowY);
                ctx.lineTo(arrowX + arrowLength - headSize, arrowY - headSize/2);
                ctx.lineTo(arrowX + arrowLength - headSize, arrowY + headSize/2);
            } else {
                ctx.moveTo(arrowX - arrowLength, arrowY);
                ctx.lineTo(arrowX - arrowLength + headSize, arrowY - headSize/2);
                ctx.lineTo(arrowX - arrowLength + headSize, arrowY + headSize/2);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw car label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y + this.height + 35);
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
    
    checkCollision(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        
        return bounds1.left < bounds2.right &&
               bounds1.right > bounds2.left &&
               bounds1.top < bounds2.bottom &&
               bounds1.bottom > bounds2.top;
    }
}

class Simulation {
    constructor() {
        this.canvas = document.getElementById('simulationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.isRunning = false;
        this.hasCollisionOccurred = false;
        
        this.initializeCars();
        this.setupEventListeners();
        this.updateInfoDisplay();
    }
    
    initializeCars() {
        // Convert km/h to m/s (divide by 3.6) and scale for canvas
        const car1Speed = parseFloat(document.getElementById('car1Speed').value) / 3.6 * 2;
        const car2Speed = -parseFloat(document.getElementById('car2Speed').value) / 3.6 * 2;
        const car1Mass = parseFloat(document.getElementById('car1Mass').value);
        const car2Mass = parseFloat(document.getElementById('car2Mass').value);
        
        this.car1 = new Car(100, 180, car1Speed, car1Mass, '#4285f4', 'Car 1');
        this.car2 = new Car(620, 180, car2Speed, car2Mass, '#ea4335', 'Car 2');
    this.restitution = parseFloat(document.getElementById('restitution')?.value || 1);
        
        this.hasCollisionOccurred = false;
    }
    
    setupEventListeners() {
        // Speed sliders
        document.getElementById('car1Speed').addEventListener('input', (e) => {
            document.getElementById('car1SpeedValue').textContent = e.target.value;
            if (!this.isRunning) {
                this.initializeCars();
                this.updateInfoDisplay();
                this.draw();
            }
        });
        
        document.getElementById('car2Speed').addEventListener('input', (e) => {
            document.getElementById('car2SpeedValue').textContent = e.target.value;
            if (!this.isRunning) {
                this.initializeCars();
                this.updateInfoDisplay();
                this.draw();
            }
        });
        
        // Mass sliders
        document.getElementById('car1Mass').addEventListener('input', (e) => {
            document.getElementById('car1MassValue').textContent = e.target.value;
            if (!this.isRunning) {
                this.initializeCars();
                this.updateInfoDisplay();
                this.draw();
            }
        });
        
        document.getElementById('car2Mass').addEventListener('input', (e) => {
            document.getElementById('car2MassValue').textContent = e.target.value;
            if (!this.isRunning) {
                this.initializeCars();
                this.updateInfoDisplay();
                this.draw();
            }
        });

        // Restitution control
        const restEl = document.getElementById('restitution');
        if (restEl) {
            restEl.addEventListener('input', (e) => {
                document.getElementById('restitutionValue').textContent = e.target.value;
                this.restitution = parseFloat(e.target.value);
            });
        }
        
        // Buttons
        document.getElementById('startButton').addEventListener('click', () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });
        
        document.getElementById('resetButton').addEventListener('click', () => {
            this.reset();
        });
    }
    
    start() {
        this.isRunning = true;
        document.getElementById('startButton').textContent = 'Stop';
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        document.getElementById('startButton').textContent = 'Start Simulation';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    reset() {
        this.stop();
        this.initializeCars();
        this.updateInfoDisplay();
        this.clearAfterCollisionInfo();
        this.draw();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        // Check for collision before updating positions
        if (!this.hasCollisionOccurred && this.car1.checkCollision(this.car2)) {
            this.handleCollision();
            this.hasCollisionOccurred = true;
        }
        
        this.car1.update();
        this.car2.update();
        
        // Stop simulation if cars are off screen
        if (this.car1.x > this.canvas.width + 100 || this.car1.x < -180 ||
            this.car2.x > this.canvas.width + 100 || this.car2.x < -180) {
            this.stop();
        }
    }
    
    handleCollision() {
        // Store velocities before collision for conservation calculations
        const v1i = this.car1.velocity;
        const v2i = this.car2.velocity;
        const m1 = this.car1.mass;
        const m2 = this.car2.mass;
        
    // Collision with restitution (coefficient of restitution e)
    // Use 1 for perfectly elastic, 0 for perfectly inelastic
    const e = this.restitution !== undefined ? this.restitution : 1;

    // Solve using relative velocity along line of impact (1D)
    // v1f = (m1*v1i + m2*v2i + m2*e*(v2i - v1i)) / (m1 + m2)
    // v2f = (m1*v1i + m2*v2i + m1*e*(v1i - v2i)) / (m1 + m2)
    const v1f = (m1 * v1i + m2 * v2i + m2 * e * (v2i - v1i)) / (m1 + m2);
    const v2f = (m1 * v1i + m2 * v2i + m1 * e * (v1i - v2i)) / (m1 + m2);
        
        // Apply collision results
        this.car1.velocity = v1f;
        this.car2.velocity = v2f;
        this.car1.hasCollided = true;
        this.car2.hasCollided = true;
        
        // Update info display with post-collision data
    this.updateAfterCollisionInfo(v1i, v2i);
        
        // Add some visual separation to prevent overlap
        if (this.car1.x + this.car1.width > this.car2.x) {
            this.car1.x = this.car2.x - this.car1.width - 2;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw road markings
        this.drawRoad();
        
        // Draw cars
        this.car1.draw(this.ctx);
        this.car2.draw(this.ctx);
        
        // Draw collision effect if collision occurred
        if (this.hasCollisionOccurred) {
            this.drawCollisionEffect();
        }
    }
    
    drawRoad() {
        // Road lines
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([20, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawCollisionEffect() {
        const centerX = (this.car1.x + this.car1.width/2 + this.car2.x + this.car2.width/2) / 2;
        const centerY = (this.car1.y + this.car1.height/2 + this.car2.y + this.car2.height/2) / 2;
        
        // Draw explosion-like effect
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateInfoDisplay() {
        // Convert velocities back to km/h for display
        const car1VelKmh = (this.car1.originalVelocity * 3.6 / 2);
        const car2VelKmh = (Math.abs(this.car2.originalVelocity) * 3.6 / 2);
        
        // Convert to m/s for physics calculations
        const car1VelMs = car1VelKmh / 3.6;
        const car2VelMs = -car2VelKmh / 3.6; // Negative because car2 moves left
        
        document.getElementById('car1VelBefore').textContent = car1VelMs.toFixed(1);
        document.getElementById('car2VelBefore').textContent = car2VelMs.toFixed(1);
        
        // Calculate momentum (p = mv)
        const momentum = this.car1.mass * car1VelMs + this.car2.mass * car2VelMs;
    document.getElementById('momentumBefore').textContent = momentum.toFixed(0);
    document.getElementById('p1Before').textContent = (this.car1.mass * car1VelMs).toFixed(1);
    document.getElementById('p2Before').textContent = (this.car2.mass * car2VelMs).toFixed(1);
    document.getElementById('ke1Before').textContent = (0.5 * this.car1.mass * car1VelMs * car1VelMs).toFixed(0);
    document.getElementById('ke2Before').textContent = (0.5 * this.car2.mass * car2VelMs * car2VelMs).toFixed(0);

    // Closing speed and center-of-mass velocity
    const closingSpeed = Math.abs(car1VelMs - car2VelMs);
    const comVel = (this.car1.mass * car1VelMs + this.car2.mass * car2VelMs) / (this.car1.mass + this.car2.mass);
    document.getElementById('closingSpeed').textContent = closingSpeed.toFixed(2);
    document.getElementById('comVelocity').textContent = comVel.toFixed(2);
        
        // Calculate kinetic energy (KE = 0.5mv²)
        const ke = 0.5 * this.car1.mass * car1VelMs * car1VelMs + 
                   0.5 * this.car2.mass * car2VelMs * car2VelMs;
        document.getElementById('keBefore').textContent = ke.toFixed(0);
    }
    
    updateAfterCollisionInfo(v1i, v2i) {
        // Convert canvas velocities back to m/s
        const car1VelAfter = this.car1.velocity / 2;
        const car2VelAfter = this.car2.velocity / 2;

        document.getElementById('car1VelAfter').textContent = car1VelAfter.toFixed(2);
        document.getElementById('car2VelAfter').textContent = car2VelAfter.toFixed(2);

        // Per-car momentum
        const p1After = this.car1.mass * car1VelAfter;
        const p2After = this.car2.mass * car2VelAfter;
        document.getElementById('p1After').textContent = p1After.toFixed(1);
        document.getElementById('p2After').textContent = p2After.toFixed(1);

        // Total momentum after
        const momentumAfter = p1After + p2After;
        document.getElementById('momentumAfter').textContent = momentumAfter.toFixed(0);

        // Per-car KE after
        const ke1After = 0.5 * this.car1.mass * car1VelAfter * car1VelAfter;
        const ke2After = 0.5 * this.car2.mass * car2VelAfter * car2VelAfter;
        document.getElementById('ke1After').textContent = ke1After.toFixed(0);
        document.getElementById('ke2After').textContent = ke2After.toFixed(0);

        const keAfter = ke1After + ke2After;
        document.getElementById('keAfter').textContent = keAfter.toFixed(0);

        // Kinetic energy lost (before - after)
        const beforeKe1 = parseFloat(document.getElementById('ke1Before').textContent) || 0;
        const beforeKe2 = parseFloat(document.getElementById('ke2Before').textContent) || 0;
        const keBefore = beforeKe1 + beforeKe2;
        const keLost = keBefore - keAfter;
        document.getElementById('keLost').textContent = keLost.toFixed(0);
    }
    
    clearAfterCollisionInfo() {
        document.getElementById('car1VelAfter').textContent = '-';
        document.getElementById('car2VelAfter').textContent = '-';
        document.getElementById('momentumAfter').textContent = '-';
        document.getElementById('keAfter').textContent = '-';
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new Simulation();
    simulation.draw(); // Draw initial state
});