// Mensajes sin leer.
// Cada chat tiene un documento pequeño en "chat_estado" (último mensaje) y cada persona guarda en "lecturas/<uid>"
// hasta cuándo ha leído cada chat. Así solo se leen unos pocos documentos, no todo el historial del chat.
// Claves de chat: patrulla_chat_<patrulla>, jefatura_chat_<patrulla>, alta_patrulla_chat
import { doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function crearNoLeidos({ db, uid, claves, alCambiar }) {
  const estados = {};
  let lect = null;
  const paradas = [];
  const avisar = () => { try { alCambiar && alCambiar(); } catch (e) { console.error(e); } };

  paradas.push(onSnapshot(doc(db, "lecturas", uid), (s) => {
    if (!s.exists()) {
      // Primera vez: lo anterior cuenta como leído; solo avisan los mensajes nuevos
      lect = { creado: Date.now() };
      setDoc(doc(db, "lecturas", uid), { creado: lect.creado }, { merge: true }).catch(() => {});
    } else lect = { ...s.data() };
    avisar();
  }, (e) => console.warn("lecturas", e.code || e)));

  claves.forEach((id) => paradas.push(onSnapshot(doc(db, "chat_estado", id), (s) => {
    estados[id] = s.exists() ? s.data() : null;
    avisar();
  }, (e) => console.warn("chat_estado/" + id, e.code || e))));

  const tiene = (id) => {
    const e = estados[id];
    if (!e || !lect || e.uid === uid) return false;
    return (e.ultimo || 0) > (lect[id] ?? lect.creado ?? 0);
  };
  const marcarLeido = (id) => {
    const e = estados[id];
    if (!e || !lect || (lect[id] || 0) >= (e.ultimo || 0)) return;
    lect[id] = e.ultimo;
    setDoc(doc(db, "lecturas", uid), { [id]: e.ultimo }, { merge: true }).catch(() => {});
  };
  return { tiene, marcarLeido, total: () => claves.filter(tiene).length, parar: () => paradas.forEach(f => f()) };
}

// Llamar después de enviar un mensaje
export function avisarEnvio(db, { id, canal, patrulla, uid, autor, rol, ts }) {
  return setDoc(doc(db, "chat_estado", id), { canal, patrulla: patrulla ?? null, ultimo: ts, uid, autor, rol })
    .catch((e) => console.warn("chat_estado", e.code || e));
}
