import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// Protege las páginas del Kraal: hace falta sesión y rol JT o kraal.
// Los scouts van a su patrulla; quien no ha entrado, al acceso del Kraal.
onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "acceso-kraal.html"; return; }
    try {
        const s = await getDoc(doc(db, "usuarios", user.uid));
        const rol = s.exists() ? s.data().rol : null;
        if (rol === "JT" || rol === "kraal") return;
        window.location.href = rol ? "patrulla.html" : "acceso-kraal.html";
    } catch (e) {
        window.location.href = "acceso-kraal.html";
    }
});

window.logout = () => signOut(auth).then(() => { window.location.href = "index.html"; });
