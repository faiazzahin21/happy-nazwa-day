import { useEffect, useRef } from "react";

const COLORS = [
  "#ff595e",
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#ff70a6",
  "#ffd166",
  "#06d6a0",
];

/** Course-style synthesized firework blast (Web Audio). */
function createBlastPlayer() {
  let audioCtx = null;

  const initAudio = () => {
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") {
        void audioCtx.resume();
      }
      return audioCtx;
    } catch {
      return null;
    }
  };

  const playBlastSound = () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Deep bass boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.6);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.5);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // 2. High-frequency crackle / fizz
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1500, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(600, now + 0.4);
      noiseFilter.Q.setValueAtTime(2.0, now);

      noiseGain.gain.setValueAtTime(0.22, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // 3. Metallic rumble tail
      const tailOsc = ctx.createOscillator();
      const tailFilter = ctx.createBiquadFilter();
      const tailGain = ctx.createGain();

      tailOsc.type = "sawtooth";
      tailOsc.frequency.setValueAtTime(60, now);
      tailOsc.frequency.exponentialRampToValueAtTime(25, now + 0.8);

      tailFilter.type = "lowpass";
      tailFilter.frequency.setValueAtTime(120, now);
      tailFilter.frequency.exponentialRampToValueAtTime(30, now + 0.8);

      tailGain.gain.setValueAtTime(0.28, now);
      tailGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      tailGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      tailOsc.connect(tailFilter);
      tailFilter.connect(tailGain);
      tailGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
      noise.start(now);
      noise.stop(now + 0.5);
      tailOsc.start(now);
      tailOsc.stop(now + 0.9);
    } catch {
      /* ignore audio failures */
    }
  };

  const dispose = () => {
    if (!audioCtx) return;
    try {
      void audioCtx.close();
    } catch {
      /* ignore */
    }
    audioCtx = null;
  };

  return { initAudio, playBlastSound, dispose };
}

/**
 * Dense, highly visible fireworks + course blast SFX.
 */
export default function FireworkSky({ active = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const audio = createBlastPlayer();
    audio.initAudio();

    let W = 0;
    let H = 0;
    let particles = [];
    let rockets = [];
    let raf = 0;
    let launchTimer = 0;
    let running = true;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 2.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 3.4 + 1.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.055;
        this.vx *= 0.985;
        this.alpha -= 0.01;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Rocket {
      constructor(x, targetY) {
        this.x = x;
        this.y = H + 4;
        this.targetY = targetY;
        this.vy = -(Math.random() * 5 + 9);
        this.color = COLORS[(Math.random() * COLORS.length) | 0];
      }

      update() {
        this.y += this.vy;
        return this.y <= this.targetY;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const explode = (x, y) => {
      const color = COLORS[(Math.random() * COLORS.length) | 0];
      const count = 95 + ((Math.random() * 55) | 0);
      for (let i = 0; i < count; i += 1) {
        particles.push(new Particle(x, y, color));
      }
      // Second color bloom — denser sky
      const color2 = COLORS[(Math.random() * COLORS.length) | 0];
      for (let i = 0; i < 48; i += 1) {
        particles.push(new Particle(x, y, color2));
      }
      audio.playBlastSound();
    };

    const launchOne = () => {
      rockets.push(
        new Rocket(
          Math.random() * W * 0.84 + W * 0.08,
          Math.random() * H * 0.42 + H * 0.06,
        ),
      );
    };

    const launchVolley = (n = 3) => {
      for (let i = 0; i < n; i += 1) launchOne();
    };

    // Opening barrage
    launchVolley(5);
    launchTimer = window.setInterval(() => launchVolley(3), 520);

    const loop = () => {
      if (!running) return;

      // Soft night veil + trail (course-style) so bursts read clearly on the page
      ctx.fillStyle = "rgba(18, 4, 28, 0.22)";
      ctx.fillRect(0, 0, W, H);

      rockets = rockets.filter((r) => {
        r.draw();
        if (r.update()) {
          explode(r.x, r.y);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return p.alpha > 0.02;
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearInterval(launchTimer);
      window.removeEventListener("resize", resize);
      particles = [];
      rockets = [];
      audio.dispose();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="firework-sky" aria-hidden="true" />;
}
