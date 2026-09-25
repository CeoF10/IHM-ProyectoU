# 03 - Análisis IHM (para exponer ante la docente)

## Reto: una solicitud simple, guiada y accesible

Los tres perfiles del enunciado usan la misma pantalla de solicitud. El recorrido tiene tres pasos, con una tarea por pantalla, opción de volver y resumen antes de confirmar. La accesibilidad está integrada y sus preferencias generales se pueden ajustar cuando haga falta, sin pedir a nadie que declare edad o discapacidad.

## Cómo responde a los tres tipos de usuarios

- **Persona joven:** el recorrido comienza directamente desde Inicio o Nueva cita, muestra el avance y permite revisar los datos antes de confirmar.
- **Adulto mayor:** presenta una tarea por paso, instrucciones breves, controles amplios y opciones para aumentar el texto y los botones.
- **Persona con discapacidad visual o motriz:** ofrece etiquetas asociadas, errores anunciados y vinculados al campo, navegación por teclado, foco visible, lectura opcional por voz y controles amplios. La compatibilidad con lectores de pantalla debe comprobarse con pruebas manuales.

Son necesidades de diseño, no categorías que la persona deba declarar. Cualquier usuario puede activar las mismas ayudas.

### 1. Tamaño de botones
- El recorrido usa acciones amplias y horarios seleccionables, con áreas de interacción cómodas en todos los pasos.
- Tamaño de botones ajustable desde Accesibilidad sin cambiar de formulario.

### 2. Contraste e identidad visual
- La cabecera adopta el azul `#004394` y el logotipo blanco publicados en [iess.gob.ec](https://www.iess.gob.ec/). El azul profundo `#092766` y el azul medio `#294e9b` aparecen en los estilos del portal; blanco y azul claro mantienen la lectura del prototipo. Los botones, acentos y estados usan esta misma familia de azules.
- El logotipo identifica la referencia institucional, mientras los rótulos «Prototipo académico» y «No es un sitio oficial» distinguen la demostración del servicio real.
- Texto principal #17223b sobre superficies blancas o gris claro.
- Alto contraste con superficies negras y texto blanco en el encabezado y ayudas.
- Foco con contorno blanco de 3px y anillo oscuro de 6px. La conformidad de todos los estados requiere medir sus combinaciones de color.

### 3. Tipografía
- Base Verdana con reserva sans-serif, 16px.
- La tipografía base mantiene legibilidad y puede ampliarse desde Accesibilidad.
- Sin serifas, interlineado 1.5.

### 4. Cantidad de información
- Una tarea por pantalla: datos, profesional y fecha/hora; confirmación en un resumen separado.
- Permite volver sin perder la información ya ingresada.

### 5. Mensajes de error
- `role=alert`, ejemplo de corrección: "Escribe únicamente los últimos 4 números. Ejemplo: 4567."
- Mensajes directos con ejemplos de corrección; el foco pasa al mensaje de error.
- Errores vinculados a sus campos mediante `aria-invalid` y `aria-describedby`.

### 6. Navegación teclado
- Todo con Tab / Shift+Tab / Enter.
- Skip links "Saltar al contenido".
- Sin dependencia de hover o drag.
- Foco visible de doble color para identificar el control activo.

### 7. Lector pantalla
- Preparado con etiquetas asociadas, un h1 por pantalla, nombres accesibles para los profesionales y regiones de estado. La compatibilidad con NVDA/JAWS debe validarse manualmente.
- La lectura por voz es opcional y usa `speechSynthesis`; la información permanece escrita.
- Los avatares decorativos se ocultan al lector; las horas se agrupan bajo una etiqueta y el video tiene subtítulos y transcripción.

### 8. Multimedia
- Ejercicios: video MP4 reproducible con subtítulos WebVTT, póster y transcripción escrita.

## Cómo probarlo
1. `cd frontend && npm run dev`
2. Ir a Solicitar cita, completar los tres pasos, volver para corregir y revisar el resumen antes de confirmar.
3. Probar solo teclado: Tab hasta confirmar.
4. Probar lector: NVDA/JAWS + Tab y registrar cuáles errores anuncia realmente.
5. Mostrar Historial: guarda datos sanitizados únicamente durante la sesión del navegador (sin backend).
6. Activar «Escuchar página» desde Accesibilidad y «Escuchar resumen» antes de confirmar.

## Frase para defender
> "Los perfiles orientaron la accesibilidad, pero no le pedimos al paciente que se clasifique ni que elija un formulario. Todas las personas siguen el mismo recorrido claro, con ajustes disponibles cuando los necesitan."

## Decisiones frente a las páginas analizadas

El problema del proyecto es que las personas puedan conocer la atención de rehabilitación, encontrar un profesional y solicitar una cita con claridad. La comparación de IESS, Hospital Vozandes y Hospital Metropolitano se usó como referencia; no se copió ninguna página completa.

| Referente | Se tomó o adaptó | Se dejó fuera | Motivo relacionado con el problema |
|---|---|---|---|
| IESS | Azul institucional, logotipo blanco, acceso visible a citas y tarjetas de acceso directo. | Banner rotativo institucional, accesos de empleadores y afiliación, noticias y trámites generales. | El prototipo se concentra en rehabilitación en Guaranda y evita contenido que distraiga de encontrar atención y reservar. |
| Hospital Vozandes | Jerarquía clara para la acción de agendar y organización visual por secciones. | Panel promocional, campañas, accesos institucionales y estilo vino/magenta. | Las promociones no ayudan a completar el recorrido de rehabilitación; se conserva la identidad del IESS para que el origen del servicio se entienda. |
| Hospital Metropolitano | La idea de localizar profesionales y presentar disponibilidad de forma comparable. | Buscador masivo paginado, indicadores NPS/semáforo, blog y múltiples CTAs naranja. | Se incorpora una búsqueda sencilla por nombre o especialidad y una tabla de próximos días laborables; no se incorporan métricas que no forman parte de la atención ni hay datos para respaldarlas. |

### Elementos comunes que sí responden al proyecto

Las tres referencias priorizan navegación reconocible, identidad visual consistente, accesos a servicios y llamadas a la acción distinguibles. Adaptamos esos patrones en el menú principal, el acceso “Solicitar una cita”, las tarjetas de servicios, la búsqueda de profesionales y el calendario de cupos. Mantenemos el lenguaje y el alcance de un prototipo académico, sin presentar los datos simulados como servicios oficiales en línea.
