document.addEventListener("DOMContentLoaded", () => {

    const botonesNav = document.querySelectorAll(".btnNav");
    const secciones = document.querySelectorAll(".tab-content");

    botonesNav.forEach((boton) => {
        boton.addEventListener("click", () => {
            const tabDestino = boton.getAttribute("data-tab");

            botonesNav.forEach((btn) => btn.classList.remove("active"));
            secciones.forEach((seccion) => seccion.classList.remove("active"));

            boton.classList.add("active");

            const seccionActiva = document.getElementById(tabDestino);
            if (seccionActiva) {
                seccionActiva.classList.add("active");
            }
        });
    });

    const canciones = [
        {
            titulo: "Niña Primavera",
            artista: "Nasa Histories",
            portada: "Imagenes/niña-primavera.jpeg",
            audio: "Musica/nina-primavera.mp3",
            dedicatoria: "Un par de días antes de lo nuestro, me dijiste que escuchara este álbum completo porque había una canción que te hacía pensar en mí. Esta fue la canción que marcó el inicio de todo, el momento exacto en el que nuestras historias comenzaron a entrelazarse."
        },
        {
            titulo: "Seguro te Pierdo",
            artista: "Sergi & KID FLEX",
            portada: "Imagenes/seguro-te-pierdo.jpeg",
            audio: "Musica/seguro-te-pierdo.mp3",
            dedicatoria: "Antes de dar el paso, esta canción resonaba mucho en mí. Guardaba exactamente el temor y la duda de dar a conocer lo que sentía por ti, con el miedo constante de arriesgar nuestra amistad... pero al final, valió totalmente la pena intentarlo."
        },
        {
            titulo: "What is Love",
            artista: "TWICE",
            portada: "Imagenes/what-is-love.jpeg",
            audio: "Musica/what-is-love.mp3",
            dedicatoria: "Inspirada en tu mundo y en las mil maneras en las que siempre intentas introducirme al K-pop. Desde que me la mostraste se convirtió en la canción que inevitablemente me recuerda a ti y a lo mucho que disfruto verte hablar apasionadamente de lo que te gusta."
        },
        {
            titulo: "Loco (Tu Forma de Ser)",
            artista: "Los Auténticos Decadentes",
            portada: "Imagenes/loco-tu-forma-de-ser.jpeg",
            audio: "Musica/loco-tu-forma-de-ser.mp3",
            dedicatoria: "La canción perfecta para resumir todo lo que siento por ti. Con cada detalle, con cada imperfección y con todo lo que te hace ser tú... simplemente estoy completamente loco por ti."
        }
    ];

    let indiceActual = 0;
    let estaReproduciendo = false;

    // Elementos del reproductor
    const audioPlayer = document.getElementById("mainAudioPlayer");
    const playerPortada = document.getElementById("playerPortada");
    const playerTitulo = document.getElementById("playerTitulo");
    const playerArtista = document.getElementById("playerArtista");
    const playerDedicatoria = document.getElementById("playerDedicatoria");
    const btnPlayPause = document.getElementById("btnPlayPause");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const progressBar = document.getElementById("progressBar");
    const currentTimeElem = document.getElementById("currentTime");
    const totalDurationElem = document.getElementById("totalDuration");

    function cargarCancion(indice) {
        const tema = canciones[indice];
        if (!tema) return;

        playerPortada.src = tema.portada;
        playerPortada.alt = tema.titulo;
        playerTitulo.textContent = tema.titulo;
        playerArtista.textContent = tema.artista;
        playerDedicatoria.textContent = tema.dedicatoria;
        audioPlayer.src = tema.audio;

        // Reset de tiempos y barra
        progressBar.value = 0;
        currentTimeElem.textContent = "0:00";
        totalDurationElem.textContent = "0:00";
    }

    function formatearTiempo(segundos) {
        if (isNaN(segundos)) return "0:00";
        const mins = Math.floor(segundos / 60);
        const secs = Math.floor(segundos % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function reproducirPausar() {
        if (estaReproduciendo) {
            audioPlayer.pause();
            btnPlayPause.textContent = "▶";
            estaReproduciendo = false;
        } else {
            audioPlayer.play();
            btnPlayPause.textContent = "⏸";
            estaReproduciendo = true;
        }
    }

    function cambiarCancion(siguiente = true) {
        if (siguiente) {
            indiceActual = (indiceActual + 1) % canciones.length;
        } else {
            indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
        }

        cargarCancion(indiceActual);

        if (estaReproduciendo) {
            audioPlayer.play();
        }
    }

    if (audioPlayer && btnPlayPause) {
        // Cargar canción inicial
        cargarCancion(indiceActual);

        btnPlayPause.addEventListener("click", reproducirPausar);
        btnNext.addEventListener("click", () => cambiarCancion(true));
        btnPrev.addEventListener("click", () => cambiarCancion(false));

        // Actualizar progreso
        audioPlayer.addEventListener("timeupdate", () => {
            if (audioPlayer.duration) {
                const porcentaje = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.value = porcentaje;
                currentTimeElem.textContent = formatearTiempo(audioPlayer.currentTime);
            }
        });

        audioPlayer.addEventListener("loadedmetadata", () => {
            totalDurationElem.textContent = formatearTiempo(audioPlayer.duration);
        });

        // Buscar en el audio mediante el slider
        progressBar.addEventListener("input", () => {
            if (audioPlayer.duration) {
                const nuevoTiempo = (progressBar.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = nuevoTiempo;
            }
        });

        // Al finalizar la canción, pasar a la siguiente automáticamente
        audioPlayer.addEventListener("ended", () => cambiarCancion(true));
    }

    // --- Indicadores de Desplazamiento en la Barra de Navegación ---
    const navUl = document.querySelector("nav ul");
    const fadeLeft = document.querySelector(".nav-fade.left");
    const fadeRight = document.querySelector(".nav-fade.right");

    function actualizarSombrasNav() {
        if (!navUl) return;
        const scrollLeft = navUl.scrollLeft;
        const maxScroll = navUl.scrollWidth - navUl.clientWidth;

        if (fadeLeft) {
            fadeLeft.classList.toggle("visible", scrollLeft > 5);
        }
        if (fadeRight) {
            fadeRight.classList.toggle("visible", scrollLeft < maxScroll - 5);
        }
    }

    if (navUl) {
        navUl.addEventListener("scroll", actualizarSombrasNav);
        window.addEventListener("resize", actualizarSombrasNav);
        actualizarSombrasNav();
    }

    // --- Formulario del Código Secreto en el Header ---
    const headerForm = document.getElementById("headerFormCodigo");
    const headerInput = document.getElementById("headerInputCodigo");
    const headerBox = document.getElementById("headerSecretBox");

    if (headerForm && headerInput && headerBox) {
        headerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const codigoIngresado = headerInput.value.trim();

            if (codigoIngresado === "0109" || codigoIngresado === "1234") {
                headerBox.classList.remove("header-anim-error");
                headerBox.classList.add("header-anim-success");

                setTimeout(() => {
                    alert("✨ ¡Código correcto! Has desbloqueado el último secreto ❤️");
                }, 400);
            } else {
                headerBox.classList.remove("header-anim-error");
                void headerBox.offsetWidth; // Forzar reflow para reiniciar la animación
                headerBox.classList.add("header-anim-error");
            }
        });
    }

    // --- Lluvia Dinámica de Frases en el Fondo ---
    const contenedorLluvia = document.getElementById("lluvia-fondo");

    if (contenedorLluvia) {
        const palabras = [
            "Laurent", "Andrea", "01/09", "Hermosa", 
            "Mi persona favorita", "Te amo", "USB", "Sonrisa"
        ];

        function crearElementoLluvia() {
            const span = document.createElement("span");
            span.classList.add("texto-caida");

            span.textContent = palabras[Math.floor(Math.random() * palabras.length)];
            span.style.left = Math.random() * 90 + "vw";
            span.style.fontSize = (Math.random() * 0.7 + 0.9).toFixed(2) + "rem";

            const duracion = (Math.random() * 7 + 7).toFixed(2);
            span.style.animationDuration = duracion + "s";

            const giros = ["girado-izq", "girado-der", "sin-giro"];
            span.classList.add(giros[Math.floor(Math.random() * giros.length)]);

            const animaciones = ["anim-izq", "anim-der"];
            span.classList.add(animaciones[Math.floor(Math.random() * animaciones.length)]);

            contenedorLluvia.appendChild(span);

            setTimeout(() => {
                span.remove();
            }, parseFloat(duracion) * 1000);
        }

        setInterval(crearElementoLluvia, 800);
    }
});