const lista = document.getElementById("lista-carrito");
const totalCompra = document.getElementById("total_compra");
const botonVaciar = document.getElementById("vaciar-carrito");

// Obtenemos los productos del almacenamiento local
let productosCarrito = JSON.parse(localStorage.getItem("carrito_productos")) || [];

const mostrarCarrito = () => {
    lista.innerHTML = "";
    let totalPago = 0;

    if (productosCarrito.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-10">
                <p class="text-gray-400 text-lg">Tu carrito está vacío ⚽</p>
                <a href="tienda.html" class="text-green-400 hover:text-green-300 underline text-sm mt-2 inline-block">Ir a ver productos</a>
            </div>
        `;
        totalCompra.textContent = "$0.00";
        return;
    }

    productosCarrito.forEach((producto, index) => {
        // Aseguramos que el precio sea un número válido
        const precioNumerico = parseFloat(producto.precio) || 0;
        totalPago += precioNumerico;

        lista.innerHTML += `
            <div class="flex justify-between items-center border-b border-white/10 py-4 px-2 hover:bg-white/5 transition">
                <div>
                    <p class="font-bold text-white text-lg">${producto.nombre}</p>
                    <p class="text-xs text-gray-400 uppercase tracking-widest">Artículo Deportivo</p>
                </div>
                <div class="flex items-center gap-6">
                    <span class="text-green-400 font-black text-xl">$${precioNumerico.toFixed(2)}</span>
                    <button data-index="${index}" class="btn-eliminar bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white w-8 h-8 rounded-full transition flex items-center justify-center font-bold">
                        ✕
                    </button>
                </div>
            </div>
        `;
    });

    totalCompra.textContent = `$${totalPago.toFixed(2)}`;
};

// Lógica para Vaciar todo el Carrito
if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        if (productosCarrito.length > 0) {
            if (confirm("¿Quieres quitar todos los productos del carrito?")) {
                productosCarrito = [];
                localStorage.setItem("carrito_productos", JSON.stringify(productosCarrito));
                mostrarCarrito();
            }
        }
    });
}

// Eliminar producto individual
lista.addEventListener("click", e => {
    const boton = e.target.closest(".btn-eliminar");
    if (boton) {
        const index = boton.dataset.index;
        productosCarrito.splice(index, 1);
        localStorage.setItem("carrito_productos", JSON.stringify(productosCarrito));
        mostrarCarrito();
    }
});

// Inicializar la vista al cargar
mostrarCarrito();