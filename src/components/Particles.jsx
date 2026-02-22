import { useEffect, useRef } from "react";

export default function Particles() {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {

      dpr = window.devicePixelRatio || 1;

      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;

      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* ======================
       STARS
    ======================= */

    const stars = [];

    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.3),
        size: Math.random() * 1.5,
        alpha: Math.random() * 0.3,
        blink: Math.random() * Math.PI
      });
    }

    /* ======================
       CLOUDS
    ======================= */

    const clouds = [];

    for (let i = 0; i < 7; i++) {
      clouds.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.35),
        radius: 180 + Math.random() * 200,
        speed: 0.1 + Math.random() * 0.2,
        alpha: 0.03 + Math.random() * 0.05
      });
    }

    /* ======================
       RAIN
    ======================= */

    const rain = [];

    for (let i = 0; i < 170; i++) {
      rain.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: 12 + Math.random() * 18,
        speed: 3 + Math.random() * 4,
        alpha: 0.1 + Math.random() * 0.2
      });
    }

    /* ======================
       LIGHTNING
    ======================= */

    const bolts = [];
    let flashAlpha = 0;
    let rumbleGlow = 0;

    function createBolt() {

      const startX = Math.random() * w;
      const startY = Math.random() * (h * 0.25);

      const segments = [];
      let x = startX;
      let y = startY;

      for (let i = 0; i < 8; i++) {
        x += (Math.random() - 0.5) * 80;
        y += 35 + Math.random() * 20;
        segments.push({ x, y });
      }

      return {
        segments,
        life: 0,
        maxLife: 18
      };
    }

    let t = 0;

    function animate() {

      ctx.clearRect(0, 0, w, h);
      t += 0.01;

      /* SKY FLASH */

      if (flashAlpha > 0) {
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
        ctx.fillRect(0, 0, w, h);
        flashAlpha -= 0.02;
      }

      /* DISTANT RUMBLE GLOW */

      if (rumbleGlow > 0) {

        const glowGradient =
          ctx.createRadialGradient(
            w / 2,
            h * 0.2,
            0,
            w / 2,
            h * 0.2,
            w
          );

        glowGradient.addColorStop(
          0,
          `rgba(120,170,255,${rumbleGlow})`
        );

        glowGradient.addColorStop(1, "transparent");

        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, w, h * 0.5);

        rumbleGlow -= 0.01;
      }

      /* STARS SHIMMER */

      stars.forEach(s => {

        s.blink += 0.04;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

        ctx.fillStyle =
          `rgba(200,220,255,${
            s.alpha * (0.5 + Math.sin(s.blink))
          })`;

        ctx.fill();
      });

      /* CLOUD DRIFT */

      clouds.forEach(c => {

        c.x += c.speed;

        if (c.x > w + 200) c.x = -200;

        const gradient =
          ctx.createRadialGradient(
            c.x, c.y, 0,
            c.x, c.y, c.radius
          );

        gradient.addColorStop(
          0,
          `rgba(180,220,255,${c.alpha})`
        );

        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      /* RANDOM LIGHTNING */

      if (Math.random() < 0.0025 && bolts.length < 2) {
        bolts.push(createBolt());
        flashAlpha = 0.12;
        rumbleGlow = 0.25;
      }

      bolts.forEach((bolt, i) => {

        const alpha =
          1 - bolt.life / bolt.maxLife;

        ctx.lineWidth = 1.2; // thinner lightning

        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(180,220,255,1)";

        ctx.strokeStyle =
          `rgba(220,240,255,${alpha})`;

        ctx.beginPath();
        ctx.moveTo(
          bolt.segments[0].x,
          bolt.segments[0].y
        );

        bolt.segments.forEach(p =>
          ctx.lineTo(p.x, p.y)
        );

        ctx.stroke();

        /* Branch */

        if (Math.random() < 0.4) {

          const branch =
            bolt.segments[
              Math.floor(
                Math.random() *
                bolt.segments.length
              )
            ];

          ctx.beginPath();
          ctx.moveTo(branch.x, branch.y);
          ctx.lineTo(
            branch.x +
              (Math.random() - 0.5) * 90,
            branch.y + 50
          );
          ctx.stroke();
        }

        bolt.life++;
        if (bolt.life > bolt.maxLife)
          bolts.splice(i, 1);
      });

      /* WIND SWAY RAIN */

      const wind =
        Math.sin(t * 0.6) * 0.8;

      rain.forEach(r => {

        r.y += r.speed;
        r.x += wind;

        if (r.y > h) {
          r.y = -20;
          r.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(
          r.x + wind * 4,
          r.y + r.length
        );

        ctx.strokeStyle =
          `rgba(180,220,255,${r.alpha})`;

        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    }

    animate();

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
    />
  );
}