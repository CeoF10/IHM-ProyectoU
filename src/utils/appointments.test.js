import test from "node:test";
import assert from "node:assert/strict";
import { generarCodigo, obtenerHorariosDisponibles, quitarDatosSensibles, validarIdentificador } from "./appointments.js";

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
