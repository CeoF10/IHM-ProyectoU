# Sistema Web de Atención al Servicio de Rehabilitación del IESS Guaranda

Proyecto académico - Interacción Hombre-Máquina (IHM) - 6to semestre Ingeniería en Software.

**Enfoque empresa:** Scrum + Diseño Centrado en el Usuario (DCU), solo frontend (sin backend por requerimiento docente).

## Estructura
- `docs/` - Charter, mapa de navegación, análisis IHM y protocolo de evaluación
- `src/` - Prototipo funcional desarrollado con React y Vite

## Funciones solicitadas (simuladas sin backend)
1. Registro de usuario
2. Solicitud de citas
3. Consulta de especialistas
4. Calendario de disponibilidad
5. Historial de citas
6. Recomendaciones de ejercicios
7. Recordatorios
8. Información de centros de atención

## Reto IHM principal
Diseñar pantalla de solicitud de cita para:
- Persona joven
- Adulto mayor
- Persona con discapacidad visual o motriz

Evaluado en 8 ítems: tamaño botones, contraste, tipografía, cantidad información, mensajes error, navegación teclado, lectores pantalla, multimedia.

## Metodología
Fase 0: Charter -> Fase 1: Investigación -> Fase 2: Diseño -> Fase 3: Prototipo -> Fase 4: Evaluación

## Estado actual
- Inicio con accesos a las ocho funciones, paleta azul y dorado inspirada en el IESS, y ajustes de lectura y controles.
- Diagrama de casos de uso en `diagramas/` y entrega de la Tarea 4 en `entregas-docente/tarea-04/`.
- Charter, mapa de navegación y análisis IHM documentados.
- Prototipo de las 8 funciones implementado con datos simulados.
- Solicitud de cita en un único recorrido de tres pasos, con opción de volver, resumen previo y controles generales de accesibilidad.
- Identidad visual adaptada a la paleta institucional azul y dorado del IESS; búsqueda local de profesionales por nombre o especialidad.
- Decisiones de adopción y descarte de los referentes IESS, Hospital Vozandes y Hospital Metropolitano documentadas en `docs/03-analisis-ihm.md`.
- Evaluación manual con teclado y lector de pantalla pendiente de registrar.

## Enunciado del proyecto transcrito de las capturas

### Tema

Sistema web de atención al servicio de rehabilitación del IESS en la ciudad de Guaranda.

### Problema

Los usuarios de centros de salud o rehabilitación pueden tener dificultades para conocer los servicios disponibles, solicitar una cita y consultar recomendaciones o ejercicios.

### Funciones solicitadas

1. Registro de usuario.
2. Solicitud de citas.
3. Consulta de especialistas.
4. Calendario de disponibilidad.
5. Historial de citas.
6. Recomendaciones de ejercicios.
7. Recordatorios.
8. Información de centros de atención.

### Reto de interacción

Diseñar la pantalla de solicitud de cita para personas jóvenes, adultos mayores y personas con discapacidad visual o motriz. La interfaz debe considerar:

- Tamaño de botones.
- Contraste.
- Tipografía.
- Cantidad de información.
- Mensajes de error.
- Navegación mediante teclado.
- Compatibilidad con lectores de pantalla.
- Herramientas multimedia.

Los perfiles orientan las decisiones de accesibilidad; el prototipo no le pide al paciente que se clasifique ni que elija entre distintos formularios. Toda persona sigue un recorrido de tres pasos y puede ajustar texto, contraste o tamaño de botones desde Accesibilidad.

**Nota sobre la captura:** el enunciado lista ocho criterios, pero también parece mencionar una calificación para “5 ítems” de 0,25. Conviene confirmar ese detalle con la docente porque el número no coincide con la lista.

## Identidad visual aplicada

El prototipo mantiene tres colores de marca: azul oscuro `#0E3A65`, azul `#1B4F91` y dorado `#F2B705`. El resto de la interfaz usa blanco, grises y fondos azul muy claro para lectura y contraste. Los tonos verdes del tema anterior se retiraron. El diseño toma como referencia el portal y el análisis cromático del IESS, sin copiar su logotipo ni presentar el prototipo como un servicio oficial.

### Guía de diseño

- **Azul oscuro:** encabezados, texto sobre botones dorados y zonas principales de navegación.
- **Azul:** acciones principales, enlaces activos, selección de horarios e indicadores informativos.
- **Dorado:** llamadas a la acción principales y pequeños acentos. No se usa en texto pequeño sobre blanco.
- **Orden de la página de inicio:** presentar primero el propósito y el botón para solicitar cita; después mostrar accesos a profesionales, disponibilidad, ejercicios, recordatorios, centro y registro.
- **Prioridad de contenido:** cada pantalla debe resolver una tarea relacionada con rehabilitación. Noticias generales, promociones, métricas de satisfacción y trámites que no pertenecen a este servicio se mantienen fuera.
- **Estados funcionales:** éxito y disponibilidad usan azules; las alertas de error o cancelación mantienen señales legibles, pero no forman parte de los tres colores de marca.

## Ejecutar el prototipo
```bash
npm install
npm run dev
```

No se envían datos a un servidor. Las citas permanecen en `sessionStorage` y desaparecen al cerrar la pestaña; el identificador personal nunca se almacena.

## Usar los datos simulados

El proyecto funciona como prototipo frontend y no necesita backend. Desde Inicio o desde **Mis citas**, pulsa **Cargar citas de ejemplo** para agregar dos citas futuras con el nombre genérico “Paciente de demostración”. Las citas llevan los códigos `DEMO-001` y `DEMO-002` y se marcan como ficticias.

Con esos ejemplos puedes mostrar:

- El historial y los estados de las citas.
- Los recordatorios de próximas citas.
- La reprogramación y cancelación; los cambios solo afectan los datos locales de la sesión.
- La disponibilidad, que se actualiza al reservar o cancelar horarios.

También puedes crear una cita manualmente desde **Solicitar cita** con cualquier nombre de prueba. El formulario no requiere una cédula real: el código de cuatro dígitos se valida solo en el navegador y nunca se guarda. Usa nombres inventados; al cerrar la pestaña se borran las citas de la sesión. Las especialidades, profesionales, horarios y datos del centro son información de ejemplo, no disponibilidad oficial del IESS.

## Dirección visual para el portal

Se aplicó la skill `frontend-design` al problema específico del proyecto: ayudar a pacientes de rehabilitación en Guaranda a entender la oferta y comenzar una solicitud de cita. La portada usa un diagrama original de movimiento de hombro como firma visual, no una ilustración de stock ni un banner promocional.

### Sistema visual

- Azul petróleo `#0E3A65`: panel de cita, encabezados y navegación principal.
- Azul IESS `#1B4F91`: enlaces, iconos e indicadores seleccionados.
- Dorado `#F2B705`: acciones principales y trayectoria de movimiento de la ilustración.
- Azul niebla `#EAF1F8`: información de apoyo y superficies seleccionadas.
- Fondo `#F5F7FA` y tinta `#17223B`: lectura y estructura.
- Titulares en Trebuchet MS; texto y formularios en Verdana, con fuentes locales de reserva. Controles y texto se mantienen grandes y legibles.

### Distribución

```text
┌ Marca y navegación ──────────────────────────────────────────────┐
│ Propósito y pasos       Movimiento de hombro       Solicita cita │
├ Ya tienes una cita? ─────────────────────────────────────────────┤
│ Organiza tu atención                 Orientación para ti          │
│ Profesionales · Cupos · Centro       Ejercicios · Avisos · Registro│
├ Ajustes de accesibilidad ────────────────────────────────────────┤
```

En móvil, la ilustración decorativa se oculta y la portada conserva primero el formulario de cita; el resto de los servicios pasa a una columna. Los formularios internos usan superficies claras, etiquetas visibles, selección azul y una llamada principal dorada. No usamos tarjetas idénticas para todos los servicios: los accesos aparecen como filas agrupadas para reducir ruido y apoyar la exploración.

### Revisión frente al problema

La primera propuesta seguía una plantilla habitual de hero, cuadrícula de tarjetas y fondo degradado; aunque contenía las funciones, no expresaba el tema de rehabilitación. La revisé para que el movimiento corporal sea el gesto visual propio del proyecto y para que el selector de especialidad sea el primer paso real de la reserva. Se excluyen contenido noticioso, campañas, métricas sin datos y elementos institucionales que no ayudan a agendar o encontrar orientación.

Las pruebas de compilación, lint y utilidades están descritas en la entrega de esta iteración. La evaluación con pacientes y con lectores de pantalla sigue pendiente.
