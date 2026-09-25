# 04 - Protocolo de evaluación de usabilidad y accesibilidad

## Objetivo

Comprobar con personas reales si una cita puede completarse en menos de tres minutos, sin errores críticos y con los ajustes de accesibilidad que cada participante necesite.

## Participantes sugeridos

Invitar al menos a cinco personas con distintas edades, experiencias digitales y necesidades de acceso. No se debe pedir que una persona se identifique públicamente por una discapacidad; basta con registrar, con su consentimiento, las ayudas que decidió utilizar.

## Tareas

1. Encontrar un profesional de Fisioterapia.
2. Solicitar una cita en una fecha con disponibilidad.
3. Activar texto grande, alto contraste o botones grandes durante la solicitud y verificar que los datos se mantienen.
4. Confirmar la cita e identificar el código generado.
5. Reprogramar y después cancelar la cita.
6. Activar la lectura por voz de la página y del resumen de la cita.
7. Reproducir el video, activar subtítulos y consultar la transcripción.

## Métricas

| Métrica | Forma de medir | Meta |
|---|---|---|
| Finalización | Completó la cita sin ayuda | 90 % o más |
| Tiempo | Desde “Solicitar cita” hasta confirmación | Menos de 3 minutos |
| Errores críticos | Impiden continuar o generan una cita incorrecta | 0 |
| Recuperación | Corrige un error sin abandonar | 90 % o más |
| Ajustes de accesibilidad | Mantiene los datos escritos al activarlos | 100 % |
| Satisfacción | Escala sencilla de 1 a 5 | 4 o más |

## Comprobaciones de accesibilidad

- Recorrer toda la aplicación con Tab, Shift+Tab, Enter y Espacio.
- Comprobar foco visible y orden lógico.
- Usar zoom de navegador al 200 % y 400 %.
- Probar NVDA o JAWS y anotar literalmente qué anuncia.
- Activar subtítulos y comparar el texto con la transcripción.
- Probar una pantalla táctil y verificar objetivos de al menos 44 × 44 px.
- Comprobar que texto grande, contraste y botones grandes funcionen en todas las secciones.

## Registro de resultados

| Participante | Ajustes utilizados | Tiempo | Errores | Ayuda requerida | Resultado | Comentario principal |
|---|---|---:|---:|---|---|---|
| P1 |  |  |  |  |  |  |
| P2 |  |  |  |  |  |  |
| P3 |  |  |  |  |  |  |
| P4 |  |  |  |  |  |  |
| P5 |  |  |  |  |  |  |

No se deben inventar resultados. Esta tabla se completa únicamente después de observar las pruebas y recibir el consentimiento de cada participante.

## Validación técnica registrada — 3 de septiembre de 2026

- `npm test`: aprobado.
- `npm run lint`: aprobado.
- `npm run build`: aprobado.
- Página principal y video MP4: respuesta HTTP 200.
- Capturas estáticas de escritorio y móvil: revisadas sin desbordamiento horizontal visible.
- Flujo automatizado en Chromium de una versión anterior: filtró disponibilidad, mostró la confirmación, no persistió el identificador, permitió reprogramar y cancelar, y aplicó las preferencias globales.

## Comprobación técnica de la interfaz actual — 24 de septiembre de 2026

- `npm test`, `npm run lint` y `npm run build`: aprobados.
- Chromium: abre las ocho funciones simuladas, completa una cita en el formulario único, comprueba que el identificador no se guarda y permite iniciar una cita nueva después de salir de una reprogramación.

Estas comprobaciones técnicas no sustituyen una prueba de usabilidad ni una validación con lector de pantalla.

## Comprobación de páginas de apoyo — 25 de septiembre de 2026

- `npm test`, `npm run lint` y `npm run build`: aprobados.
- En Chromium a 390 px y 320 px con letra y botones grandes, las ocho secciones se muestran sin desbordamiento horizontal de página.
- El historial filtra por estado. Al cancelar una cita, aparece en «Canceladas» y deja de mostrarse como recordatorio futuro.
- El enlace de un recordatorio abre el historial. La página del centro enlaza el directorio oficial para consultar horarios vigentes.
