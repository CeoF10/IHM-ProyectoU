import test from "node:test";
import assert from "node:assert/strict";
import { crearCitasDemo, generarCodigo, obtenerHorariosDisponibles, obtenerProximasCitas, quitarDatosSensibles, validarIdentificador } from "./appointments.js";

test("recordatorios ordenados: excluye citas pasadas, canceladas y atendidas", () => {
  const ahora = new Date("2026-09-08T10:00:00");
  const base = { fecha: "2026-09-08", hora: "11:00", estado: "Pendiente" };
  const citas = [
    { ...base, id: "futura", fecha: "2026-09-09" },
    { ...base, id: "pasada", hora: "09:00" },
    { ...base, id: "cancelada", estado: "Cancelada" },
    { ...base, id: "atendida", estado: "Atendida" },
    { ...base, id: "hoy" },
  ];
  assert.deepEqual(obtenerProximasCitas(citas, ahora).map(c => c.id), ["hoy", "futura"]);
  assert.equal(citas[0].id, "futura");
  const cambiadas = citas.map(c => c.id === "hoy" ? { ...c, fecha: "2026-09-10" } : c);
  assert.deepEqual(obtenerProximasCitas(cambiadas, ahora).map(c => c.id), ["futura", "hoy"]);
  assert.deepEqual(obtenerProximasCitas([], ahora), []);
});

test("solicita los diez dígitos de la cédula", () => {
  assert.equal(validarIdentificador("0201234567"), true);
  assert.equal(validarIdentificador("1234"), false);
  assert.equal(validarIdentificador("02012345a7"), false);
});

test("filtra dias no laborables y horas ocupadas", () => {
  assert.deepEqual(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-05"), []);
  const citas = [{ id: "1", especialista: "Dra. María Toaza", fecha: "2026-09-04", hora: "08:00", estado: "Pendiente" }];
  assert.equal(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-04", citas, null, new Date("2026-09-03T12:00:00")).includes("08:00"), false);
});

test("una cita cancelada libera nuevamente la hora", () => {
  const citas = [{ id: "1", especialista: "Dra. María Toaza", fecha: "2026-09-04", hora: "08:00", estado: "Cancelada" }];
  assert.equal(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-04", citas, null, new Date("2026-09-03T12:00:00")).includes("08:00"), true);
});

test("no ofrece horas que ya pasaron hoy", () => {
  const horarios = obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-24", [], null, new Date("2026-09-24T09:15:00"));
  assert.equal(horarios.includes("09:00"), false);
  assert.equal(horarios.includes("09:30"), true);
});

test("las citas de ejemplo no duplican un horario reservado", () => {
  const ahora = new Date("2026-09-24T12:00:00");
  const ocupada = { id: "manual", especialista: "Dra. María Toaza", fecha: "2026-09-25", hora: "09:00", estado: "Pendiente" };
  const [ejemplo] = crearCitasDemo([ocupada], ahora);
  assert.equal(ejemplo.fecha, "2026-09-25");
  assert.notEqual(ejemplo.hora, "09:00");
});

test("elimina identificadores personales antes de persistir", () => {
  assert.deepEqual(quitarDatosSensibles({ nombre: "Ana", identificador: "4567", cedula: "0201234567", perfil: "Joven", modo: "Vista rápida" }), { nombre: "Ana" });
});

test("genera un codigo de confirmacion reconocible", () => {
  assert.match(generarCodigo(123456789), /^IHM-[A-Z0-9]+$/);
});
