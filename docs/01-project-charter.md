# 01 - Project Charter + Requerimientos

## 1. Visión
Crear un sistema web accesible e inclusivo para el servicio de rehabilitación del IESS Guaranda, que permita a cualquier ciudadano conocer servicios, solicitar citas y consultar ejercicios, priorizando usabilidad para jóvenes, adultos mayores y personas con discapacidad.

## 2. Problema
Los usuarios tienen dificultades para conocer servicios disponibles, solicitar una cita y consultar recomendaciones o ejercicios.

## 3. Objetivos
- O1: Diseñar flujo de solicitud de cita usable en < 3 minutos.
- O2: Cumplir 8 criterios IHM del reto (0.25 pts c/u).
- O3: Prototipo frontend navegable sin backend, con datos mock.

## 4. Alcance
**Incluye:**
- Las 8 funciones simuladas con datos mock y almacenamiento temporal de sesión, sin BD ni API real.
- Foco total en una solicitud de cita guiada, accesible y de un solo recorrido.
- Documentación de análisis IHM.

**No incluye:**
- Backend, base de datos real, autenticación real, despliegue productivo.

## 5. Stakeholders / Roles (simulación empresa)
- Product Owner (Tú): define prioridad
- UX Researcher: personas, journeys
- UI Designer: wireframes, 3 variantes
- Frontend Dev: React prototipo
- QA Accesibilidad: checklist WCAG, teclado, lector pantalla

## 6. Requerimientos funcionales (RF simulados)
- RF1 Registro de usuario: formulario validado, mensajes error claros.
- RF2 Solicitud de citas: seleccionar especialidad, especialista, fecha/hora, confirmar.
- RF3 Consulta especialistas: lista con identificador visual, especialidad y horario.
- RF4 Calendario disponibilidad: vista semanal, slots libres/ocupados.
- RF5 Historial citas: tabla con estado (pendiente, atendida, cancelada).
- RF6 Recomendaciones ejercicios: fichas simuladas con referencia multimedia + descripción.
- RF7 Recordatorios: banners/alertas simuladas.
- RF8 Info centros: dirección, mapa, contacto IESS Guaranda.

## 7. Requerimientos no funcionales IHM (los 8 ítems evaluados)
1. Tamaño botones: min 44x44px, en variante adulto mayor/discapacidad 56-64px.
2. Contraste: AA mínimo 4.5:1, texto/fondo.
3. Tipografía: sans-serif 16px base, 18-20px adulto mayor, escalable.
4. Cantidad información: progresiva, 1 tarea por pantalla, sin sobrecarga.
5. Mensajes error: visibles, lenguaje simple, ejemplo corrección.
6. Navegación teclado: orden de Tab lógico, foco visible, Enter/Espacio accionan.
7. Lector pantalla: labels, aria-label, roles, alt en imágenes, h1 único.
8. Multimedia: iconos + texto, video ejercicios subtitulado, audio opcional.

## 8. Decisión sobre el flujo de interacción
Los perfiles de investigación orientan el diseño, pero la interfaz no obliga a nadie a declarar su edad ni una discapacidad. La solicitud tiene un único recorrido de tres pasos: datos, profesional y fecha/hora; después se presenta un resumen para revisar antes de confirmar. Esto evita que la persona tenga que entender y elegir entre varios formularios antes de empezar. El tamaño del texto, contraste y botones se ajustan desde Accesibilidad y las etiquetas, el orden de teclado y los mensajes claros están integrados en el flujo.

## 9. Backlog inicial (Scrum)
- Sprint 0: Charter + mapa navegación [HECHO]
- Sprint 1: Mapa + prototipo React de solicitud accesible en 3 pasos [HECHO]
- Sprint 2: Resto de pantallas mock [HECHO] + evaluación heurística [PENDIENTE]
- Sprint 3: Informe final + presentación [PENDIENTE]

## 10. Riesgos
- Querer hacer backend cuando docente dijo sin backend -> mitigación: usar mocks.
- Sobrecargar pantalla con información -> mitigación: diseño progresivo.

---
Siguiente etapa: registrar la evaluación heurística y las pruebas manuales de accesibilidad.
