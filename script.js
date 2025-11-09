document.addEventListener('DOMContentLoaded', function() {

    /* === CONTADOR DE LA BODA === */
    const weddingDate = new Date("Feb 28, 2026 00:00:00").getTime();

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Actualizar en pantalla
        document.getElementById("days").innerHTML = String(days).padStart(2, '0');
        document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownFunction);
            const countdown = document.getElementById("countdown");
            countdown.innerHTML = "¡Ya nos casamos! ❤️";
            countdown.style.fontSize = "1.3em";
            countdown.style.color = "var(--primary-blue)";
        }
    }, 1000);



    /* === CARRUSEL AUTOMÁTICO === */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;
    let autoSlideInterval;

    // Crear los puntos dinámicamente
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Función para mover el carrusel
    function moveToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots[currentSlide].classList.remove('active');
        dots[index].classList.add('active');
        currentSlide = index;
        resetAutoSlide();
    }

    // Función de auto avance
    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        moveToSlide(next);
    }

    // Reinicia el autoavance al interactuar manualmente
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    // Iniciar carrusel automático
    autoSlideInterval = setInterval(nextSlide, 4000);



    /* === BOTONES DE CONFIRMACIÓN === */
    const confirmButtons = document.querySelectorAll('.confirm-button');
    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.textContent;
            alert(`Gracias por tu respuesta: "${answer}" ❤️`);
        });
    });

});
