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


    /* CARRUSEL */
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = [...track.children];
        const dotsContainer = document.querySelector('.carousel-dots');
        let index = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            if (i === 0) dot.classList.add('active');
            dot.onclick = () => goTo(i);
            dotsContainer.appendChild(dot);
        });

        const dots = [...dotsContainer.children];

        function goTo(i) {
            index = i;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, n) => d.classList.toggle('active', n === index));
        }

        setInterval(() => goTo((index + 1) % slides.length), 4000);
    }


    /* ✅ URLs Google Sheets */
    const API_READ = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiwXZZTeWLg7nF_DG5qlLo6KvVqnWX-mhnXgE1vOcHD2qRS7wZO_L23aq0fxqTyCsGUnRGBrK6sC6SoUkQ60nZdVNJur2O_lAvj0jqkWodqK3G2mQjDMpJzKdZn11mY9u60EnlbAP18MA-icqWk3wOzJ_TnRhYWiseZe9WVTlSJ2ADKfmuUw66QtDbZtNbBJLzosNR1qg65rTua_wxeFygvHANgp9dtOuoxiSwo_Ph1eq2hUpz6bp7lTCs3Pjdg1ektcnTc4rFGhttVYJqWZYy22zgVs-dKQir7l9JUTnwf88e-ipQ&lib=MIYF7j0mrSlnPSmO3Bb6emTPTuxB3ZxFA";
    const API_BASE = "https://script.google.com/macros/s/AKfycbwjhw_B6no9E2sQ2-IliFdEc4Fm-tOcHqQ71PSHxFjDVaZlE-c1gLvRwl32ebYxTgh4/exec";


    /* Obtener ID desde la URL */
    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    const id = getParam("id");
    const famLegend = document.getElementById("familia-legend");
    const namesLegend = document.getElementById("nombres-legend");
    const msg = document.getElementById("confirm-msg");
    const btnSi = document.getElementById("btn-si");
    const btnNo = document.getElementById("btn-no");
    const btns = document.getElementById("confirm-buttons");

    if (!id) {
        famLegend.textContent = "⚠️ Esta invitación necesita un código válido.";
        btns.style.display = "none";
        return;
    }


    /* ✅ Leer invitado */
    fetch(`${API_READ}?id=${id}`)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                famLegend.textContent = "❌ Invitación no encontrada.";
                btns.style.display = "none";
                return;
            }

            famLegend.innerHTML = `<strong>${data.familia}</strong> — Invitados: <strong>${data.personas}</strong>`;
            namesLegend.textContent = "Nombres: " + data.nombres.join(", ");

            if (data.respondio) {
                btnSi.disabled = true;
                btnNo.disabled = true;
                btns.style.opacity = 0.5;
                msg.textContent = `✅ Gracias por responder (${data.respuesta}).`;
            }

            btnSi.onclick = () => confirmar("SI", data);
            btnNo.onclick = () => confirmar("NO", data);

        });


    /* ✅ Guardar respuesta */
    function confirmar(respuesta, data) {
        btnSi.disabled = true;
        btnNo.disabled = true;

        fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                familia: data.familia,
                personas: data.personas,
                nombres: data.nombres,
                respuesta: respuesta,
                asistentes: respuesta === "SI" ? data.personas : 0,
                nombres_confirmados: respuesta === "SI" ? data.nombres : []
            })
        })
        .then(() => {
            msg.textContent = "✅ ¡Gracias por responder!";
            btns.style.opacity = 0.5;
        })
        .catch(() => {
            msg.textContent = "❌ Error al enviar la respuesta.";
            btnSi.disabled = false;
            btnNo.disabled = false;
        });
    }

});
