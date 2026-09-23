# 03 - Análisis IHM (para exponer ante la docente)

## Reto: una solicitud simple, guiada y accesible

Se descartó pedirle a la persona que elija entre “Vista rápida”, “Paso a paso” y “Accesibilidad reforzada”. Esa decisión añadía una pantalla y obligaba a entender diferencias entre formatos antes de solicitar una cita. El prototipo ahora presenta un único recorrido de tres pasos, con una tarea por pantalla, opción de volver y resumen antes de confirmar. La accesibilidad está integrada y sus preferencias generales se pueden ajustar cuando haga falta.

### 1. Tamaño de botones
- El recorrido usa acciones amplias y horarios seleccionables, con áreas de interacción cómodas en todos los pasos.
- Tamaño de botones ajustable desde Accesibilidad sin cambiar de formulario.

### 2. Contraste e identidad visual
- Paleta inspirada en los azules y el acento dorado observados en el portal del IESS y descritos en el análisis cromático de la Tarea 3: azul oscuro #0E3A65, azul medio #1B4F91 y dorado #F2B705. Es una adaptación para el prototipo, no una reproducción completa del manual de marca. El dorado se reserva para resaltar detalles y no para texto pequeño sobre blanco.
- Texto principal #17223b sobre superficies blancas o gris claro.
- Alto contraste con superficies negras y texto blanco en el encabezado y ayudas.
- Foco con contorno blanco de 3px y anillo oscuro de 6px. La conformidad de todos los estados requiere medir sus combinaciones de color.

### 3. Tipografía
- Base system-ui sans-serif 16px.
- La tipografía base mantiene legibilidad y puede ampliarse desde Accesibilidad.
- Sin serifas, interlineado 1.5.

### 4. Cantidad de información
- Una tarea por pantalla: datos, profesional y fecha/hora; confirmación en un resumen separado.
- Permite volver sin perder la información ya ingresada.

### 5. Mensajes de error
- `role=alert`, ejemplo de corrección: "Escribe únicamente los últimos 4 números. Ejemplo: 4567."
- Mensajes directos con ejemplos de corrección; foco en el campo que necesita atención.
- Errores vinculados a sus campos mediante `aria-invalid` y `aria-describedby`.

### 6. Navegación teclado
- Todo con Tab / Shift+Tab / Enter.
- Skip links "Saltar al contenido".
- Sin dependencia de hover o drag.
- Foco visible de doble color para identificar el control activo.

### 7. Lector pantalla
- Diseñado para NVDA/JAWS: labels asociados, h1 único, fieldset y `aria-live=polite` para anuncios. La compatibilidad debe validarse manualmente.
- Botón 🔊 lee con speechSynthesis + texto en live region.
- Alt / aria-label en avatar, video, grupos horas.

### 8. Multimedia
- Ejercicios: video MP4 reproducible con subtítulos WebVTT, póster y transcripción escrita.
- Ejercicios: video MP4 reproducible con subtítulos WebVTT, póster y transcripción escrita.

## Cómo probarlo
1. `cd frontend && npm run dev`
2. Ir a Solicitar cita, completar los tres pasos, volver para corregir y revisar el resumen antes de confirmar.
3. Probar solo teclado: Tab hasta confirmar.
4. Probar lector: NVDA/JAWS + Tab y registrar cuáles errores anuncia realmente.
5. Mostrar Historial: guarda datos sanitizados únicamente durante la sesión del navegador (sin backend).
6. Activar la lectura mediante el botón o la tecla de acceso `L` (el modificador depende del navegador y sistema operativo).

## Frase para defender
> "Los perfiles orientaron la accesibilidad, pero no le pedimos al paciente que se clasifique ni que elija un formulario. Todas las personas siguen el mismo recorrido claro, con ajustes disponibles cuando los necesitan."

## Decisiones frente a las páginas analizadas

El problema del proyecto es que las personas puedan conocer la atención de rehabilitación, encontrar un profesional y solicitar una cita con claridad. La comparación de IESS, Hospital Vozandes y Hospital Metropolitano se usó como referencia; no se copió ninguna página completa.

| Referente | Se tomó o adaptó | Se dejó fuera | Motivo relacionado con el problema |
|---|---|---|---|
| IESS | Azul institucional, acento dorado, acceso visible a citas y tarjetas de acceso directo. | Banner rotativo institucional, accesos de empleadores y afiliación, noticias y trámites generales. | El prototipo se concentra en rehabilitación en Guaranda y evita contenido que distraiga de encontrar atención y reservar. |
| Hospital Vozandes | Jerarquía clara para la acción de agendar y organización visual por secciones. | Panel promocional, campañas, accesos institucionales y estilo vino/magenta. | Las promociones no ayudan a completar el recorrido de rehabilitación; se conserva la identidad del IESS para que el origen del servicio se entienda. |
| Hospital Metropolitano | La idea de localizar profesionales y presentar disponibilidad de forma comparable. | Buscador masivo paginado, indicadores NPS/semáforo, blog y múltiples CTAs naranja. | Se incorpora una búsqueda sencilla por nombre o especialidad y una tabla semanal simulada; no se incorporan métricas que no forman parte de la atención ni hay datos para respaldarlas. |

### Elementos comunes que sí responden al proyecto

Las tres referencias priorizan navegación reconocible, identidad visual consistente, accesos a servicios y llamadas a la acción distinguibles. Adaptamos esos patrones en el menú principal, el acceso “Solicitar una cita”, las tarjetas de servicios, la búsqueda de profesionales y el calendario de cupos. Mantenemos el lenguaje y el alcance de un prototipo académico, sin presentar los datos simulados como servicios oficiales en línea.
