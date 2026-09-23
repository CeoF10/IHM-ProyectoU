# 02 - Mapa de navegación

## Punto de entrada

`Sistema web de atención - Rehabilitación`

## Navegación principal

```text
Inicio
├── Solicitar cita
│   ├── 1. Datos de la persona
│   ├── 2. Profesional
│   ├── 3. Fecha y hora
│   └── Revisar y confirmar
├── Especialistas
├── Calendario
├── Historial
├── Ejercicios
├── Recordatorios
├── Centros
└── Registro
```

## Flujo principal de cita

```text
Completar datos
→ elegir profesional
→ seleccionar fecha y hora
→ revisar y confirmar
→ consultar la cita en Historial
```

El recorrido mantiene una sola tarea por paso, permite regresar sin perder los datos y deja revisar la solicitud antes de confirmarla. La navegación por teclado, las etiquetas comprensibles y los mensajes de error forman parte del mismo flujo. Las preferencias de tamaño de texto, contraste y botones se encuentran en el acceso general de Accesibilidad.

## Persistencia simulada

Las citas y los cambios de estado se conservan en `sessionStorage` mientras la pestaña permanezca abierta. El identificador personal no se almacena. El registro solamente valida y muestra una confirmación local; no crea cuentas reales.
