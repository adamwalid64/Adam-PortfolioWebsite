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
    bar.style.height = Math.random() * 60 + 10 + 'px'; // Random height between 10-70px
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
      const newHeight = Math.random() * 60 + 10; // Random height between 10-70px
      bar.style.height = newHeight + 'px';
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