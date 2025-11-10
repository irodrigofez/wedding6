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



    /* ✅ CONFIRMACIÓN */
    
    const API_BASE = "https://wedding6-api.onrender.com";

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

    fetch(`${API_BASE}/invitado/${id}`)
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

    function confirmar(respuesta, data) {
        btnSi.disabled = true;
        btnNo.disabled = true;

        fetch(`${API_BASE}/confirmar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
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
