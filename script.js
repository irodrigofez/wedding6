document.addEventListener('DOMContentLoaded', function() {
    // Fecha del evento: 28 de Febrero de 2026
    const weddingDate = new Date("Feb 28, 2026 00:00:00").getTime();

    // Actualizar el contador cada segundo
    const countdownFunction = setInterval(function() {

        // Obtener la fecha y hora actual
        const now = new Date().getTime();

        // Calcular la distancia entre ahora y la fecha de la boda
        const distance = weddingDate - now;

        // Cálculos de tiempo para días, horas, minutos y segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Mostrar los resultados en los elementos correspondientes
        document.getElementById("days").innerHTML = String(days).padStart(2, '0');
        document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

        // Si la cuenta regresiva termina, mostrar un mensaje
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "¡Ya nos casamos! Gracias por acompañarnos.";
            document.getElementById("countdown").style.fontSize = "1.2em";
            document.getElementById("countdown").style.color = "var(--primary-blue)";
        }
    }, 1000); // Actualiza cada 1 segundo

    // Ejemplo de funcionalidad para los botones de confirmación (puedes expandir esto)
    const confirmButtons = document.querySelectorAll('.confirm-button');
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            const response = this.textContent;
            alert(`¡Gracias por confirmar! Tu respuesta es: "${response}".`);
            // Aquí podrías integrar un envío a un servidor o un formulario real
        });
    });
});