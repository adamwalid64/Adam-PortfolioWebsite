const { useState, useEffect, useRef } = React;

const AnimatedBarGraph = ({ 
  barCount = 20, 
  maxValue = 100, 
  updateInterval = 100,
  barWidth = 4,
  barSpacing = 2,
  height = 60,
  colors = ['#00ffaa', '#ff00aa', '#00aaff', '#ffaa00', '#aa00ff']
}) => {
  const [values, setValues] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize random values
  useEffect(() => {
    const initialValues = Array.from({ length: barCount }, () => 
      Math.floor(Math.random() * maxValue)
    );
    setValues(initialValues);
  }, [barCount, maxValue]);

  // Animate values
  useEffect(() => {
    const updateValues = () => {
      setValues(prevValues => 
        prevValues.map(() => Math.floor(Math.random() * maxValue))
      );
    };

    const interval = setInterval(updateValues, updateInterval);
    return () => clearInterval(interval);
  }, [maxValue, updateInterval]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= barCount; i++) {
      const x = i * (barWidth + barSpacing);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw bars
    values.forEach((value, index) => {
      const x = index * (barWidth + barSpacing);
      const barHeight = (value / maxValue) * height;
      const y = height - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height);
      const color = colors[index % colors.length];
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '80');
      
      // Draw bar with 3D effect
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Add highlight
      ctx.fillStyle = color + '40';
      ctx.fillRect(x, y, barWidth / 3, barHeight);
      
      // Add shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + barWidth, y, 1, barHeight);
    });

    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      const value = Math.round((5 - i) * (maxValue / 5));
      ctx.fillText(value.toString(), -15, y + 3);
    }

    // X-axis label
    ctx.fillText('Data Points', canvas.width / 2, height + 20);

  }, [values, barCount, maxValue, height, barWidth, barSpacing, colors]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: barCount * (barWidth + barSpacing) + 40,
          height: height + 40,
          display: 'block'
        }}
      />
    </div>
  );
};

// Make AnimatedBarGraph globally available
window.AnimatedBarGraph = AnimatedBarGraph; 