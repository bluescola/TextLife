// ============================================
// 橙色粒子飘落系统
// ============================================

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;

        this.setupCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        document.body.appendChild(this.canvas);

        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        window.addEventListener('resize', () => this.resize());
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3,
            // 橙色系
            color: this.getOrangeColor()
        };
    }

    getOrangeColor() {
        const colors = [
            'rgba(255, 107, 0',   // primary-orange
            'rgba(255, 69, 0',    // secondary-orange
            'rgba(255, 170, 51',  // accent-orange
            'rgba(204, 85, 0'     // dark-orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticle(particle) {
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        // 重置粒子位置
        if (particle.y > this.canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * this.canvas.width;
        }

        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.x = Math.random() * this.canvas.width;
        }
    }

    drawParticle(particle) {
        this.ctx.fillStyle = `${particle.color}, ${particle.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();

        // 添加发光效果
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `${particle.color}, 0.8)`;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 页面加载后初始化粒子系统
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
