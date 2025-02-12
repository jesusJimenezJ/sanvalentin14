document.addEventListener("DOMContentLoaded", function () {
    animarCorazones();
    inicializarMapa();
});

// Función para animar corazones solo en Home
function animarCorazones() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const heartContainer = homeSection.querySelector('.heart-container');
    if (!heartContainer) return;

    heartContainer.innerHTML = ""; // Limpiar corazones previos

    function heartEquation(t) {
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return { x, y };
    }

    const numCorazones = 39;
    let delay = 0;

    for (let i = 0; i < numCorazones; i++) {
        let t = (i / numCorazones) * (2 * Math.PI);
        let pos = heartEquation(t);

        let heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";
        heart.style.left = `${50 + pos.x * 3}%`;
        heart.style.top = `${50 - pos.y * 3}%`;
        heart.style.animationDelay = `${delay * 0.3}s`;

        heartContainer.appendChild(heart);
        delay++;
    }
}

// Detectar si estamos en la sección Home
document.addEventListener("scroll", function () {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;

    const heartContainer = homeSection.querySelector(".heart-container");
    if (!heartContainer) return;

    const homeRect = homeSection.getBoundingClientRect();
    
    if (homeRect.top >= 0 && homeRect.bottom <= window.innerHeight) {
        animarCorazones(); // Activa corazones cuando estamos en Home
    }
});

// Interacciones con botones
function cambiarGif(estado) {
    const gif = document.getElementById("gif-gato");
    if (!gif) return;

    if (estado === "triste") {
        gif.src = "https://media1.tenor.com/m/0D13tdNYLBIAAAAd/puss-in-boots-cat.gif";
    } else {
        gif.src = "https://img.wattpad.com/b0f1840a60c01145cd5cc44896689a33ef0c9552/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f49583076625645334a564b4478413d3d2d313337373632373536372e31373833613665313030356563623135343930383134393039312e676966";
    }
}

// Función para responder a la pregunta y mostrar la alerta personalizada
function responder(opcion) {
    const alertMessage = document.getElementById('alert-message');
    const customAlert = document.getElementById('custom-alert');

    if (opcion === 'si') {
        cambiarGif("feliz");
        alertMessage.textContent = "¡Lo sabía! 💖 Será un San Valentín increíble juntos. 💑";
    } else {
        cambiarGif("triste");
        alertMessage.textContent = "Oh no... 😢 ¿Estás segura?, piénsalo bien 💔";
    }

    // Mostrar el alert
    customAlert.style.display = 'block';
}

// Función para cerrar el alert
function cerrarAlerta() {
    const customAlert = document.getElementById('custom-alert');
    customAlert.style.display = 'none'; // Oculta el alert
}

// Función para desplazarse al principio de la página
function irAlHome() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Esperar un poco para asegurarnos de que se vea el home antes de activar corazones
    setTimeout(animarCorazones, 500);
}


function irAlHome() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Esperar un poco para asegurarnos de que se vea el home antes de activar corazones
    setTimeout(animarCorazones, 500);
}


// Variables globales
let map;
let rutas = [];
let indexRuta = 0;
let ciudades = [];
let marcadores = [];

// Función para inicializar el mapa
function inicializarMapa() {
    map = L.map('mapa-ruta').setView([-2, -70], 4); // Vista inicial

    // Capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Datos de ciudades con coordenadas, nombres e imágenes
    ciudades = [
        { nombre: "Lima", lat: -12.0464, lon: -77.0428, img: "https://i.ytimg.com/vi/b2SZ7Kbx4tk/maxresdefault.jpg", desc: "Nuestro inicio y punto de retorno a casa." },
        { nombre: "Medellín", lat: 6.2442, lon: -75.5812, img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/e8/2e/43/caption.jpg?w=500&h=400&s=1", desc: "Nuestra primera parada en Colombia." },
        { nombre: "Santa Marta", lat: 11.2408, lon: -74.1990, img: "https://i.ytimg.com/vi/KFJhQBwMaeQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&amp;rs=AOn4CLAgo5bAurFfg9QfFBqvVjYA4j5N9w", desc: "Playas paradisíacas y naturaleza." },
        { nombre: "Tayrona", lat: 11.3000, lon: -74.1000, img: "https://laperlaapp.s3.us-east-2.amazonaws.com/gallery/3959/conversions/y8RwY0TanHGdO5H2WoA8suRQpfIk4drlT3a8q8WU-thumb.webp", desc: "Parque Nacional con vistas espectaculares." },
        { nombre: "Barranquilla", lat: 10.9685, lon: -74.7813, img: "https://munditursas.com/wp-content/uploads/2024/09/Post-facebook-fiesta-de-carnaval-creativo-moderno-morado.png", desc: "Conocida por su carnaval colorido." },
        { nombre: "Cartagena", lat: 10.3910, lon: -75.4794, img: "https://i.ytimg.com/vi/yHxARV2z_tQ/maxresdefault.jpg", desc: "Nadar con delfines y playas." },
        { nombre: "Barú", lat: 10.1596, lon: -75.6465, img: "https://www.semana.com/resizer/v2/FSACYQHJCRA2HFF4V6KOGHF4S4.jpg?auth=a007fc58b344728d26e16088366d49a85aa922e364c6f9eac8a9dc8e1b214ed2&smart=true&quality=75&width=1280&fitfill=false", desc: "Playas de arena blanca y aguas cristalinas." },
        { nombre: "San Andrés", lat: 12.5833, lon: -81.7006, img: "https://live2trip.com.br/wp-content/uploads/2021/03/el-acuario-san-andres.jpg", desc: "Mar de siete colores y hermosas playas." },
        { nombre: "Bogotá", lat: 4.7110, lon: -74.0721, img: "https://www.semana.com/resizer/v2/IB33QRSMNVDWNPZQI4RGBPZQ4U.jpg?auth=78f5e529168a8d622ce715bccd575bf8690e7c83d509466753e8a82063ef5500&smart=true&quality=75&width=1280&height=720", desc: "Capital y nuestro último destino en Colombia." },
        { nombre: "Lima", lat: -12.0464, lon: -77.0428, img: "https://i.ytimg.com/vi/b2SZ7Kbx4tk/maxresdefault.jpg", desc: "Nuestro inicio y punto de retorno en casa." }
    ];

    // Agregar marcadores con iconos personalizados
    ciudades.forEach((ciudad) => {
        let iconoPersonalizado = L.icon({
            iconUrl: 'https://png.pngtree.com/png-clipart/20230601/original/pngtree-pin-map-location-icon-logo-symbol-design-transparent-background-free-png-image_9175707.png',
            iconSize: [40, 40],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        let marker = L.marker([ciudad.lat, ciudad.lon], { icon: iconoPersonalizado }).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center;">
                <b>${ciudad.nombre}</b><br>
                <img src="${ciudad.img}" alt="${ciudad.nombre}" style="width:100px; height:auto; border-radius: 8px;">
                <p>${ciudad.desc}</p>
            </div>
        `);
        marcadores.push(marker);
    });

    // Crear rutas y añadir eventos de clic
    rutas = [];
    for (let i = 0; i < ciudades.length - 1; i++) {
        let ruta = L.polyline([
            [ciudades[i].lat, ciudades[i].lon],
            [ciudades[i + 1].lat, ciudades[i + 1].lon]
        ], {
            color: 'black', weight: 3, opacity: 0.7
        });

        // Agregar evento para mostrar popup al hacer clic en la ruta
        ruta.on("click", function () {
            mostrarPopupRuta(i);
        });

        rutas.push(ruta);
    }

    // Mostrar solo la primera ruta al inicio
    indexRuta = 0;
    rutas[indexRuta].addTo(map);
    mostrarPopupRuta(indexRuta);
    
}

// Función para mostrar el popup con el botón de siguiente ruta
function mostrarPopupRuta(index) {
    let ciudadInicio = ciudades[index];
    let ciudadFin = ciudades[index + 1];

    let popup = L.popup()
        .setLatLng([ciudadInicio.lat, ciudadInicio.lon])
        .setContent(`
            <b>${ciudadInicio.nombre} → ${ciudadFin.nombre}</b><br>
            <button id="btnSiguienteRuta" onclick="mostrarSiguienteRuta()" disabled>⏳ Cargando...</button>
        `)
        .openOn(map);

    // Ajustar el mapa para que ambas ciudades estén centradas con el zoom adecuado
    const bounds = [
        [ciudadInicio.lat, ciudadInicio.lon],
        [ciudadFin.lat, ciudadFin.lon]
    ];

    // Verificar si estamos en la última ruta
    if (index === rutas.length - 1) {
        // Hacer que el mapa se centre en las ciudades pero desplazado lateralmente
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4.4 });
     }
    // Verificar si estamos en la penúltima ruta
    else if (index === rutas.length - 2) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 }); // Zoom más amplio para la penúltima ruta
    }
    // Verificar si estamos en la sexta ruta
    else if (index === 5) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 }); // Zoom especial para la sexta ruta
    }
    // Para las demás rutas, se mantiene el zoom estándar
    else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 }); // Zoom estándar para las demás rutas
    }

    // Habilitar el botón después de 300ms
    setTimeout(() => {
        document.getElementById("btnSiguienteRuta").innerHTML = "Siguiente Ruta ✈️🚗";
        document.getElementById("btnSiguienteRuta").disabled = false;
    }, 300);
}

// Función para mostrar la alerta personalizada con el avión y el mensaje
function mostrarAlertaAvion() {
    const alertDiv = document.getElementById("custom-alert-avion");
    const avion = document.getElementById("avion-img");

    // Mostrar la alerta
    alertDiv.style.display = "block";

    // Animación del avión
    avion.style.animation = "volar 3s linear infinite";
}

// Función para cerrar la alerta personalizada
function cerrarAlertaAvion() {
    const alertDiv = document.getElementById("custom-alert-avion");

    // Ocultar la alerta
    alertDiv.style.display = "none";
}

// Ejemplo de cómo integrar la alerta personalizada en tu código
function mostrarSiguienteRuta() {
    if (indexRuta < rutas.length - 1) {
        // Ocultar la ruta anterior
        map.removeLayer(rutas[indexRuta]);

        indexRuta++; // Avanzar al siguiente tramo de ruta

        // Mostrar la nueva ruta
        rutas[indexRuta].addTo(map);

        map.panTo(new L.LatLng(ciudades[indexRuta].lat, ciudades[indexRuta].lon)); // Centrar el mapa

        // Mostrar popup de la nueva ruta
        mostrarPopupRuta(indexRuta);
    } else {
        mostrarAlertaAvion(); // Mostrar la alerta con el avión volando
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const infoCiudades = {
        "Lima": { img: "https://i.ytimg.com/vi/b2SZ7Kbx4tk/maxresdefault.jpg", desc: "Nuestro inicio y punto de retorno a casa." },
        "Medellín": { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/e8/2e/43/caption.jpg?w=500&h=400&s=1", desc: "Nuestra primera parada en Colombia. Haremos una parada para tomar el siguiente vuelo." },
        "Santa Marta": { img: "https://i.ytimg.com/vi/KFJhQBwMaeQ/hq720.jpg", desc: "Playas paradisíacas y naturaleza. Como el Rodadero o Playa Blanca." },
        "Tayrona": { img: "https://laperlaapp.s3.us-east-2.amazonaws.com/gallery/3959/conversions/y8RwY0TanHGdO5H2WoA8suRQpfIk4drlT3a8q8WU-thumb.webp", desc: "Parque Nacional con vistas espectaculares. Como la piscinita y el cabo San Juan." },
        "Barranquilla": { img: "https://munditursas.com/wp-content/uploads/2024/09/Post-facebook-fiesta-de-carnaval-creativo-moderno-morado.png", desc: "Conocida por su carnaval colorido. Además del monumento a Shakira y el malecón." },
        "Cartagena": { img: "https://i.ytimg.com/vi/yHxARV2z_tQ/maxresdefault.jpg", desc: "Nadar con delfines y playas. Además de la cultura, tradiciones de la ciudad." },
        "Barú": { img: "https://www.semana.com/resizer/v2/FSACYQHJCRA2HFF4V6KOGHF4S4.jpg?auth=a007fc58b344728d26e16088366d49a85aa922e364c6f9eac8a9dc8e1b214ed2&smart=true&quality=75&width=1280&fitfill=false", desc: "Playas de arena blanca y aguas cristalinas. Con acceso a la bioluminiscencia." },
        "San Andrés": { img: "https://live2trip.com.br/wp-content/uploads/2021/03/el-acuario-san-andres.jpg", desc: "Mar de siete colores y hermosas playas. Con Johny Cay, el acuario y la piscinita." },
        "Bogotá": { img: "https://www.semana.com/resizer/v2/IB33QRSMNVDWNPZQI4RGBPZQ4U.jpg?auth=78f5e529168a8d622ce715bccd575bf8690e7c83d509466753e8a82063ef5500&smart=true&quality=75&width=1280&height=720", desc: "Capital y nuestro último destino en Colombia. Donde podremos pasear por la ciudad y degustar de la comida." }
    };

    const infoBox = document.getElementById("descripcion-ciudad");
    const btns = document.querySelectorAll(".ciudad-btn");

    btns.forEach(btn => {
        btn.addEventListener("click", function () {
            const ciudad = this.dataset.ciudad;
            document.getElementById("ciudad-nombre").innerText = ciudad;
            document.getElementById("ciudad-imagen").src = infoCiudades[ciudad].img;
            document.getElementById("ciudad-descripcion").innerText = infoCiudades[ciudad].desc;
            infoBox.classList.remove("d-none");
        });
    });

    // Ocultar info cuando se da clic fuera del cuadro
    document.addEventListener("click", function (event) {
        if (!infoBox.contains(event.target) && !event.target.classList.contains("ciudad-btn")) {
            infoBox.classList.add("d-none");
        }
    });

    // Evita que el cuadro se cierre al hacer clic dentro de él
    infoBox.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Cerrar cuadro con el botón de cerrar
    document.querySelector(".close-btn").addEventListener("click", function () {
        infoBox.classList.add("d-none");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let carouselImages = document.querySelector("#carouselImages");
    let videoCarousel = document.querySelector("#carouselVideos");

    // Inicializar carrusel de imágenes
    let bsCarouselImages = new bootstrap.Carousel(carouselImages, {
        interval: 3000, // Cambia cada 3 segundos
        ride: "carousel"
    });

    // Inicializar carrusel de videos
    let bsCarouselVideos = new bootstrap.Carousel(videoCarousel, {
        interval: false, // Desactivar el cambio automático al inicio
        ride: false
    });

    let iframes = videoCarousel.querySelectorAll("iframe");
    let youtubePlayers = {};

    // Pausar el carrusel cuando se hace clic en una imagen
    document.querySelectorAll("#carouselImages img").forEach(img => {
        img.addEventListener("click", function () {
            bsCarouselImages.pause();
        });
    });

    // Reanudar el carrusel si el usuario usa los botones de navegación en imágenes
    document.querySelectorAll("#carouselImages .carousel-control-prev, #carouselImages .carousel-control-next").forEach(button => {
        button.addEventListener("click", function () {
            bsCarouselImages.cycle(); // Reanuda el cambio automático
        });
    });

    // Función para detectar cuando un video se reproduce o termina
    function onYouTubeIframeAPIReady() {
        iframes.forEach(iframe => {
            let videoId = new URL(iframe.src).searchParams.get("v"); // Extrae el ID del video
            if (videoId) {
                let player = new YT.Player(iframe, {
                    events: {
                        "onStateChange": function (event) {
                            if (event.data === YT.PlayerState.PLAYING) {
                                bsCarouselVideos.pause(); // Pausar el carrusel al reproducir
                            } else if (event.data === YT.PlayerState.ENDED) {
                                bsCarouselVideos.cycle(); // Reanudar solo cuando termina el video
                            }
                        }
                    }
                });
                youtubePlayers[iframe.id] = player;
            }
        });
    }

    // Agregar el script de la API de YouTube si no está presente
    if (!window.YT) {
        let scriptTag = document.createElement("script");
        scriptTag.src = "https://www.youtube.com/iframe_api";
        scriptTag.onload = onYouTubeIframeAPIReady;
        document.body.appendChild(scriptTag);
    } else {
        onYouTubeIframeAPIReady();
    }

    // Reanudar el carrusel de videos si el usuario usa los botones de navegación
    document.querySelectorAll("#carouselVideos .carousel-control-prev, #carouselVideos .carousel-control-next").forEach(button => {
        button.addEventListener("click", function () {
            bsCarouselVideos.cycle(); // Reanuda el cambio automático
        });
    });

    // Detener los videos cuando se cambia de diapositiva
    videoCarousel.addEventListener("slide.bs.carousel", function () {
        iframes.forEach(iframe => {
            if (youtubePlayers[iframe.id]) {
                youtubePlayers[iframe.id].pauseVideo();
            }
        });
    });
});



const anecdotes = [
    "Cuando pasamos nuestro primer año nuevo juntos y estuvimos bailando toda la noche, mientras César terminaba echado en un sofa y Sandy y yo nos pusimos a limpiar.",
    "Cuando nos tocó dormir en una misma habitación, pero nos terminaron comiendo los zancudos. Yo trataba de ciudarte y a la vez contemplarte.",
    "Recibiendo felices Tarapoto, aunque con bochorno nuestro primer viaaje juntos solos, el viaje que nos uniría para siempre.",
    "Cuando nos animamos de un momento a otro a ir a Canta, después de buen rato encontramos un hospedaaje y pasamos momentos lindos y luego recibimos a Toto y Patty",
    "Cuando en el frío de la montaña casi te quedas sin aire y nos encontramos con una familia que te entrego un poco de hojas de coca y con todo tu esfuerzo llegaste hasta la zona de hielo",
    "Cuando salimos por primera vez con mis amigos y terminamos yendo a bailar y luego le hacías cambiar de música al dj.",
    "Cuando te acompañé a postular a un trabajo y terminamos yendo a la playa de la punta.",
    "Cuando nos atrevimos a subir a un puente de más de 4 mil msnm",
    "Cuando con mucho esfuerzo hicimos las compras e implementamos tu consultorio.",
    "Cuando perdimos el vuelo a Lima y terminamos volviendo en bus y tuvimos que hacer trasbordo en Chiclayo.",
    "Cuando fuimos a un resort en la laguna azul y tu mamá terminó divirtiéndose más que nosotros",
    "Cuando te sorprendí enviándote rancheras y terminaste emocionada",    
    "Cuando me acompañaste al concierto y terminamos comiendo comida asiática y probando cervezas artesanales",
    "Cuando fuimos junto a Oti al concierto de Morat",
    "Cuando te mordió la tortuga",
    "Cuando te quedaste dormida en la hamaca frente al mar",
    "Cuando nos agarró la lluvia durante todo el día y nos tomamos fotos así",
    "Cuando repetims como 10 veces la toma, para que salga el click perfecto",
    "Cuando te sorprendí con un hermoso regalo de cumpleaños",
    "Cuando fuimos por primera vez al estadio y terminamos bronceados"
];

const images = [
    "https://i.postimg.cc/gk7v6X24/20220101-043328.jpg",
    "https://i.postimg.cc/qqtPB67S/20220108-203457.jpg",
    "https://i.postimg.cc/fWpLcxY3/20220219-094624.jpg",
    "https://i.postimg.cc/NMP175xg/20230122-082736.jpg", 
    "https://i.postimg.cc/wMbSSwpX/IMG-8429.jpg",  
    "https://i.postimg.cc/K8hgDWRV/20221119-222927.jpg", 
    "https://i.postimg.cc/nVdF44Kq/20221026-100031.jpg", 
    "https://i.postimg.cc/Cx2ncyjH/20220417-111005.jpg", 
    "https://i.postimg.cc/GmhQs1Qc/20220409-210423.jpg", 
    "https://i.postimg.cc/Nfb8tzwZ/20220301-135736.jpg",
    "https://i.postimg.cc/kMsRRRhb/20220227-182049.jpg",
    "https://i.postimg.cc/fTKrtCxh/4c004f79-a049-4182-83ab-f10a97547064d.jpg",
    "https://i.postimg.cc/VN1PQvBY/Whats-App-Image-2025-02-11-at-5-57-01-PM-1.jpg",
    "https://i.postimg.cc/Qd8F88qq/03-D9-A4-DC-AC9-B-4460-9-EED-A05-A80565-EE0.jpg",
    "https://i.postimg.cc/13nLN6MR/Whats-App-Image-2025-02-11-at-5-43-55-PM.jpg",
    "https://i.postimg.cc/rFn92P1z/Whats-App-Image-2025-02-11-at-5-41-52-PMs.jpg",
    "https://i.postimg.cc/3JPtVqC7/Whats-App-Image-2025-02-11-at-5-37-22-PM.jpg",
    "https://i.postimg.cc/3JDBXBMq/Whats-App-Image-2025-02-11-at-5-38-11-PM.jpg",
    "https://i.postimg.cc/HkghjKJz/Whats-App-Image-2025-02-11-at-5-56-55-PM-1.jpg",
    "https://i.postimg.cc/nzWHJZh0/Whats-App-Image-2025-02-11-at-8-14-48-PM.jpg"
];

let currentPage = 0;
const totalPages = 20;  // Cambia este valor si deseas más o menos páginas
const contentDiv = document.getElementById("content");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageSound = document.getElementById("page-sound");
const leftPage = document.getElementById("page-left");
const rightPage = document.getElementById("page-right");

function showPage(page) {
    contentDiv.innerHTML = `
        <p class="parisienne-regular">${anecdotes[page]}</p>
        <br>
        <div class="img-cont-right">
            <img src="${images[page]}" alt="Imagen evocadora">
        </div>
    `;

    // Reproducir sonido al cambiar de página
    pageSound.playbackRate = 1.8;
    pageSound.play();

    // Activar animación de la página (girando)
    leftPage.classList.add('flip');
    setTimeout(() => {
        // Esperar 1 segundo (duración del sonido y animación)
        leftPage.classList.remove('flip');
        
        // Cambiar el contenido de la página
        rightPage.classList.remove('flip');
        rightPage.classList.add('flip');
        currentPage++;

        // Actualizar la visibilidad de los botones
        updateButtons();
    }, 1000);
}

// Función para actualizar la visibilidad de los botones
function updateButtons() {
    prevBtn.style.display = currentPage === 0 ? "none" : "inline-block";  // Ocultar "Página anterior" en la primera página
    nextBtn.style.display = currentPage === totalPages - 1 ? "none" : "inline-block";  // Ocultar "Siguiente página" en la última página
}

// Añadir un evento de "click" para el botón "Página anterior"
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
});

// Añadir un evento de "click" para el botón "Siguiente página"
nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        showPage(currentPage);
    }
});

// Mostrar la primera anécdota al cargar y actualizar los botones
showPage(currentPage);
updateButtons();  // Asegura que los botones estén correctamente actualizados al principio
