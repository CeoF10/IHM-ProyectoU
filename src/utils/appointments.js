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

export function generarCodigo(ahora = Date.now()) {
  return `IHM-${ahora.toString(36).toUpperCase().slice(-7)}`;
}

export function quitarDatosSensibles(cita) {
  const { identificador: _identificador, cedula: _cedula, ...datosSeguros } = cita;
  return datosSeguros;
}
