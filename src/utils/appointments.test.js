import test from "node:test";
import assert from "node:assert/strict";
import { generarCodigo, obtenerHorariosDisponibles, obtenerProximasCitas, quitarDatosSensibles, validarIdentificador } from "./appointments.js";

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

test("solo acepta los ultimos cuatro digitos", () => {
  assert.equal(validarIdentificador("1234"), true);
  assert.equal(validarIdentificador("0201234567"), false);
  assert.equal(validarIdentificador("12a4"), false);
});

test("filtra dias no laborables y horas ocupadas", () => {
  assert.deepEqual(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-05"), []);
  const citas = [{ id: "1", especialista: "Dra. María Toaza", fecha: "2026-09-04", hora: "08:00", estado: "Pendiente" }];
  assert.equal(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-04", citas).includes("08:00"), false);
});

test("una cita cancelada libera nuevamente la hora", () => {
  const citas = [{ id: "1", especialista: "Dra. María Toaza", fecha: "2026-09-04", hora: "08:00", estado: "Cancelada" }];
  assert.equal(obtenerHorariosDisponibles("Dra. María Toaza", "2026-09-04", citas).includes("08:00"), true);
});

test("elimina identificadores personales antes de persistir", () => {
  assert.deepEqual(quitarDatosSensibles({ nombre: "Ana", identificador: "4567", cedula: "0201234567" }), { nombre: "Ana" });
});

test("genera un codigo de confirmacion reconocible", () => {
  assert.match(generarCodigo(123456789), /^IHM-[A-Z0-9]+$/);
});
