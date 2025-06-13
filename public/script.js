document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/projects')
    .then(res => res.json())
    .then(projects => {
      const container = document.getElementById('project-list');
      projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project';

        let html = `<h3>${p.title}</h3>`;
        if (p.date) {
          html += `<p class="project-date">${p.date}</p>`;
        }
        if (p.role) {
          html += `<p class="project-role">${p.role}</p>`;
        }
        html += `<p>${p.description}</p>`;

        if (Array.isArray(p.details)) {
          html += '<ul class="project-details">';
          p.details.forEach(d => {
            html += `<li>${d}</li>`;
          });
          html += '</ul>';
        }

        if (Array.isArray(p.tech)) {
          html += `<p class="project-tech"><strong>Tech:</strong> ${p.tech.join(', ')}</p>`;
        }

        if (p.link) {
          html += `<p><a href="${p.link}" target="_blank" class="project-link">View Project</a></p>`;
        }

        div.innerHTML = html;
        container.appendChild(div);
      });
    })
    .catch(err => console.error(err));

  startCanvas();
  initBars();
});

function startCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stockBlock = document.getElementById('stock-block');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => {
    resize();
    initLine();
  });
  resize();

  const spacing = 30;
  const speed = 0.5; // slower horizontal movement
  let points = [];
  let lastValue = 0;

  function yToValue(y) {
    // map y position to a stock price between 50 and 150
    return (1 - y / canvas.height) * 100 + 50;
  }

  function initLine() {
    const needed = Math.ceil(canvas.width / spacing) + 3;
    points = [];
    let y = randY();
    for (let i = 0; i < needed; i++) {
      const value = yToValue(y);
      const x = i * spacing;
      points.push({
        x,
        y,
        value: value.toFixed(2),
        labelX: x,
        labelY: y,
        showLabel: i % 2 === 0
      });
      lastValue = value;
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

    // draw projection line
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const slope = (last.y - prev.y) / (last.x - prev.x);
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    let projX = last.x;
    let projY = last.y;
    for (let i = 0; i < 5; i++) {
      projX += spacing;
      projY += slope + (Math.random() - 0.5) * canvas.height * 0.03;
      ctx.lineTo(projX, projY);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.setLineDash([]);

    // draw points and values
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (pt.showLabel) {
        ctx.fillText(pt.value, pt.labelX, pt.labelY - 8);
      }
    });

    // move points left and add new ones when needed
    points.forEach(pt => {
      pt.x -= speed;
      pt.labelX = pt.x; // keep value labels aligned with points
      pt.labelY = pt.y;
      pt.value = yToValue(pt.y).toFixed(2);
    });
    if (points[0].x <= -spacing) {
      points.shift();
      const lastPt = points[points.length - 1];
      const newY = nextY(lastPt.y);
      const newValue = yToValue(newY);
      const newX = lastPt.x + spacing;
      points.push({
        x: newX,
        y: newY,
        value: newValue.toFixed(2),
        labelX: newX,
        labelY: newY,
        showLabel: !lastPt.showLabel
      });

      // update stock block on new point
      const trend = newValue - yToValue(lastPt.y);
      lastValue = newValue;
      if (stockBlock) {
        stockBlock.textContent = trend >= 0 ? `Stock Up \u25B2 ${trend.toFixed(2)}` : `Stock Down \u25BC ${Math.abs(trend).toFixed(2)}`;
        stockBlock.classList.toggle('up', trend >= 0);
        stockBlock.classList.toggle('down', trend < 0);
      }
    }

    requestAnimationFrame(draw);
  }

  initLine();
  draw();
}

function initBars() {
  const container = document.getElementById('bar-container');
  const header = document.querySelector('h1.title');
  if (!container || !header) return;

  const numBars = 20;
  const gap = 3; // keep in sync with CSS
  const bars = [];
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    container.appendChild(bar);
    bars.push(bar);
  }

  function setSize() {
    const width = header.offsetWidth;
    const height = header.offsetHeight * 0.8;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    const barWidth = (width - gap * (numBars - 1)) / numBars;
    bars.forEach(bar => {
      bar.style.width = `${barWidth}px`;
    });
  }

  window.addEventListener('resize', setSize);
  // wait a tick for fonts to load
  setTimeout(setSize, 0);

  function animate() {
    const maxHeight = container.clientHeight;
    bars.forEach(bar => {
      const height = Math.random() * maxHeight;
      bar.style.height = `${height}px`;
    });
    const delay = Math.random() * 300 + 200;
    setTimeout(animate, delay);
  }

  animate();
}
