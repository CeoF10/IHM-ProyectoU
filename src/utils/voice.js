export function fragmentarTexto(texto, longitudMaxima = 180) {
  const frases = texto.split(/\n+/).flatMap((linea) => linea.split(/(?<=[.?!;])\s+/));
  const fragmentos = [];
  for (const frase of frases) {
    const palabras = frase.trim().split(/\s+/).filter(Boolean);
    let fragmento = "";
    for (const palabra of palabras) {
      if (fragmento && `${fragmento} ${palabra}`.length > longitudMaxima) {
        fragmentos.push(fragmento);
        fragmento = "";
      }
      fragmento = fragmento ? `${fragmento} ${palabra}` : palabra;
    }
    if (fragmento) fragmentos.push(fragmento);
  }
  return fragmentos;
}

export function mensajeErrorVoz(error, sinVoces = false) {
  if (sinVoces || ["voice-unavailable", "language-unavailable", "synthesis-unavailable"].includes(error)) {
    return "No hay una voz disponible en este navegador. Activa o instala una voz en español en tu navegador o sistema y vuelve a intentarlo.";
  }
  if (error === "not-allowed") {
    return "El navegador bloqueó la voz. Pulsa Escuchar de nuevo y comprueba que el sitio tenga permiso para reproducir sonido.";
  }
  if (error === "audio-busy" || error === "audio-hardware") {
    return "La salida de audio no está disponible. Revisa los altavoces y vuelve a intentarlo.";
  }
  return "No se pudo reproducir la voz. Puedes leer el contenido en pantalla.";
}
