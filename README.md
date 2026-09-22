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
- Solicitud de cita disponible como vista rápida, guía paso a paso y accesibilidad reforzada, sin pedir que la persona se clasifique.
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

Los perfiles orientan las decisiones de accesibilidad; el prototipo deja que cada persona elija el formato de interacción sin pedirle que se clasifique por edad o discapacidad.

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

## Rediseño del portal de atención

La dirección es un portal de rehabilitación claro y cercano. El problema central guía cada cambio: conocer los servicios, solicitar una cita y consultar ejercicios. Se utiliza la skill `frontend-design` de Anthropic, instalada en las skills personales de Codex.

### Plan y decisiones

1. Portada clara con título concreto y un selector de atención que permite comenzar la cita desde Inicio.
2. Panel azul para solicitar atención; dorado reservado a su acción principal.
3. Acceso independiente a Mis citas para personas que ya reservaron.
4. Servicios agrupados por intención: organizar la atención y encontrar orientación.
5. Iconos de calendario, profesionales, ubicación y ejercicios en lugar de numerar funciones sin orden secuencial.
6. Encabezados internos breves, con más espacio para los formularios y menos espacio decorativo.
7. Tipografía humanista sans-serif con Verdana/Trebuchet como fuentes locales, tamaños de lectura cómodos y líneas cortas.
8. Tarjetas de profesionales e historial con información jerarquizada y acciones visibles.
9. Tres modos de solicitud diferenciados por sus ayudas, conservando los datos al cambiar de formato.
10. Foco visible, controles táctiles amplios, diseño adaptable y respeto a movimiento reducido.
11. Mantener azul oscuro #0E3A65, azul #1B4F91 y dorado #F2B705; blanco y tonos neutros para superficies. Rojo únicamente para errores y acciones destructivas.
12. Revisar escritorio y móvil, búsqueda y solicitud de citas. Las pruebas con participantes y lectores de pantalla siguen pendientes.

La revisión de la propuesta eliminó el gran bloque degradado, las tarjetas numeradas y las etiquetas decorativas repetidas. El elemento principal será el selector de atención, porque permite comenzar la tarea que motivó el proyecto.
