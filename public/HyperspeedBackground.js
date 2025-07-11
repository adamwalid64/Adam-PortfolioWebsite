const { useState, useEffect, useRef } = React;

// Hyperspeed Background Component
const HyperspeedBackground = ({ 
  speed = 1, 
  starCount = 100, 
  starSize = 2,
  trailLength = 20,
  backgroundColor = '#151515',
  starColor = '#D5CCC3',
  trailColor = '#A63D40'
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
      setDimensions({ width: rect.width, height: rect.height });
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
        this.x = Math.random() * dimensions.width;
        this.y = Math.random() * dimensions.height;
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
        const x = (this.x - dimensions.width / 2) * scale + dimensions.width / 2;
        const y = (this.y - dimensions.height / 2) * scale + dimensions.height / 2;

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
          
          if (current.x > 0 && current.x < dimensions.width && 
              current.y > 0 && current.y < dimensions.height) {
            
            const alpha = i / this.trail.length;
            ctx.strokeStyle = `rgba(166, 61, 64, ${alpha * 0.8})`;
            ctx.lineWidth = this.size * current.scale * 0.5;
            
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
          }
        }
        ctx.stroke();

        // Draw star
        const last = this.trail[this.trail.length - 1];
        if (last.x > 0 && last.x < dimensions.width && 
            last.y > 0 && last.y < dimensions.height) {
          
          ctx.beginPath();
          ctx.fillStyle = starColor;
          ctx.arc(last.x, last.y, this.size * last.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create stars
    const stars = Array.from({ length: starCount }, () => new Star());

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

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