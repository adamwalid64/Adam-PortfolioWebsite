document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/projects')
    .then(res => res.json())
    .then(projects => {
      const container = document.getElementById('project-list');
      projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project';
        div.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p>`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error(err));

  startCanvas();
});

function startCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const spacing = 30;
  const speed = 0.5; // slower horizontal movement
  let points = [];

  function initLine() {
    const needed = Math.ceil(canvas.width / spacing) + 3;
    points = [];
    let y = randY();
    for (let i = 0; i < needed; i++) {
      points.push({ x: i * spacing, y });
      y = nextY(y);
    }
  }

  function randY() {
    return Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
  }

  function nextY(prevY) {
    const range = canvas.height * 0.15;
    let y = prevY + (Math.random() - 0.5) * range;
    const min = canvas.height * 0.2;
    const max = canvas.height * 0.8;
    return Math.max(min, Math.min(max, y));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';

    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) {
        ctx.moveTo(pt.x, pt.y);
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    });
    ctx.stroke();

    // move points left and add new ones when needed
    points.forEach(pt => pt.x -= speed);
    if (points[0].x <= -spacing) {
      points.shift();
      const last = points[points.length - 1];
      points.push({ x: last.x + spacing, y: nextY(last.y) });
    }

    requestAnimationFrame(draw);
  }

  initLine();
  draw();
}
