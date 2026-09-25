# Entrega del proyecto · Interacción Hombre–Máquina

**Tema:** Sistema web de atención al servicio de rehabilitación del IESS en Guaranda

**Asignatura:** Interacción Hombre–Máquina · Universidad Estatal de Bolívar

**Integrantes:** Neicer Jimenez y Andony Cortez · Grupo 6

**Docente:** Ing. Mónica Bonilla

## Acceso para la revisión

- [Abrir el prototipo publicado](https://ceof10.github.io/IHM-ProyectoU/)
- [Consultar el código y la documentación](https://github.com/CeoF10/IHM-ProyectoU)

La página es un **prototipo académico**. No pertenece al IESS ni consulta sus sistemas; los profesionales, cupos y citas son simulados. El registro y las citas de demostración duran la sesión del navegador. La identificación ingresada en la solicitud se valida y no se guarda.

## Documentos de entrega

| Documento | Contenido |
|---|---|
| [Tarea 3 · PDF original](entregas-docente/tarea-03/Tarea%20%233.pdf) | Comparación de tres portales de salud y decisiones de diseño. |
| [Tarea 4 · PDF original](entregas-docente/tarea-04/Tarea%20%234.pdf) | Diagrama y explicación inicial de los casos de uso. |
| [Tarea 5 · PDF original](entregas-docente/tarea-05/TAREA%20N5%20CORTEZ%20JIMENEZ%20%281%29.pdf) | Elementos de interfaz y su función. |
| [Diagrama editable actualizado](diagramas/casos-de-uso-funcionalidades.drawio) | Un actor, **Paciente**, que puede corresponder a cualquiera de los tres perfiles del enunciado. |
| [Alcance y requisitos actuales](docs/01-project-charter.md) | Problema, objetivo, ocho funciones y criterios de IHM. |
| [Mapa de navegación](docs/02-mapa-navegacion.md) | Secciones y recorrido de solicitud. |
| [Análisis IHM del prototipo](docs/03-analisis-ihm.md) | Decisiones de interfaz, accesibilidad y relación con las tareas previas. |
| [Protocolo de evaluación](docs/04-protocolo-evaluacion.md) | Actividades y métricas para evaluar con participantes; no presenta resultados inventados. |
| [Presentación complementaria](entregas-docente/material-complementario/Dominios_Alojamiento_IESS_mismo_diseno.pptx) | Dominios y alojamiento web aplicados al mismo tema. |

Los tres PDF y la presentación son copias **sin modificar** de los archivos originales del primer parcial. Las tareas 1 (historia de IHM) y 2 (color rosa) no se incluyen porque no son entregables específicos de este sistema. El borrador DOCX de la tarea 5 tampoco se duplica: se entrega su PDF final.

## Qué demuestra el prototipo

La dificultad planteada es encontrar información de rehabilitación, solicitar una cita y consultar recomendaciones o ejercicios. La interfaz muestra registro, solicitud de citas, profesionales, disponibilidad, historial, ejercicios, recordatorios e información del centro.

La **solicitud es un único recorrido**: datos → profesional → fecha y hora → revisión y confirmación. Está diseñada para personas jóvenes, adultos mayores y personas con discapacidad visual o motriz. Son tres perfiles para evaluar la usabilidad, **no tres actores ni tres formularios**. Se ofrecen texto y controles ampliables, alto contraste, navegación por teclado, etiquetas y mensajes de error, lectura de voz opcional, videos con subtítulos y transcripción.

Los PDF de las tareas anteriores documentan decisiones tomadas en ese momento. Cuando difieren del prototipo final, prevalecen el [análisis IHM actual](docs/03-analisis-ihm.md) y la implementación: se unificó el formulario que la tarea 4 planteaba en tres presentaciones y el campo de cédula usa diez dígitos, en lugar de los cuatro citados como ejemplo en la tarea 5. El diagrama editable representa la versión actual.

## Recorrido sugerido para la exposición

1. Abrir el sitio, mostrar el problema y entrar en **Solicitar cita**.
2. Completar el formulario único, probar una validación, elegir profesional y cupo, revisar el resumen y confirmar.
3. Abrir **Mis citas** para mostrar historial, reprogramación, cancelación y recordatorios. Desde **Datos y privacidad** se pueden cargar dos citas ficticias para la demostración.
4. Abrir profesionales, disponibilidad, ejercicios y centro de atención para mostrar las otras funciones.
5. Activar texto grande, alto contraste, botones grandes y lectura por voz desde **Accesibilidad**; recorrer los controles con Tab.

Para ejecutarlo localmente desde la raíz de este repositorio: `npm ci`, `npm run dev`. La verificación técnica usa `npm test`, `npm run lint` y `npm run build`. Las pruebas con participantes y con lector de pantalla se describen en el protocolo y siguen pendientes; no se afirma que el prototipo haya superado una evaluación con usuarios reales.
