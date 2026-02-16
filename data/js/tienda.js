const contenedor = document.getElementById("contenedor-productos");

// Recuperar carrito del localStorage o inicializarlo vacío
let carrito = JSON.parse(localStorage.getItem("carrito_productos")) || [];

/**
 * CORRECCIÓN DE RUTA UNIVERSAL
 * Usamos "../productos.json" porque el JS está en 'data/js' 
 * y el JSON está en 'data/'. Subimos un nivel.
 */
fetch("../productos.json")
  .then(res => {
    if (!res.ok) throw new Error("No se encontró productos.json en la carpeta data");
    return res.json();
  })
  .then(productos => {
    if (!contenedor) return;
    contenedor.innerHTML = ""; // Limpiar mensaje de carga

    productos.forEach(producto => {
      const card = document.createElement("div");
      
      card.className = `
        bg-white/5 backdrop-blur-md text-white rounded-3xl border border-white/10 shadow-2xl p-6
        flex flex-col items-center hover:-translate-y-2 transition-all duration-300
      `;

      card.innerHTML = `
        <div class="w-full h-48 flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-white/5">
            <img src="../image/${producto.imagen}" 
                 alt="${producto.nombre}"
                 class="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
        </div>

        <h3 class="text-xl font-bold text-white mb-2 text-center uppercase tracking-tight">
          ${producto.nombre}
        </h3>

        <p class="text-2xl font-black text-green-400 mb-6">
          $${parseFloat(producto.precio).toFixed(2)}
        </p>

        <button 
          class="btn_agregar w-full bg-green-500 hover:bg-green-400 text-green-950 px-4 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg shadow-green-500/20"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}">
          Agregar al Carrito
        </button>
      `;

      contenedor.appendChild(card);
    });
  })
  .catch(err => {
    if (!contenedor) return;
    contenedor.innerHTML = `
      <div class="col-span-full text-center py-20 bg-red-500/10 border border-red-500/20 rounded-3xl">
        <p class="text-red-400 font-bold text-xl mb-2">⚠️ Error al cargar el catálogo</p>
        <p class="text-gray-400 text-sm mb-4">Detalle: ${err.message}</p>
      </div>
    `;
    console.error("Detalle técnico del error:", err);
  });

// LÓGICA DEL CARRITO
if (contenedor) {
    contenedor.addEventListener("click", e => {
      const btn = e.target.closest(".btn_agregar");
      if (!btn) return;

      const producto = {
        nombre: btn.dataset.nombre,
        precio: Number(btn.dataset.precio)
      };

      carrito.push(producto);
      localStorage.setItem("carrito_productos", JSON.stringify(carrito));

      // Animación de feedback
      const textoOriginal = btn.innerText;
      btn.innerText = "¡Agregado! ⚽";
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      
      setTimeout(() => {
        btn.innerText = textoOriginal;
        btn.style.backgroundColor = ""; // Vuelve al original de la clase
        btn.style.color = "";
      }, 1000);
    });
}