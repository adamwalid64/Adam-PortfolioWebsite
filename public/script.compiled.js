'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // Render Particles background
  var bg = document.getElementById('particles-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.id = 'particles-bg';
    document.body.prepend(bg);
  }
  ReactDOM.render(React.createElement(Particles, {
    particleColors: ['#ffffff', '#ffffff'],
    particleCount: 200,
    particleSpread: 10,
    speed: 0.1,
    particleBaseSize: 100,
    moveParticlesOnHover: true,
    alphaParticles: false,
    disableRotation: false
  }), bg);
  loadProjects().then(function (projects) {
    var root = document.getElementById('project-grid');
    // Debug: Check if ChromaGrid is defined
    console.log('ChromaGrid is', window.ChromaGrid);
    if (root) {
      ReactDOM.render(React.createElement(ChromaGrid, { items: projects }), root);
    }
  })['catch'](function (err) {
    return console.error(err);
  });
});

function loadProjects() {
  return fetch('/api/projects').then(function (res) {
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  })['catch'](function () {
    return fetch('data/projects.json').then(function (res) {
      if (!res.ok) throw new Error('Failed to load projects.json');
      return res.json();
    });
  });
}

function startCanvas() {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', function () {
    resize();
    initLine();
  });
  resize();

  var spacing = 30;
  var speed = 0.5; // slower horizontal movement
  var points = [];
  var lastValue = 0;

  function yToValue(y) {
    // map y position to a stock price between 50 and 150
    return (1 - y / canvas.height) * 100 + 50;
  }

  function initLine() {
    var needed = Math.ceil(canvas.width / spacing) + 3;
    points = [];
    var y = randY();
    for (var i = 0; i < needed; i++) {
      var value = yToValue(y);
      var x = i * spacing;
      points.push({
        x: x,
        y: y,
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
    var range = canvas.height * 0.15;
    var y = prevY + (Math.random() - 0.5) * range;
    var min = canvas.height * 0.2;
    var max = canvas.height * 0.8;
    return Math.max(min, Math.min(max, y));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';

    ctx.beginPath();
    points.forEach(function (pt, i) {
      if (i === 0) {
        ctx.moveTo(pt.x, pt.y);
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    });
    ctx.stroke();

    // draw projection line
    var last = points[points.length - 1];
    var prev = points[points.length - 2];
    var slope = (last.y - prev.y) / (last.x - prev.x);
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    var projX = last.x;
    var projY = last.y;
    for (var i = 0; i < 5; i++) {
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
    points.forEach(function (pt) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (pt.showLabel) {
        ctx.fillText(pt.value, pt.labelX, pt.labelY - 8);
      }
    });

    // move points left and add new ones when needed
    points.forEach(function (pt) {
      pt.x -= speed;
      pt.labelX = pt.x; // keep value labels aligned with points
      pt.labelY = pt.y;
      pt.value = yToValue(pt.y).toFixed(2);
    });
    if (points[0].x <= -spacing) {
      points.shift();
      var lastPt = points[points.length - 1];
      var newY = nextY(lastPt.y);
      var newValue = yToValue(newY);
      var newX = lastPt.x + spacing;
      points.push({
        x: newX,
        y: newY,
        value: newValue.toFixed(2),
        labelX: newX,
        labelY: newY,
        showLabel: !lastPt.showLabel
      });

      lastValue = newValue;
    }

    requestAnimationFrame(draw);
  }

  initLine();
  draw();
}

function initBars() {
  var container = document.getElementById('bar-container');
  var header = document.querySelector('h1.title');
  if (!container || !header) return;

  var numBars = 20;
  var gap = 3; // keep in sync with CSS
  var bars = [];
  for (var i = 0; i < numBars; i++) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    container.appendChild(bar);
    bars.push(bar);
  }

  function setSize() {
    var width = header.offsetWidth;
    var height = header.offsetHeight * 0.8;
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    var barWidth = (width - gap * (numBars - 1)) / numBars;
    bars.forEach(function (bar) {
      bar.style.width = barWidth + 'px';
    });
  }

  window.addEventListener('resize', setSize);
  // wait a tick for fonts to load
  setTimeout(setSize, 0);

  function animate() {
    var maxHeight = container.clientHeight;
    bars.forEach(function (bar) {
      var height = Math.random() * maxHeight;
      bar.style.height = height + 'px';
    });
    var delay = Math.random() * 300 + 200;
    setTimeout(animate, delay);
  }

  animate();
}
