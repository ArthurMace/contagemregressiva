/* ========= DATA AUTOMÁTICA (PRÓXIMO 23/12) ========= */
function getNextDec23() {
  const now = new Date();
  let year = now.getFullYear();
  const target = new Date(year, 11, 23, 0, 0, 0);
  if (now > target) year++;
  return new Date(year, 11, 23, 0, 0, 0);
}

const targetDate = getNextDec23();

/* ========= ELEMENTOS ========= */
const countdown = document.getElementById("countdown");
const celebrateText = document.getElementById("celebrateText");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

/* ========= CONTAGEM ========= */
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdown.style.display = "none";
    celebrateText.classList.remove("hidden");
    startFireworks();
    clearInterval(timer);
    return;
  }

  daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((diff / (1000 * 60)) % 60);
  secondsEl.textContent = Math.floor((diff / 1000) % 60);
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* ========= SOM ========= */
const fireSound = document.getElementById("fireSound");
const soundToggle = document.getElementById("soundToggle");
let soundEnabled = true;

soundToggle.onclick = () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊 Som" : "🔇 Mudo";
};

/* ========= FOGOS ========= */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor() {
    this.x = rand(0, canvas.width);
    this.y = rand(0, canvas.height / 2);
    this.particles = Array.from({ length: 80 }, () => ({
      x: this.x,
      y: this.y,
      angle: rand(0, Math.PI * 2),
      speed: rand(2, 6),
      life: 1
    }));

    if (soundEnabled) fireSound.cloneNode().play();
  }

  update() {
    this.particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life -= 0.015;
    });
  }

  draw() {
    this.particles.forEach(p => {
      ctx.fillStyle = `rgba(96,165,250,${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

let fireworks = [];

function startFireworks() {
  setInterval(() => fireworks.push(new Firework()), 700);
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if (fw.particles[0].life <= 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
