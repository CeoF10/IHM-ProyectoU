import assert from "node:assert/strict";
import test from "node:test";
import { fragmentarTexto, mensajeErrorVoz } from "./voice.js";

test("divide el contenido visible en fragmentos pronunciables sin perder texto", () => {
  const texto = "Solicitar cita\nNombre completo. Elige un profesional y un horario disponible.";
  const fragmentos = fragmentarTexto(texto, 36);
  assert.ok(fragmentos.every((parte) => parte.length <= 36));
  assert.deepEqual(fragmentos, ["Solicitar cita", "Nombre completo.", "Elige un profesional y un horario", "disponible."]);
});

test("distingue falta de voces y bloqueo del navegador", () => {
  assert.match(mensajeErrorVoz("", true), /No hay una voz disponible/);
  assert.match(mensajeErrorVoz("voice-unavailable"), /No hay una voz disponible/);
  assert.match(mensajeErrorVoz("not-allowed"), /bloqueó la voz/);
});
