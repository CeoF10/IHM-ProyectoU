# Rehabilitación IESS Guaranda — prototipo académico

Aplicación React y Vite para explorar la atención de rehabilitación en Guaranda. Es una demostración de Interacción Hombre–Máquina: no está conectada al IESS y no crea citas reales.

**Sitio publicado:** [ver el prototipo en GitHub Pages](https://ceof10.github.io/IHM-ProyectoU/).

**Entrega para la docente:** [documentos originales, diagrama actualizado y guía de exposición](ENTREGA.md).

La cabecera usa el [logotipo publicado por el IESS](https://www.iess.gob.ec/wp-content/themes/s5_business_line/images/s5_logo.png) y el azul `#004394` de su [portal oficial](https://www.iess.gob.ec/). La identidad se usa como referencia académica; el contenido, los profesionales y los horarios de esta aplicación son simulados.

La solicitud de cita usa **un solo recorrido de tres pasos** para todas las personas: datos, profesional y fecha/hora. Después muestra un resumen antes de confirmar. Quien necesite ayudas puede ampliar el texto, aumentar los controles, activar alto contraste o usar la lectura por voz. El diseño se orienta a personas jóvenes, adultos mayores y personas con discapacidad visual o motriz sin pedirles que se clasifiquen.

## Funciones

1. Registro local de nombre y correo para esta sesión.
2. Solicitud y confirmación de citas.
3. Consulta de profesionales.
4. Disponibilidad por día y profesional.
5. Historial, reprogramación y cancelación.
6. Ejercicios con video subtitulado y transcripción.
7. Recordatorios de próximas citas.
8. Información del centro.

Las citas y los horarios usan datos simulados; la dirección, el teléfono y la foto del hospital proceden del IESS. Los horarios no permiten reservar una hora pasada ni una ocupada en la sesión. Desde «Disponibilidad» se puede elegir un cupo para iniciar la misma solicitud guiada con profesional y fecha preparados.

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

Desde «Mis citas» → «Datos y privacidad» se pueden cargar dos citas ficticias para mostrar historial, recordatorios, reprogramación y cancelación. Usa nombres inventados en las pruebas. Las citas y los datos de registro se guardan solo en `sessionStorage` y las preferencias de accesibilidad en `localStorage`; los diez dígitos de la cédula solicitados en el formulario no se guardan.

## Organización

- `src/App.jsx`: navegación, preferencias y estado de citas.
- `src/components/`: inicio, solicitud guiada y secciones informativas.
- `src/utils/appointments.js`: reglas de disponibilidad, recordatorios y datos de demostración.
- `src/data/mock.js`: profesionales y horarios ficticios; datos de contacto verificados del hospital.
- `public/ejercicios/`: videos, subtítulos y miniaturas extraídas de esos videos.
- `public/profesionales/`: retratos ilustrativos generados para las fichas ficticias.
- `public/centro/`: fotografía institucional del Hospital de Guaranda.
- `public/inicio/`: fotografía ilustrativa generada para la portada; no representa un centro ni personal real del IESS.
- `docs/`: charter, mapa de navegación, análisis IHM y protocolo de evaluación.
- `diagramas/`: caso de uso editable de la versión actual.
- `entregas-docente/`: PDF originales de las tareas 3, 4 y 5, más la presentación complementaria.

La [evaluación con participantes y lector de pantalla](docs/04-protocolo-evaluacion.md) sigue pendiente. Las pruebas técnicas no sustituyen esa evaluación.

La dirección y el teléfono del centro proceden del [directorio de unidades médicas del IESS](https://www.iess.gob.ec/es/mapa-de-unidades-medicas). La fotografía de la fachada procede del [Plan Médico Funcional del Hospital de Guaranda](https://www.iess.gob.ec/documents/10162/3321619/PMF+HOSPITAL+GUARANDA.pdf), publicado por el IESS. Las fichas de profesionales y sus retratos son referenciales, no identifican a personal real.
