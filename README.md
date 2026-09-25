# Rehabilitación IESS Guaranda — prototipo académico

Aplicación React y Vite para explorar la atención de rehabilitación en Guaranda. Es una demostración de Interacción Hombre–Máquina: no está conectada al IESS y no crea citas reales.

La cabecera usa el [logotipo publicado por el IESS](https://www.iess.gob.ec/wp-content/themes/s5_business_line/images/s5_logo.png) y el azul `#004394` de su [portal oficial](https://www.iess.gob.ec/). La identidad se usa como referencia académica; el contenido, los profesionales y los horarios de esta aplicación son simulados.

La solicitud de cita usa **un solo recorrido de tres pasos** para todas las personas: datos, profesional y fecha/hora. Después muestra un resumen antes de confirmar. Quien necesite ayudas puede ampliar el texto, aumentar los controles, activar alto contraste o usar la lectura por voz. El diseño se orienta a personas jóvenes, adultos mayores y personas con discapacidad visual o motriz sin pedirles que se clasifiquen.

## Funciones

1. Registro de demostración.
2. Solicitud y confirmación de citas.
3. Consulta de profesionales.
4. Disponibilidad por día y profesional.
5. Historial, reprogramación y cancelación.
6. Ejercicios con video subtitulado y transcripción.
7. Recordatorios de próximas citas.
8. Información del centro.

Todas usan datos simulados. Los horarios no permiten reservar una hora pasada ni una ocupada en la sesión.

## Ejecutar

Se necesita Node.js compatible con Vite 8.

```bash
npm ci
npm run dev
```

Para comprobar el proyecto:

```bash
npm test
npm run lint
npm run build
```

Desde Inicio se pueden cargar dos citas ficticias para mostrar historial, recordatorios, reprogramación y cancelación. Usa nombres inventados en las pruebas. Las citas se guardan solo en `sessionStorage` y las preferencias de accesibilidad en `localStorage`; los cuatro dígitos solicitados en el formulario no se guardan.

## Organización

- `src/App.jsx`: navegación, preferencias y estado de citas.
- `src/components/`: inicio, solicitud guiada y secciones informativas.
- `src/utils/appointments.js`: reglas de disponibilidad, recordatorios y datos de demostración.
- `src/data/mock.js`: profesionales, ejercicios y centro ficticios.
- `public/ejercicios/`: video, subtítulos y recurso visual.
- `docs/`: charter, mapa de navegación, análisis IHM y protocolo de evaluación.
- `diagramas/` y `entregas-docente/`: material de las entregas académicas.

La [evaluación con participantes y lector de pantalla](docs/04-protocolo-evaluacion.md) sigue pendiente. Las pruebas técnicas no sustituyen esa evaluación.
