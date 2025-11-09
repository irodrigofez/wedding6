document.addEventListener('DOMContentLoaded', function() {

    /* COUNTDOWN */
    const weddingDate = new Date("Feb 28, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff < 0) return;

        document.getElementById("days").textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        document.getElementById("hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        document.getElementById("minutes").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        document.getElementById("seconds").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }, 1000);

    /* CONFIRM BUTTONS */
    document.querySelectorAll('.confirm-button').forEach(btn => {
        btn.onclick = () => alert(`Gracias por tu respuesta: ${btn.textContent}`);
    });

    /* CARRUSEL */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    let index = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goTo(i);
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.children;

    function goTo(i) {
        index = i;
        track.style.transform = `translateX(-${index * 100}%)`;
        Array.from(dots).forEach((d, n) => d.classList.toggle('active', n === index));
    }

    setInterval(() => goTo((index + 1) % slides.length), 4000);

});
