document.addEventListener("DOMContentLoaded", async function () {
    const inputFecha = document.getElementById('fecha-reserva');
    const gridInicio = document.getElementById('grid-inicio');
    const gridFin = document.getElementById('grid-fin');

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvhZR5qBm_bUGSnVZtT3TXL4O2zthL4VjBnWIIn8ELLtaT3t4CR4geHHamae9zd9Cv/exec"; 
    
    let eventosGoogle = [];

    async function cargarEventos() {
        try {
            const res = await fetch(SCRIPT_URL);
            eventosGoogle = await res.json();
            console.log("Calendario sincronizado: ", eventosGoogle.length, " eventos.");
        } catch (e) { 
            console.error("Error cargando Google Calendar"); 
        }
    }

    await cargarEventos();

    inputFecha.addEventListener('change', function () {
        const fecha = inputFecha.value;
        if (!fecha) return;

        gridInicio.innerHTML = ''; 
        gridFin.innerHTML = '<p class="text-gray-500 text-[10px] col-span-2 text-center italic mt-4">Elige inicio primero...</p>';
        
        const partesFecha = fecha.split('-');

        for (let h = 8; h <= 22; h += 0.5) {
            const horas = Math.floor(h);
            const minutos = (h % 1 === 0) ? 0 : 30;
            const horaStr = (horas < 10 ? '0' + horas : horas) + ":" + (minutos === 0 ? "00" : "30");
            
            // Creamos el momento exacto para comparar con Google
            const momentoEvaluar = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2], horas, minutos, 0).getTime();
            
            const estaOcupado = eventosGoogle.some(evt => {
                // Bloqueamos si el inicio del turno está dentro de una reserva de Google
                return momentoEvaluar >= evt.inicio && momentoEvaluar < evt.fin;
            });

            const boton = document.createElement('button');
            boton.innerText = horaStr;
            
            if (estaOcupado) {
                boton.className = "bg-red-900/20 text-red-500 p-2 rounded-xl opacity-50 cursor-not-allowed text-[10px] border border-red-500/20";
                boton.disabled = true;
            } else {
                boton.className = "bg-green-500/10 text-green-400 border border-green-500/20 p-2 rounded-xl text-[10px] hover:bg-green-500 hover:text-black font-bold transition-all";
                boton.onclick = () => {
                    limpiarSeleccion(gridInicio);
                    boton.className = "bg-green-500 text-green-950 p-2 rounded-xl text-[10px] font-black shadow-lg shadow-green-500/40 transform scale-105";
                    cargarHorasFin(h, fecha, partesFecha);
                };
            }
            gridInicio.appendChild(boton);
        }
    });

    function cargarHorasFin(horaInicioDecimal, fecha, partesFecha) {
        gridFin.innerHTML = '';
        
        for (let h = horaInicioDecimal + 0.5; h <= 23.5; h += 0.5) {
            const horas = Math.floor(h);
            const minutos = (h % 1 === 0) ? 0 : 30;
            const horaStr = (horas < 10 ? '0' + horas : horas) + ":" + (minutos === 0 ? "00" : "30");
            
            // Evaluamos si el bloque de tiempo (desde el inicio hasta este fin) choca con algo
            const momentoFinParaEvaluar = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2], horas, minutos, 0).getTime();
            
            // Si hay un evento que empieza ANTES de esta hora de fin, pero DESPUÉS de la hora de inicio seleccionada, cortamos.
            const choquePosterior = eventosGoogle.some(evt => {
                return evt.inicio < momentoFinParaEvaluar && evt.inicio >= new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2], Math.floor(horaInicioDecimal), (horaInicioDecimal % 1 === 0 ? 0 : 30), 0).getTime();
            });
            
            if (choquePosterior) break; 

            const boton = document.createElement('button');
            boton.innerText = horaStr;
            boton.className = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 p-2 rounded-xl text-[10px] hover:bg-yellow-500 hover:text-black font-bold";
            
            boton.onclick = () => {
                const hIni = Math.floor(horaInicioDecimal);
                const mIni = (horaInicioDecimal % 1 === 0) ? "00" : "30";
                const inicioStr = (hIni < 10 ? '0' + hIni : hIni) + ":" + mIni;
                
                const msj = `¡Hola Arcadia! ⚽\nMe gustaría reservar:\n📅 Fecha: ${fecha}\n⏰ Inicio: ${inicioStr}\n🏁 Fin: ${horaStr}`;
                window.open(`https://wa.me/593998667865?text=${encodeURIComponent(msj)}`, '_blank');
            };
            gridFin.appendChild(boton);
        }
    }

    function limpiarSeleccion(contenedor) {
        contenedor.querySelectorAll('button').forEach(b => {
            if(!b.disabled) b.className = "bg-green-500/10 text-green-400 border border-green-500/20 p-2 rounded-xl text-[10px] hover:bg-green-500 hover:text-black font-bold";
        });
    }
});