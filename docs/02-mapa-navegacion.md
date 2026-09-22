# 02 - Mapa de navegación

## Punto de entrada

`Sistema web de atención - Rehabilitación`

## Navegación principal

```text
Inicio
├── Solicitar cita
│   ├── Vista rápida
│   ├── Guía paso a paso
│   └── Accesibilidad reforzada
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
Elegir modo de interacción
→ completar los datos
→ elegir profesional
→ seleccionar fecha y hora
→ revisar y confirmar
→ consultar la cita en Historial
```

En la vista rápida el flujo aparece en una sola pantalla. En la guía paso a paso se divide en cuatro etapas y permite regresar desde la confirmación. En accesibilidad reforzada se presenta de manera lineal para conservar un orden de teclado predecible. Los modos están disponibles para cualquier persona y no exigen declarar edad o discapacidad.

## Persistencia simulada

Las citas y los cambios de estado se conservan en `sessionStorage` mientras la pestaña permanezca abierta. El identificador personal no se almacena. El registro solamente valida y muestra una confirmación local; no crea cuentas reales.
