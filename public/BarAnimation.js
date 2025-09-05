// Bar Animation Script
function createBarAnimation() {
  const barContainer = document.getElementById('bar-container');
  if (!barContainer) return;

  // Clear existing bars
  barContainer.innerHTML = '';

  // Create bars first
  const barCount = 20;
  const bars = [];
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    
    // Random height between 10-70px
    bar.style.height = Math.random() * 60 + 10 + 'px';
    
    // Randomly add internal separations to create stacked effect
    if (Math.random() < 0.25) { // 25% chance of internal separation
      const segments = Math.floor(Math.random() * 2) + 2; // 2-3 segments (fewer segments)
      bar.style.background = `repeating-linear-gradient(
        to top,
        #D5CCC3 0,
        #D5CCC3 calc(100% / ${segments} - 3px),
        transparent calc(100% / ${segments} - 3px),
        transparent calc(100% / ${segments})
      )`;
    }
    
    barContainer.appendChild(bar);
    bars.push(bar);
  }

  // Create Y-axis (left side)
  const yAxis = document.createElement('div');
  yAxis.className = 'y-axis';
  barContainer.appendChild(yAxis);

  // Create X-axis (bottom)
  const xAxis = document.createElement('div');
  xAxis.className = 'x-axis';
  barContainer.appendChild(xAxis);

  // Animate bars
  function animateBars() {
    const bars = barContainer.querySelectorAll('.bar');
    bars.forEach(bar => {
      // Random height between 10-70px
      const newHeight = Math.random() * 60 + 10;
      bar.style.height = newHeight + 'px';
      
      // Randomly change internal separations for dynamic stacked effect
      if (Math.random() < 0.08) { // 8% chance to change internal separation
        const segments = Math.floor(Math.random() * 2) + 2; // 2-3 segments
        bar.style.background = `repeating-linear-gradient(
          to top,
          #D5CCC3 0,
          #D5CCC3 calc(100% / ${segments} - 3px),
          transparent calc(100% / ${segments} - 3px),
          transparent calc(100% / ${segments})
        )`;
      } else if (Math.random() < 0.05) { // 5% chance to remove separation
        bar.style.background = '#D5CCC3';
      }
    });
  }

  // Update bars every 800ms (slowed down)
  setInterval(animateBars, 800);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBarAnimation);
} else {
  createBarAnimation();
}

// Also run after React components are loaded
setTimeout(createBarAnimation, 1000); 