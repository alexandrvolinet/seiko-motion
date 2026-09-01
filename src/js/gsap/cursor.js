export function initCursor() {
  var starCanvas = document.getElementById("starfield");
  var starCtx = starCanvas.getContext("2d");
  var fxCanvas = document.getElementById("fx-canvas");
  var fxCtx = fxCanvas.getContext("2d");

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W, H;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    [starCanvas, fxCanvas].forEach(function (c) {
      c.width = W * DPR;
      c.height = H * DPR;
      c.style.width = W + "px";
      c.style.height = H + "px";
    });
    starCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fxCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  // ---- particle engine ----
  var PURPLE_BRIGHT = [170, 60, 255];
  var PURPLE_DEEP = [120, 20, 255];
  var WHITE = [255, 255, 255];
  var PINK = [205, 120, 255];

  function rgba(c, a) {
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function Particle(x, y, o) {
    o = o || {};
    this.x = x;
    this.y = y;
    this.vx = o.vx || 0;
    this.vy = o.vy || 0;
    this.size = o.size || 2;
    this.color = o.color || PURPLE_BRIGHT;
    this.age = 0;
    this.life = o.life || 600;
    this.drag = o.drag === undefined ? 0.94 : o.drag;
  }
  Particle.prototype.step = function (dt) {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.age += dt * 1000;
    return this.age < this.life;
  };
  Particle.prototype.draw = function (ctx) {
    var t = this.age / this.life;
    var a = Math.max(0, 1 - t);
    var s = Math.max(0.1, this.size * (1 - t * 0.7));
    ctx.beginPath();
    ctx.fillStyle = rgba(this.color, a);
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
    ctx.fill();
  };

  var particles = [];
  var MAX_PARTICLES = reduceMotion ? 0 : 50;

  function addParticle(p) {
    if (MAX_PARTICLES === 0) return;
    particles.push(p);
    if (particles.length > MAX_PARTICLES)
      particles.splice(0, particles.length - MAX_PARTICLES);
  }

  // ---- explosion on click ----
  window.addEventListener("pointerdown", function (e) {
    var x = e.clientX,
      y = e.clientY;

    addParticle(
      new Particle(x, y, { size: 1, color: PURPLE_BRIGHT, life: 180, drag: 1 }),
    );
    addParticle(
      new Particle(x, y, {
        size: 20,
        color: PURPLE_BRIGHT,
        life: 260,
        drag: 1,
      }),
    );

    var count = reduceMotion ? 0 : 60;
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + rand(-0.15, 0.15);
      var spd = rand(50, 260);
      var color =
        Math.random() < 0.55
          ? PURPLE_BRIGHT
          : Math.random() < 0.5
            ? WHITE
            : PURPLE_DEEP;
      addParticle(
        new Particle(x, y, {
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: rand(0.7, 1.9),
          color: color,
          life: rand(500, 950),
          drag: rand(0.9, 0.96),
        }),
      );
    }
  });

  // ---- render loop ----
  var lastT = performance.now();
  function loop(now) {
    var dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    fxCtx.clearRect(0, 0, W, H);
    fxCtx.globalCompositeOperation = "lighter";

    particles = particles.filter(function (p) {
      return p.step(dt);
    });
    particles.forEach(function (p) {
      p.draw(fxCtx);
    });

    fxCtx.globalCompositeOperation = "source-over";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
