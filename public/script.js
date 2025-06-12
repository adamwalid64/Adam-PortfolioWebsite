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

  const spacing = 40;
  const lineCount = 6;
  const lines = Array.from({ length: lineCount }, () => ({
    speed: 0.3 + Math.random(),
    offset: 0,
    points: []
  }));

  function initLines() {
    const needed = Math.ceil(canvas.width / spacing) + 3;
    lines.forEach(line => {
      line.points = [];
      let y = randY();
      for (let i = 0; i < needed; i++) {
        line.points.push({ x: i * spacing, y });
        y = nextY(y);
      }
    });
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
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';

    lines.forEach(line => {
      ctx.beginPath();
      for (let i = 0; i < line.points.length - 1; i++) {
        const pt = line.points[i];
        const next = line.points[i + 1];
        const x = pt.x - line.offset;
        const nx = next.x - line.offset;
        const xc = (x + nx) / 2;
        const yc = (pt.y + next.y) / 2;
        if (i === 0) {
          ctx.moveTo(x, pt.y);
        }
        ctx.quadraticCurveTo(x, pt.y, xc, yc);
      }
      ctx.stroke();

      line.offset += line.speed;
      if (line.offset >= spacing) {
        line.offset -= spacing;
        line.points.shift();
        const last = line.points[line.points.length - 1];
        line.points.push({ x: last.x + spacing, y: nextY(last.y) });
      }
    });

    requestAnimationFrame(draw);
  }

  initLines();
  draw();
}
