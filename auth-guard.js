import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";
import { crearNoLeidos } from "./no-leidos.js";

// Protege las páginas del Kraal: hace falta sesión y rol JT o kraal.
// Los scouts van a su patrulla; quien no ha entrado, al acceso del Kraal.
onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "acceso-kraal.html"; return; }
    try {
        const s = await getDoc(doc(db, "usuarios", user.uid));
        const rol = s.exists() ? s.data().rol : null;
        if (rol === "JT" || rol === "kraal") { avisoNoLeidos(user.uid); return; }
        window.location.href = rol ? "patrulla.html" : "acceso-kraal.html";
    } catch (e) {
        window.location.href = "acceso-kraal.html";
    }
});

window.logout = () => signOut(auth).then(() => { window.location.href = "index.html"; });

// Punto rojo en "Patrullas" (y en el botón de menú del móvil) cuando hay chats con mensajes sin leer
function avisoNoLeidos(uid) {
    const enlace = document.querySelector('.menu-item[href="gestion-patrullas.html"]');
    const boton = document.querySelector(".menu-btn");
    const base = document.title;
    const badge = document.createElement("span");
    badge.className = "badge-nl oculto";
    if (enlace) enlace.appendChild(badge);
    const claves = ["patrulla_chat_toro", "jefatura_chat_toro", "patrulla_chat_leon", "jefatura_chat_leon", "alta_patrulla_chat"];
    const nl = crearNoLeidos({ db, uid, claves, alCambiar: () => {
        const n = nl.total();
        badge.textContent = n;
        badge.classList.toggle("oculto", n === 0);
        if (boton) boton.classList.toggle("tiene-nl", n > 0);
        document.title = (n ? `(${n}) ` : "") + base;
    } });
}
