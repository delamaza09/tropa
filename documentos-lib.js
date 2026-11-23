// PDF guardados dentro de Firestore (sin Firebase Storage, que exige plan de pago).
// Cada PDF se parte en trozos de texto base64 en documentos/<id>/partes/<n>.
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const MAX_MB = 5;
const TROZO = 700000; // caracteres base64 por documento (el límite de Firestore es ~1 MB)

function aBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
export const tamanoLegible = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

export async function subirPDF(db, { file, titulo, descripcion, autor, progreso }) {
  if (file.size > MAX_MB * 1048576) throw new Error(`El PDF pesa más de ${MAX_MB} MB.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(...bytes.subarray(0, 5)) !== "%PDF-") throw new Error("El archivo no es un PDF válido.");
  const b64 = aBase64(bytes);
  const n = Math.ceil(b64.length / TROZO);
  const ref = doc(collection(db, "documentos"));
  for (let i = 0; i < n; i++) {
    await setDoc(doc(db, "documentos", ref.id, "partes", String(i).padStart(3, "0")), { i, datos: b64.slice(i * TROZO, (i + 1) * TROZO) });
    progreso && progreso((i + 1) / (n + 1));
  }
  // La ficha se crea la última: el documento solo aparece cuando está completo
  await setDoc(ref, { titulo, descripcion: descripcion || "", nombre: file.name, tamano: file.size, partes: n, creadoEn: Date.now(), autor: autor || "" });
  progreso && progreso(1);
  return ref.id;
}

export async function leerPDF(db, id) {
  const snap = await getDocs(query(collection(db, "documentos", id, "partes"), orderBy("i")));
  const bin = atob(snap.docs.map(d => d.data().datos).join(""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
}

export async function borrarPDF(db, id) {
  const snap = await getDocs(collection(db, "documentos", id, "partes"));
  await deleteDoc(doc(db, "documentos", id)); // primero la ficha: deja de verse al instante
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

// Abre el PDF en una pestaña nueva (o lo descarga)
export async function abrirPDF(db, d, descargar = false) {
  const w = descargar ? null : window.open("", "_blank");
  if (w) w.document.write("<p style='font-family:sans-serif'>Cargando PDF…</p>");
  try {
    const url = URL.createObjectURL(await leerPDF(db, d.id));
    if (w) w.location.href = url;
    else { const a = document.createElement("a"); a.href = url; a.download = d.nombre || "documento.pdf"; document.body.appendChild(a); a.click(); a.remove(); }
    setTimeout(() => URL.revokeObjectURL(url), 120000);
  } catch (e) { if (w) w.close(); alert("No se pudo abrir el PDF: " + e.message); }
}
