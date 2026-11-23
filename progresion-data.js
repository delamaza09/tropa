// Etapas de progresión y sus requisitos. EDÍTALOS aquí con los de vuestra tropa:
// cada requisito necesita un "id" único (no lo cambies una vez que haya scouts con avances) y un "texto".
export const ETAPAS = [
  { id: "aspirante", nombre: "Aspirante", lema: "Etapa 1 · Tu promesa", desc: "Conoce la patrulla, su rincón y prepárate para hacer tu promesa.",
    reqs: [
      { id: "asp1", texto: "Conocer a tu patrulla y su rincón" },
      { id: "asp2", texto: "Aprender la Ley Scout" },
      { id: "asp3", texto: "Aprender el significado de la Promesa" },
      { id: "asp4", texto: "Asistir con regularidad a las reuniones" },
      { id: "asp5", texto: "Pasarse las pruebas del cuaderno" },
      { id: "asp6", texto: "Leer La Patrulla te invita" },
      { id: "asp7", texto: "Hacer tu Promesa" }
    ] },
  { id: "segunda", nombre: "Segunda Clase", lema: "Etapa 2 · Ocupa tu puesto", desc: "Asume un puesto de acción en la patrulla y avanza en las técnicas de campo.",
    reqs: [
      { id: "seg1", texto: "Pasarse las pruebas de la Segunda Clase y tener el visto bueno de tu JP " },
      { id: "seg2", texto: "Hacer el raid de 2 personas" },
      { id: "seg3", texto: "Asistir con regularidad a las actividades" },
      { id: "seg4", texto: "Leer La Patrulla te Acoge" }
    ] },
  { id: "primera", nombre: "Primera Clase", lema: "Etapa 3 · Avanza", desc: "Amplía responsabilidades y afronta retos mayores con tu patrulla.",
    reqs: [
      { id: "pri1", texto: "Pasarse las pruebas de la Segunda Clase y tener el visto bueno de tu JP " },
      { id: "pri2", texto: "Hacer el raid (solo)" },
      { id: "pri3", texto: "Asistir con regularidad a las actividades"}
    ] }
];
export const ESPECIALIDADES = [
  { id: "esp_campismo", texto: "Campismo" }, { id: "esp_naturaleza", texto: "Naturaleza" }, { id: "esp_raid", texto: "Raid-explo" },
  { id: "esp_transmisiones", texto: "Transmisiones" }, { id: "esp_socorrismo", texto: "Socorrismo" }, { id: "esp_cocina", texto: "Cocina" }
];
// Resumen de avance a partir de la lista de requisitos hechos
export function resumen(hechos) {
  const h = new Set(hechos || []);
  const etapas = ETAPAS.map(e => ({ ...e, hechos: e.reqs.filter(r => h.has(r.id)).length, total: e.reqs.length }));
  etapas.forEach(e => { e.completa = e.hechos === e.total; e.pct = Math.round(e.hechos / e.total * 100); });
  const actual = etapas.find(e => !e.completa) || null;
  const total = etapas.reduce((a, e) => a + e.total, 0), hechosTot = etapas.reduce((a, e) => a + e.hechos, 0);
  return { etapas, actual, h, pct: Math.round(hechosTot / total * 100), espHechas: ESPECIALIDADES.filter(x => h.has(x.id)).length };
}
