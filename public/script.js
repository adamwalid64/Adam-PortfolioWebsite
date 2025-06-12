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

  const spacing = 60;
  const lineCount = 5;
  const lines = Array.from({ length: lineCount }, () => ({
    speed: 0.5 + Math.random(),
    offset: 0,
    points: []
  }));

  function initLines() {
    const needed = Math.ceil(canvas.width / spacing) + 2;
    lines.forEach(line => {
      line.points = [];
      for (let i = 0; i < needed; i++) {
        line.points.push({ x: i * spacing, y: randY() });
      }
    });
  }

  function randY() {
    return Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';

    lines.forEach(line => {
      ctx.beginPath();
      line.points.forEach((pt, i) => {
        const x = pt.x - line.offset;
        if (i === 0) ctx.moveTo(x, pt.y);
        else ctx.lineTo(x, pt.y);
      });
      ctx.stroke();

      line.offset += line.speed;
      if (line.offset >= spacing) {
        line.offset -= spacing;
        line.points.shift();
        const lastX = line.points[line.points.length - 1].x;
        line.points.push({ x: lastX + spacing, y: randY() });
      }
    });

    requestAnimationFrame(draw);
  }

  initLines();
  draw();
}
