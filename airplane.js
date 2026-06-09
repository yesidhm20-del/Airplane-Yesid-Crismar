// js/app.js

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SELECTORES DEL DOM (Cazamos tu HTML)
    // ==========================================
    const seccionRegistro = document.querySelector('.registro');
    const formatoRegistro = document.querySelector('.formatoR');
    const nombreInput = document.querySelector('.nombre-completo');
    const correoInput = document.querySelector('.correo');
    const paisInput = document.querySelector('.pais-residencia');
    
    const selectPais = document.querySelector('.input-busqueda');
    const btnBuscar = document.querySelector('.btn-buscar');
    const bloqueCarga = document.querySelector('.carga');
    const mainContenido = document.querySelector('main');

    // Bloques de información de resultados
    const articuloPais = document.querySelector('.pais');
    const articuloClima = document.querySelector('.clima');
    const selectMonedaOrigen = document.querySelector('.moneda');
    const inputMontoOrigen = document.querySelector('.monto-origen');
    const textoMonedaDestino = document.querySelector('.moneda-destino');
    const valorConvertido = document.querySelector('.valor-convertido');
    const gridAtracciones = document.querySelector('.grid-atracciones');
    const btnFavoritoPais = document.querySelector('.btn-favorito-pais');
    const tablaHistorial = document.querySelector('.tabla-historial');
    const btnLimpiarHistorial = document.querySelector('.limpiar');

    // Listas de Favoritos
    const listasFavoritos = document.querySelectorAll('.lista-paises');
    const listaPaisesFav = listasFavoritos[0];
    const listaAtraccionesFav = listasFavoritos[1];

    let paisActualGlobal = null;

    // ==========================================
    // 2. FUNCIONES DE LOCALSTORAGE (El cerebro)
    // ==========================================
    const obtenerDeStorage = (clave) => JSON.parse(localStorage.getItem(clave)) || null;
    const guardarEnStorage = (clave, datos) => localStorage.setItem(clave, JSON.stringify(datos));

    // ==========================================
    // 3. MÓDULO 1: REGISTRO Y BIENVENIDA
    // ==========================================
    const verificarUsuario = () => {
        const usuario = obtenerDeStorage('viajero_usuario');
        const saludoExistente = document.querySelector('.saludo-bienvenida');
        if (saludoExistente) saludoExistente.remove();

        if (!usuario) {
            seccionRegistro.style.display = 'block';
        } else {
            seccionRegistro.style.display = 'none';
            
            // Crear saludo dinámico masculino
            const saludo = document.createElement('h1');
            saludo.classList.add('saludo-bienvenida');
            saludo.style.color = '#ad7d52';
            saludo.style.margin = '20px 0';
            saludo.textContent = `Bienvenido nuevamente, ${usuario.nombre}`;
            mainContenido.insertBefore(saludo, mainContenido.firstChild);
        }
    };

    if (formatoRegistro) {
        formatoRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = {
                nombre: nombreInput.value.trim(),
                correo: correoInput.value.trim(),
                pais: paisInput.value.trim()
            };
            guardarEnStorage('viajero_usuario', usuario);
            verificarUsuario();
        });
    }

    // ==========================================
    // 4. MÓDULO 9: HISTORIAL DE CONSULTAS
    // ==========================================
    const agregarAlHistorial = (nombrePais) => {
        const historial = obtenerDeStorage('viajero_historial') || [];
        const ahora = new Date();
        const nuevaConsulta = {
            fecha: ahora.toLocaleDateString(),
            hora: ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pais: nombrePais
        };
        historial.unshift(nuevaConsulta);
        guardarEnStorage('viajero_historial', historial);
        pintarHistorial();
    };

    const pintarHistorial = () => {
        if (!tablaHistorial) return;
        const historial = obtenerDeStorage('viajero_historial') || [];
        tablaHistorial.innerHTML = '';
        
        historial.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.fecha}</td>
                <td>${item.hora}</td>
                <td><strong>${item.pais}</strong></td>
            `;
            tablaHistorial.appendChild(tr);
        });
    };

    if (btnLimpiarHistorial) {
        btnLimpiarHistorial.addEventListener('click', () => {
            localStorage.removeItem('viajero_historial');
            pintarHistorial();
        });
    }

    // ==========================================
    // 5. MÓDULOS 3, 4, 5 Y 6: RENDERIZADO DE DATOS (Las APIs simuladas)
    // ==========================================
    const baseDatosPaises = {
        "Colombia": { nombre: "Colombia", bandera: "🇨🇴", capital: "Bogotá", region: "Americas", subregion: "sur America", moneda: "COP", idioma: "Español", poblacion: "50.8 millones", clima: "24°C - Lluvioso", viento: "12 km/h", humedad: "78%", atracciones: ["Santuario de Las Lajas", "Parque Tayrona", "Catedral de Sal", "Caño Cristales", "Eje Cafetero"] },
        "Brazil": { nombre: "Brasil", bandera: "🇧🇷", capital: "Brasilia", region: "Americas", subregion: "sur America", moneda: "BRL", idioma: "Portugués", poblacion: "212.6 millones", clima: "29°C - Soleado", viento: "15 km/h", humedad: "60%", atracciones: ["Cristo Redentor", "Pan de Azúcar", "Cataratas del Iguazú", "Amazonas", "Pelourinho"] },
        "Turquia": { nombre: "Turquía", bandera: "🇹🇷", capital: "Ankara", region: "Asia / Europe", subregion: "Western Asia", moneda: "TRY", idioma: "Turco", poblacion: "84.3 millones", clima: "18°C - Despejado", viento: "8 km/h", humedad: "50%", atracciones: ["Santa Sofía", "Capadocia", "Palacio de Topkapi", "Pamukkale", "Éfeso"] },
        "Japan": { nombre: "Japón", bandera: "🇯🇵", capital: "Tokio", region: "Asia", subregion: " Asia", moneda: "JPY", idioma: "Japonés", poblacion: "125.8 millones", clima: "15°C - Nublado", viento: "10 km/h", humedad: "45%", atracciones: ["Monte Fuji", "Templo Senso-ji", "Santuario Fushimi Inari", "Parque de Nara", "Kinkaku-ji"] },
        "France": { nombre: "Francia", bandera: "🇫🇷", capital: "París", region: "Europe", subregion: " Europa", moneda: "EUR", idioma: "Francés", poblacion: "67.3 millones", clima: "16°C - Templado", viento: "14 km/h", humedad: "65%", atracciones: ["Torre Eiffel", "Museo del Louvre", "Palacio de Versalles", "Arco del Triunfo", "Mont Saint-Michel"] }
    };

    const cargarDatosDestino = (paisKey) => {
        const info = baseDatosPaises[paisKey];
        if (!info) return;

        paisActualGlobal = info;
        bloqueCarga.style.display = 'block';

        setTimeout(() => {
            bloqueCarga.style.display = 'none';

            // Módulo 3: Información General
            if (articuloPais) {
                articuloPais.innerHTML = `
                    <h3>${info.bandera} ${info.nombre}</h3>
                    <p><strong>Capital:</strong> ${info.capital}</p>
                    <p><strong>Región:</strong> ${info.region} (${info.subregion})</p>
                    <p><strong>Idioma:</strong> ${info.idioma}</p>
                    <p><strong>Población:</strong> ${info.poblacion}</p>
                    <p><strong>Moneda Oficial:</strong> ${info.moneda}</p>
                `;
            }

            // Módulo 4: Clima
            if (articuloClima) {
                articuloClima.innerHTML = `
                    <h3>Clima Actual en ${info.capital}</h3>
                    <p><strong>Estado:</strong> ${info.clima}</p>
                    <p><strong>Viento:</strong> ${info.viento}</p>
                    <p><strong>Humedad:</strong> ${info.humedad}</p>
                `;
            }

            // Módulo 5: Conversor Preparación
            if (textoMonedaDestino) textoMonedaDestino.textContent = info.moneda;
            calcularCambio();

            // Módulo 6: Atracciones (Se pide mínimo 5)
            if (gridAtracciones) {
                gridAtracciones.innerHTML = '';
                info.atracciones.forEach((atrac, index) => {
                    const card = document.createElement('div');
                    card.style.border = '1px solid #e8e5dd';
                    card.style.padding = '10px';
                    card.style.margin = '10px 0';
                    card.style.borderRadius = '6px';
                    card.style.background = '#ffffff';
                    card.innerHTML = `
                        <h4>${atrac}</h4>
                        <p>Categoría: Sitio Turístico Histórico</p>
                        <button class="btn-fav-atrac" data-name="${atrac}">⭐ Guardar Atracción</button>
                    `;
                    gridAtracciones.appendChild(card);
                });

                // Eventos para guardar atracciones favoritas
                document.querySelectorAll('.btn-fav-atrac').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const nombreAtrac = e.target.getAttribute('data-name');
                        guardarAtraccionFav(nombreAtrac);
                    });
                });
            }

            // Guardar automáticamente en historial
            agregarAlHistorial(info.nombre);

        }, 500);
    };

    // Módulo 5: Lógica en tiempo real del conversor
    const calcularCambio = () => {
        if (!paisActualGlobal || !valorConvertido) return;
        const monto = parseFloat(inputMontoOrigen.value) || 0;
        const monedaSeleccionada = selectMonedaOrigen.value;
        
        // Tasas ficticias pero funcionales para simular la API
        let tasa = 1.2;
        if (monedaSeleccionada === paisActualGlobal.moneda) tasa = 1;
        
        const resultado = (monto * tasa).toFixed(2);
        valorConvertido.textContent = `${resultado} ${paisActualGlobal.moneda}`;
    };

    if (inputMontoOrigen) inputMontoOrigen.addEventListener('input', calcularCambio);
    if (selectMonedaOrigen) selectMonedaOrigen.addEventListener('change', calcularCambio);

    // Ejecución del buscador al darle clic
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const seleccion = selectPais.value;
            if (!seleccion) {
                alert('Selecciona un país válido de la lista porfis porfitas.');
                return;
            }
            cargarDatosDestino(seleccion);
        });
    }

    // ==========================================
    // 6. MÓDULOS 7 Y 8: DESTINOS Y ATRACCIONES FAVORITAS
    // ==========================================
    if (btnFavoritoPais) {
        btnFavoritoPais.addEventListener('click', () => {
            if (!paisActualGlobal) {
                alert('Busca un país primero para poder guardarlo.');
                return;
            }
            const favs = obtenerDeStorage('viajero_paises_fav') || [];
            if (!favs.some(p => p.nombre === paisActualGlobal.nombre)) {
                favs.push({ nombre: paisActualGlobal.nombre, bandera: paisActualGlobal.bandera });
                guardarEnStorage('viajero_paises_fav', favs);
                pintarFavoritos();
                alert(`${paisActualGlobal.nombre} guardado en tus favoritos.`);
            }
        });
    }

    const guardarAtraccionFav = (nombreAtrac) => {
        const favs = obtenerDeStorage('viajero_atrac_fav') || [];
        if (!favs.includes(nombreAtrac)) {
            favs.push(nombreAtrac);
            guardarEnStorage('viajero_atrac_fav', favs);
            pintarFavoritos();
            alert(`"${nombreAtrac}" añadida a tus atracciones favoritas.`);
        }
    };

    const pintarFavoritos = () => {
        if (listaPaisesFav) {
            const paises = obtenerDeStorage('viajero_paises_fav') || [];
            listaPaisesFav.innerHTML = paises.length ? '' : '<p>No tienes países favoritos.</p>';
            paises.forEach(p => {
                const item = document.createElement('div');
                item.style.padding = '5px 10px';
                item.style.background = '#f4f1ea';
                item.style.margin = '5px';
                item.style.borderRadius = '4px';
                item.innerHTML = `<span>${p.bandera} ${p.nombre}</span>`;
                listaPaisesFav.appendChild(item);
            });
        }

        if (listaAtraccionesFav) {
            const atracciones = obtenerDeStorage('viajero_atrac_fav') || [];
            listaAtraccionesFav.innerHTML = atracciones.length ? '' : '<p>No tienes atracciones favoritas.</p>';
            atracciones.forEach(a => {
                const item = document.createElement('div');
                item.style.padding = '5px 10px';
                item.style.background = '#e8e5dd';
                item.style.margin = '5px';
                item.style.borderRadius = '4px';
                item.innerHTML = `<span>📍 ${a}</span>`;
                listaAtraccionesFav.appendChild(item);
            });
        }
    };

    // ==========================================
    // 7. CARGA INICIAL DEL SISTEMA
    // ==========================================
    if (bloqueCarga) bloqueCarga.style.display = 'none';
    verificarUsuario();
    pintarHistorial();
    pintarFavoritos();
});

document.addEventListener("DOMContentLoaded", () => {
    const botonModo = document.querySelector(".btn-oscuro");
    
    botonModo.addEventListener("click", () => {
        // Añade o quita la clase .dark-mode al body
        document.body.classList.toggle("dark-mode");
        
        // Opcional: Cambiar el texto del botón según el modo
        if (document.body.classList.contains("dark-mode")) {
            botonModo.textContent = "Modo Claro";
        } else {
            botonModo.textContent = "Modo Oscuro";
        }
    });
});