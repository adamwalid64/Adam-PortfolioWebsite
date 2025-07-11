// Particles.js - ReactBits OGL background for browser
"use strict";

var _React = React;
var useEffect = _React.useEffect;
var useRef = _React.useRef;

var defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

var hexToRgb = function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(function (c) {
      return c + c;
    }).join("");
  }
  var int = parseInt(hex, 16);
  var r = (int >> 16 & 255) / 255;
  var g = (int >> 8 & 255) / 255;
  var b = (int & 255) / 255;
  return [r, g, b];
};

var vertex = "\n  attribute vec3 position;\n  attribute vec4 random;\n  attribute vec3 color;\n  \n  uniform mat4 modelMatrix;\n  uniform mat4 viewMatrix;\n  uniform mat4 projectionMatrix;\n  uniform float uTime;\n  uniform float uSpread;\n  uniform float uBaseSize;\n  uniform float uSizeRandomness;\n  \n  varying vec4 vRandom;\n  varying vec3 vColor;\n  \n  void main() {\n    vRandom = random;\n    vColor = color;\n    \n    vec3 pos = position * uSpread;\n    pos.z *= 10.0;\n    \n    vec4 mPos = modelMatrix * vec4(pos, 1.0);\n    float t = uTime;\n    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);\n    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);\n    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);\n    \n    vec4 mvPos = viewMatrix * mPos;\n    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);\n    gl_Position = projectionMatrix * mvPos;\n  }\n";

var fragment = "\n  precision highp float;\n  \n  uniform float uTime;\n  uniform float uAlphaParticles;\n  varying vec4 vRandom;\n  varying vec3 vColor;\n  \n  void main() {\n    vec2 uv = gl_PointCoord.xy;\n    float d = length(uv - vec2(0.5));\n    \n    if(uAlphaParticles < 0.5) {\n      if(d > 0.5) {\n        discard;\n      }\n      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);\n    } else {\n      float circle = smoothstep(0.5, 0.4, d) * 0.8;\n      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);\n    }\n  }\n";

function Particles(_ref) {
  var _ref$particleCount = _ref.particleCount;
  var particleCount = _ref$particleCount === undefined ? 200 : _ref$particleCount;
  var _ref$particleSpread = _ref.particleSpread;
  var particleSpread = _ref$particleSpread === undefined ? 10 : _ref$particleSpread;
  var _ref$speed = _ref.speed;
  var speed = _ref$speed === undefined ? 0.1 : _ref$speed;
  var particleColors = _ref.particleColors;
  var _ref$moveParticlesOnHover = _ref.moveParticlesOnHover;
  var moveParticlesOnHover = _ref$moveParticlesOnHover === undefined ? false : _ref$moveParticlesOnHover;
  var _ref$particleHoverFactor = _ref.particleHoverFactor;
  var particleHoverFactor = _ref$particleHoverFactor === undefined ? 1 : _ref$particleHoverFactor;
  var _ref$alphaParticles = _ref.alphaParticles;
  var alphaParticles = _ref$alphaParticles === undefined ? false : _ref$alphaParticles;
  var _ref$particleBaseSize = _ref.particleBaseSize;
  var particleBaseSize = _ref$particleBaseSize === undefined ? 100 : _ref$particleBaseSize;
  var _ref$sizeRandomness = _ref.sizeRandomness;
  var sizeRandomness = _ref$sizeRandomness === undefined ? 1 : _ref$sizeRandomness;
  var _ref$cameraDistance = _ref.cameraDistance;
  var cameraDistance = _ref$cameraDistance === undefined ? 20 : _ref$cameraDistance;
  var _ref$disableRotation = _ref.disableRotation;
  var disableRotation = _ref$disableRotation === undefined ? false : _ref$disableRotation;
  var className = _ref.className;

  var containerRef = useRef(null);
  var mouseRef = useRef({ x: 0, y: 0 });

  useEffect(function () {
    var Renderer = undefined,
        Camera = undefined,
        Geometry = undefined,
        Program = undefined,
        Mesh = undefined;
    var oglLoaded = false;
    // Dynamically load ogl from CDN if not present
    if (!window.Renderer) {
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/ogl@0.0.32/dist/ogl.umd.js';
      script.onload = function () {
        Renderer = window.Renderer;
        Camera = window.Camera;
        Geometry = window.Geometry;
        Program = window.Program;
        Mesh = window.Mesh;
        oglLoaded = true;
        startParticles();
      };
      document.body.appendChild(script);
    } else {
      Renderer = window.Renderer;
      Camera = window.Camera;
      Geometry = window.Geometry;
      Program = window.Program;
      Mesh = window.Mesh;
      oglLoaded = true;
      startParticles();
    }

    var animationFrameId = undefined;
    function startParticles() {
      var container = containerRef.current;
      if (!container) return;
      var renderer = new Renderer({ depth: false, alpha: true });
      var gl = renderer.gl;
      container.appendChild(gl.canvas);
      gl.clearColor(0, 0, 0, 0);
      var camera = new Camera(gl, { fov: 15 });
      camera.position.set(0, 0, cameraDistance);
      var resize = function resize() {
        var width = container.clientWidth;
        var height = container.clientHeight;
        renderer.setSize(width, height);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      };
      window.addEventListener("resize", resize, false);
      resize();
      var handleMouseMove = function handleMouseMove(e) {
        var rect = container.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width * 2 - 1;
        var y = -((e.clientY - rect.top) / rect.height * 2 - 1);
        mouseRef.current = { x: x, y: y };
      };
      if (moveParticlesOnHover) {
        container.addEventListener("mousemove", handleMouseMove);
      }
      var count = particleCount;
      var positions = new Float32Array(count * 3);
      var randoms = new Float32Array(count * 4);
      var colors = new Float32Array(count * 3);
      var palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;
      for (var i = 0; i < count; i++) {
        var x = undefined,
            y = undefined,
            z = undefined,
            len = undefined;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
          len = x * x + y * y + z * z;
        } while (len > 1 || len === 0);
        var r = Math.cbrt(Math.random());
        positions.set([x * r, y * r, z * r], i * 3);
        randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
        var col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
        colors.set(col, i * 3);
      }
      var geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        random: { size: 4, data: randoms },
        color: { size: 3, data: colors }
      });
      var program = new Program(gl, {
        vertex: vertex,
        fragment: fragment,
        uniforms: {
          uTime: { value: 0 },
          uSpread: { value: particleSpread },
          uBaseSize: { value: particleBaseSize },
          uSizeRandomness: { value: sizeRandomness },
          uAlphaParticles: { value: alphaParticles ? 1 : 0 }
        },
        transparent: true,
        depthTest: false
      });
      var particles = new Mesh(gl, { mode: gl.POINTS, geometry: geometry, program: program });
      var lastTime = performance.now();
      var elapsed = 0;
      var update = function update(t) {
        animationFrameId = requestAnimationFrame(update);
        var delta = t - lastTime;
        lastTime = t;
        elapsed += delta * speed;
        program.uniforms.uTime.value = elapsed * 0.001;
        if (moveParticlesOnHover) {
          particles.position.x = -mouseRef.current.x * particleHoverFactor;
          particles.position.y = -mouseRef.current.y * particleHoverFactor;
        } else {
          particles.position.x = 0;
          particles.position.y = 0;
        }
        if (!disableRotation) {
          particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
          particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
          particles.rotation.z += 0.01 * speed;
        }
        renderer.render({ scene: particles, camera: camera });
      };
      animationFrameId = requestAnimationFrame(update);
      // Cleanup
      Particles._cleanup = function () {
        window.removeEventListener("resize", resize);
        if (moveParticlesOnHover) {
          container.removeEventListener("mousemove", handleMouseMove);
        }
        cancelAnimationFrame(animationFrameId);
        if (container.contains(gl.canvas)) {
          container.removeChild(gl.canvas);
        }
      };
    }
    // Cleanup on unmount
    return function () {
      if (Particles._cleanup) Particles._cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, particleSpread, speed, moveParticlesOnHover, particleHoverFactor, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation]);
  return React.createElement('div', {
    ref: containerRef,
    className: "particles-container" + (className ? ' ' + className : '')
  });
}

window.Particles = Particles;
