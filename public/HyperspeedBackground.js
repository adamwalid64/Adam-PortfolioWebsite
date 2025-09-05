const { useState, useEffect, useRef } = React;

// Hyperspeed Background Component
const HyperspeedBackground = ({ 
  speed = 1, 
  starCount = 100, 
  starSize = 2,
  trailLength = 20,
  backgroundColor = '#151515',
  starColor = '#D5CCC3',
  trailColor = '#9966CC'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Force a small delay to ensure proper canvas setup
      setTimeout(() => {
        setDimensions({ width: rect.width, height: rect.height });
      }, 10);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!dimensions.width || !dimensions.height) return;

    // Star class
    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (dimensions.width || window.innerWidth);
        this.y = Math.random() * (dimensions.height || window.innerHeight);
        this.z = Math.random() * 2000;
        this.size = Math.random() * starSize + 1;
        this.speed = Math.random() * speed + 0.5;
        this.trail = [];
        this.maxTrailLength = trailLength;
      }

      update() {
        this.z -= this.speed * 10;
        
        if (this.z < 1) {
          this.reset();
          this.z = 2000;
        }

        // Calculate screen position
        const scale = 1000 / this.z;
        const width = dimensions.width || window.innerWidth;
        const height = dimensions.height || window.innerHeight;
        const x = (this.x - width / 2) * scale + width / 2;
        const y = (this.y - height / 2) * scale + height / 2;

        // Add to trail
        this.trail.push({ x, y, scale });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }

        return { x, y, scale };
      }

      draw() {
        if (this.trail.length === 0) return;

        // Draw trail
        ctx.beginPath();
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = this.size * 0.5;
        
        for (let i = 0; i < this.trail.length - 1; i++) {
          const current = this.trail[i];
          const next = this.trail[i + 1];
          
          const width = dimensions.width || window.innerWidth;
          const height = dimensions.height || window.innerHeight;
          if (current.x > 0 && current.x < width && 
              current.y > 0 && current.y < height) {
            
            const alpha = i / this.trail.length;
            ctx.strokeStyle = `rgba(153, 102, 204, ${alpha * 0.8})`;
            ctx.lineWidth = this.size * current.scale * 0.5;
            
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
          }
        }
        ctx.stroke();

        // Draw star
        const last = this.trail[this.trail.length - 1];
        const width = dimensions.width || window.innerWidth;
        const height = dimensions.height || window.innerHeight;
        if (last.x > 0 && last.x < width && 
            last.y > 0 && last.y < height) {
          
          ctx.beginPath();
          ctx.fillStyle = starColor;
          ctx.arc(last.x, last.y, this.size * last.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create stars - recreate when dimensions change
    const stars = Array.from({ length: starCount }, () => new Star());

    // Animation loop
    const animate = () => {
      const width = dimensions.width || window.innerWidth;
      const height = dimensions.height || window.innerHeight;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, speed, starCount, starSize, trailLength, backgroundColor, starColor, trailColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: backgroundColor
      }}
    />
  );
};

// Make HyperspeedBackground globally available
window.HyperspeedBackground = HyperspeedBackground; 