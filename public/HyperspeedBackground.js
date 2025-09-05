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
    let resizeTimeout;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Safari mobile fix: Use a more reliable devicePixelRatio detection
      const dpr = window.devicePixelRatio || 1;
      const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
      
      // For Safari mobile, use a more conservative approach
      const pixelRatio = isSafariMobile ? Math.min(dpr, 2) : dpr;
      
      // Only resize if dimensions actually changed significantly
      const newWidth = rect.width;
      const newHeight = rect.height;
      const currentWidth = dimensions.width;
      const currentHeight = dimensions.height;
      
      // Only update if there's a meaningful size change (avoid micro-adjustments during scroll)
      if (Math.abs(newWidth - currentWidth) > 5 || Math.abs(newHeight - currentHeight) > 5 || currentWidth === 0) {
        canvas.width = newWidth * pixelRatio;
        canvas.height = newHeight * pixelRatio;
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);
        
        // Clear any previous drawing state
        ctx.clearRect(0, 0, newWidth, newHeight);
        
        // Update dimensions with debouncing to prevent constant resets
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setDimensions({ width: newWidth, height: newHeight });
        }, 50);
      }
    };

    // Initial resize with a slight delay to ensure DOM is ready
    setTimeout(resizeCanvas, 100);
    
    // Use passive listeners for better scroll performance
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 200);
    }, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions.width, dimensions.height]);

  // Use refs to store stars and animation state to prevent recreation
  const starsRef = useRef([]);
  const animationStateRef = useRef({
    lastTime: 0,
    isSafariMobile: false,
    targetFPS: 60,
    frameInterval: 1000 / 60
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!dimensions.width || !dimensions.height) return;

    // Detect Safari mobile for performance optimization
    const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
    
    // Update animation state
    animationStateRef.current.isSafariMobile = isSafariMobile;
    animationStateRef.current.targetFPS = isSafariMobile ? 30 : 60;
    animationStateRef.current.frameInterval = 1000 / animationStateRef.current.targetFPS;
    
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
        this.maxTrailLength = isSafariMobile ? Math.min(trailLength, 10) : trailLength;
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

        // Optimize drawing for Safari mobile
        if (isSafariMobile) {
          // Simplified drawing for better performance
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
        } else {
          // Full trail drawing for other browsers
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
    }

    // Only create new stars if we don't have any or if star count changed significantly
    const actualStarCount = isSafariMobile ? Math.min(starCount, 50) : starCount;
    if (starsRef.current.length === 0 || Math.abs(starsRef.current.length - actualStarCount) > 10) {
      starsRef.current = Array.from({ length: actualStarCount }, () => new Star());
    }

    // Animation loop with performance optimization
    const animate = (currentTime) => {
      const state = animationStateRef.current;
      
      if (currentTime - state.lastTime >= state.frameInterval) {
        const width = dimensions.width || window.innerWidth;
        const height = dimensions.height || window.innerHeight;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Update and draw stars
        starsRef.current.forEach(star => {
          star.update();
          star.draw();
        });

        state.lastTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Only start animation if not already running
    if (!animationRef.current) {
      animate(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
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
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: backgroundColor,
        // Safari mobile fixes and scroll prevention
        WebkitTransform: 'translate3d(0, 0, 0)',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    />
  );
};

// Make HyperspeedBackground globally available
window.HyperspeedBackground = HyperspeedBackground; 