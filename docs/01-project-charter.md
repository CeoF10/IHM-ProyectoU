# 01 · Alcance y requisitos del proyecto

## Problema y objetivo

Los usuarios de un centro de salud o rehabilitación pueden tener dificultades para conocer los servicios disponibles, solicitar una cita y consultar recomendaciones o ejercicios. El proyecto propone un prototipo web navegable para la atención de rehabilitación del IESS en Guaranda que reúna esas tareas y facilite la solicitud de cita.

El reto de IHM es que **una misma solicitud** resulte comprensible y operable para tres perfiles de evaluación: persona joven, adulto mayor y persona con discapacidad visual o motriz. No se pide al usuario elegir perfil. En el diagrama hay un único actor, **Paciente**.

## Alcance

El entregable es una aplicación frontend con información y datos de demostración. Las citas y el registro local duran la sesión del navegador; las preferencias de accesibilidad pueden conservarse en el navegador. El número de cédula se valida como diez dígitos y se descarta antes de guardar la cita. No hay backend, cuenta real ni conexión a los sistemas del IESS.

| Función requerida | Comportamiento del prototipo |
|---|---|
| Registro de usuario | Nombre y correo locales para la sesión. |
| Solicitud de citas | Datos, profesional, fecha/hora y revisión antes de confirmar. |
| Consulta de especialistas | Fichas y búsqueda de profesionales ficticios. |
| Calendario de disponibilidad | Cupos simulados por profesional y día. |
| Historial de citas | Consulta, reprogramación y cancelación de citas de la sesión. |
| Recomendaciones de ejercicios | Videos, subtítulos y transcripción. |
| Recordatorios | Avisos de próximas citas dentro del sitio. |
| Información de centros | Datos de contacto y referencia del Hospital de Guaranda. |

Los nombres, retratos de profesionales y horarios son referenciales. La dirección, el teléfono y la fotografía institucional del hospital se identifican y atribuyen en el [README](../README.md).

## Criterios de IHM

La solicitud distribuye la información en pasos y permite regresar sin perder datos. En la evaluación se deben revisar tamaño de botones, contraste, tipografía, cantidad de información, mensajes de error, navegación con teclado, compatibilidad con lectores de pantalla y recursos multimedia. La aplicación ofrece ajustes generales de texto, contraste y controles, además de lectura por voz opcional. El [análisis IHM](03-analisis-ihm.md) detalla la implementación y el [protocolo](04-protocolo-evaluacion.md) define cómo comprobarla con participantes.

La meta de completar una cita en menos de tres minutos es **un criterio de evaluación propuesto**, no un resultado medido con usuarios. La validación técnica del prototipo se registra por separado en el protocolo.
