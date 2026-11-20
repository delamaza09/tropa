// Puestos de acción: slug de la URL (pa.html?p=guia), nombre (el mismo que usa patrulla.html) y resumen por defecto.
// El contenido real (descripción, funciones, tareas, recursos, consejos) se edita desde el panel: Profundiza PA.
export const PA = [
  { slug: "guia",       nombre: "Orientador",       emoji: "🧭", resumen: "Lidera la patrulla, coordina al resto de puestos y es el enlace con la jefatura." },
  { slug: "subguia",    nombre: "Animador de Veladas",    emoji: "🤝", resumen: "Apoya al guía en todo y lo sustituye cuando no puede estar." },
  { slug: "tesorero",   nombre: "Deportista",   emoji: "💰", resumen: "Lleva las cuentas de la patrulla: cuotas, gastos y presupuesto." },
  { slug: "secretario", nombre: "Liturgista", emoji: "📒", resumen: "Lleva el cuaderno de patrulla: actas, asistencia y avisos." },
  { slug: "intendente", nombre: "Cocinero", emoji: "🍳", resumen: "Se ocupa de la comida y la cocina: menús, compras y fuego." },
  { slug: "sanitario",  nombre: "Socorrista",  emoji: "🩺", resumen: "Cuida la salud de la patrulla: botiquín, primeros auxilios y prevención." },
  { slug: "material",   nombre: "Pionero",   emoji: "🎒", resumen: "Cuida y organiza el material de la patrulla: inventario, mantenimiento y orden del rincón." }
];
export const TIPOS = [
  { id: "funcion", titulo: "Qué hace este puesto", icono: "📌" },
  { id: "tarea",   titulo: "Tareas y retos",       icono: "✅" },
  { id: "recurso", titulo: "Recursos y enlaces",   icono: "🔗" },
  { id: "consejo", titulo: "Consejos",             icono: "💡" }
];
export const porSlug = (s) => PA.find(p => p.slug === s);
export const porNombre = (n) => PA.find(p => p.nombre === n);
// Solo enlaces http(s)
export const enlaceSeguro = (u) => /^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "";
