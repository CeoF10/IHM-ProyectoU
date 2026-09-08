export const especialistas = [
  { id: 1, nombre: "Dra. María Toaza", especialidad: "Fisioterapia", horario: "Lun-Vie 08:00-11:30", dias: [1, 2, 3, 4, 5], horas: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], foto: "MT" },
  { id: 2, nombre: "Dr. Carlos Bayas", especialidad: "Traumatología", horario: "Lun-Mié-Vie 14:00-15:00", dias: [1, 3, 5], horas: ["14:00", "14:30", "15:00"], foto: "CB" },
  { id: 3, nombre: "Lcda. Ana Chimbo", especialidad: "Terapia Ocupacional", horario: "Mar-Jue 08:00-11:30", dias: [2, 4], horas: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], foto: "AC" },
  { id: 4, nombre: "Dr. Luis Montero", especialidad: "Neurología", horario: "Lun-Jue 09:00-15:00", dias: [1, 2, 3, 4], horas: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"], foto: "LM" },
];

export const horariosDisponibles = [
  "08:00", "08:30", "09:00", "09:30", "10:00",
  "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"
];

export const ejercicios = [
  { id: 1, titulo: "Movilidad de hombro", desc: "Elevaciones suaves 10 repeticiones, 2 veces al día.", nivel: "Básico" },
  { id: 2, titulo: "Fortalecimiento rodilla", desc: "Extensiones sentado, mantener 5 seg. 3 series de 8.", nivel: "Intermedio" },
  { id: 3, titulo: "Respiración diafragmática", desc: "Inhalar 4 seg, sostener 4, exhalar 6. 5 minutos.", nivel: "Todos" },
];

export const centroInfo = {
  nombre: "IESS Centro de Rehabilitación Guaranda",
  direccion: "Av. Manuela Cañizares y 7 de Mayo, Guaranda, Bolívar",
  telefono: "(03) 255-0123",
  horario: "Lunes a Viernes 08:00 - 17:00",
};
