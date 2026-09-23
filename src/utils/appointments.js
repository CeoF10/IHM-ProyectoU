import { especialistas } from "../data/mock.js";

export const borradorVacio = () => ({
  nombre: "",
  identificador: "",
  esp: "",
  especialista: "",
  fecha: "",
  hora: "",
});

export const fechaLocal = (fecha = new Date()) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

export function crearCitasDemo() {
  const ejemplos = [
    { id: "DEMO-001", codigo: "DEMO-001", especialista: especialistas[0], hora: "09:00", fechaDesde: 1 },
    { id: "DEMO-002", codigo: "DEMO-002", especialista: especialistas[2], hora: "10:00", fechaDesde: 4 },
  ];

  return ejemplos.map(({ id, codigo, especialista, hora, fechaDesde }) => {
    const fecha = new Date();
    fecha.setHours(12, 0, 0, 0);
    fecha.setDate(fecha.getDate() + fechaDesde);
    while (!especialista.dias.includes(fecha.getDay())) fecha.setDate(fecha.getDate() + 1);

    return {
      id,
      codigo,
      nombre: "Paciente de demostración",
      esp: especialista.especialidad,
      especialista: especialista.nombre,
      fecha: fechaLocal(fecha),
      hora,
      modo: "Vista rápida",
      estado: "Pendiente",
      esDemo: true,
    };
  });
}

export function obtenerHorariosDisponibles(especialistaNombre, fecha, citas = [], excluirId = null) {
  const especialista = especialistas.find((item) => item.nombre === especialistaNombre);
  if (!especialista || !fecha) return [];

  const dia = new Date(`${fecha}T12:00:00`).getDay();
  if (!especialista.dias.includes(dia)) return [];

  const ocupadas = new Set(
    citas
      .filter((cita) => cita.id !== excluirId && cita.estado !== "Cancelada" && cita.especialista === especialistaNombre && cita.fecha === fecha)
      .map((cita) => cita.hora),
  );
  return especialista.horas.filter((hora) => !ocupadas.has(hora));
}

export function validarIdentificador(valor) {
  return /^\d{4}$/.test(valor);
}

export function obtenerProximasCitas(citas, ahora = new Date()) {
  return citas
    .filter((cita) => cita.estado === "Pendiente" && new Date(cita.fecha + "T" + cita.hora) >= ahora)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
}

export function generarCodigo(ahora = Date.now()) {
  return `IHM-${ahora.toString(36).toUpperCase().slice(-7)}`;
}

export function quitarDatosSensibles(cita) {
  const { identificador: _identificador, cedula: _cedula, ...datosSeguros } = cita;
  return datosSeguros;
}
