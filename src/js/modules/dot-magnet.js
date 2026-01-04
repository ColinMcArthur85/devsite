/**
 * DotMagnet - Interactive background dot grid
 * Creates a subtle "magnetic" effect where dots react to the cursor.
 */
export class DotMagnet {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = [];
    this.mouse = { x: -1000, y: -1000 };
    
    this.config = {
      spacing: options.spacing || 24,
      dotSize: options.dotSize || 1.4,
      radius: options.radius || 150, // Interaction radius
      strength: options.strength || 0.35, // How "magnetic" it is
      color: options.color || 'currentColor',
      ...options
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createDots();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    
    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    
    this.createDots();
  }

  createDots() {
    this.dots = [];
    const cols = Math.ceil(this.width / this.config.spacing) + 1;
    const rows = Math.ceil(this.height / this.config.spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.dots.push({
          baseX: i * this.config.spacing,
          baseY: j * this.config.spacing,
          x: i * this.config.spacing,
          y: j * this.config.spacing
        });
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    document.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  update() {
    for (const dot of this.dots) {
      const dx = this.mouse.x - dot.baseX;
      const dy = this.mouse.y - dot.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.config.radius) {
        const force = (this.config.radius - distance) / this.config.radius;
        const targetX = dot.baseX + dx * force * this.config.strength;
        const targetY = dot.baseY + dy * force * this.config.strength;
        
        // Smooth transition
        dot.x += (targetX - dot.x) * 0.1;
        dot.y += (targetY - dot.y) * 0.1;
      } else {
        // Return to base position
        dot.x += (dot.baseX - dot.x) * 0.05;
        dot.y += (dot.baseY - dot.y) * 0.05;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Get computed color for the dots
    const style = window.getComputedStyle(this.canvas);
    this.ctx.fillStyle = style.color;
    
    for (const dot of this.dots) {
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, this.config.dotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize if the canvas exists
export const initHeroDots = () => {
  if (document.getElementById('hero-dots-canvas')) {
    new DotMagnet('hero-dots-canvas');
  }
};
