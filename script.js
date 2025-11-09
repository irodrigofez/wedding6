document.addEventListener('DOMContentLoaded', function() {
  // --------- Cuenta regresiva ----------
  const weddingDate = new Date("Feb 28, 2026 00:00:00").getTime();
  const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
      clearInterval(countdownFunction);
      const cd = document.getElementById("countdown");
      cd.innerHTML = "¡Ya nos casamos! Gracias por acompañarnos.";
      cd.style.fontSize = "1.2em";
      cd.style.color = "var(--primary-blue)";
    }
  }, 1000);

  // --------- Botones de confirmación ----------
  document.querySelectorAll('.confirm-button').forEach(btn => {
    btn.addEventListener('click', function() {
      const response = this.textContent;
      alert(`¡Gracias por confirmar! Tu respuesta es: "${response}".`);
      // Aquí puedes integrar envío a servidor o Google Forms
    });
  });

  // --------- Carrusel ----------
  const track = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0;
  let autoTimer = null;
  const intervalMs = 3500;

  // Crear dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    b.addEventListener('click', () => goTo(i, true));
    dotsContainer.appendChild(b);
  });

  const dots = Array.from(dotsContainer.children);

  function updateUI() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function next() {
    index = (index + 1) % slides.length;
    updateUI();
  }
  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    updateUI();
  }
  function goTo(i, pause) {
    index = i % slides.length;
    updateUI();
    if (pause) restartAuto();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, intervalMs);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // Interacción táctil (swipe)
  let startX = 0;
  let deltaX = 0;
  const threshold = 50;

  track.addEventListener('touchstart', (e) => {
    stopAuto();
    startX = e.touches[0].clientX;
    deltaX = 0;
  }, {passive: true});

  track.addEventListener('touchmove', (e) => {
    deltaX = e.touches[0].clientX - startX;
  }, {passive: true});

  track.addEventListener('touchend', () => {
    if (deltaX < -threshold) next();
    else if (deltaX > threshold) prev();
    startAuto();
  });

  // Pausar en hover (desktop)
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Iniciar
  updateUI();
  startAuto();
});
