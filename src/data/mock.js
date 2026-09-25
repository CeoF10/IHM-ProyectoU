export const especialistas = [
  { id: 1, nombre: "Dra. María Toaza", especialidad: "Fisioterapia", horario: "Lun-Vie 08:00-11:30", dias: [1, 2, 3, 4, 5], horas: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], foto: "MT" },
  { id: 2, nombre: "Dr. Carlos Bayas", especialidad: "Traumatología", horario: "Lun-Mié-Vie 14:00-15:00", dias: [1, 3, 5], horas: ["14:00", "14:30", "15:00"], foto: "CB" },
  { id: 3, nombre: "Lcda. Ana Chimbo", especialidad: "Terapia Ocupacional", horario: "Mar-Jue 08:00-11:30", dias: [2, 4], horas: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], foto: "AC" },
  { id: 4, nombre: "Dr. Luis Montero", especialidad: "Neurología", horario: "Lun-Jue 09:00-15:00", dias: [1, 2, 3, 4], horas: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"], foto: "LM" },
];

export const horariosDisponibles = [
  "08:00", "08:30", "09:00", "09:30", "10:00",
  "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"
];

export const ejercicios = [
  {
    id: 1,
    titulo: "Movilidad y estiramientos de hombro",
    canal: "FisioOnline",
    especialista: "Mikel Junquera",
    nivel: "Básico - Recuperación",
    duracion: "3:13 min",
    video: "/ejercicios/movilidad-hombro.mp4",
    vtt: "/ejercicios/movilidad-hombro.vtt",
    desc: "Rutina de 3 estiramientos para recuperar amplitud de movimiento articular y aliviar sobrecargas.",
    pasos: [
      "Aducción interna: cruza el brazo hacia el hombro contrario y ejerce una ligera tracción en el codo.",
      "Tríceps y dorsal ancho: pasa el brazo detrás de la nuca, flexiona el codo e inclina el tronco suavemente al lado opuesto.",
      "Rotadores externos: pasa el brazo tras la espalda, sujeta la muñeca con la otra mano y aproxímala al lado contrario."
    ],
    transcripcion: "Hola, soy Mikel Junquera, colaborador de Fisioterapia Online (FisioOnline), y os voy a enseñar cómo estirar y movilizar la articulación del hombro.\n\nPara el estiramiento del hombro tenéis varios ejercicios que podéis hacer:\n\n1. Primer estiramiento (Aducción interna): Consiste en llevar el brazo hacia la parte interna. Con el otro brazo lo apoyamos y realizamos este estiramiento sosteniendo la posición de manera cómoda.\n2. Segundo estiramiento (Tríceps y dorsal ancho): Llevamos el brazo hacia el hombro contrario pasándolo por detrás de la columna cervical. Flexionamos el codo ayudándonos con la otra mano y, al inclinar ligeramente el tronco hacia el lado contrario, notaremos el estiramiento en tríceps y dorsal.\n3. Tercer estiramiento (Rotadores del hombro): Realizamos el movimiento opuesto a los rotadores externos. Pasamos el brazo por detrás de la espalda, tomamos la muñeca con la otra mano y la aproximamos suavemente hacia el hombro opuesto.\n\nRealiza cada postura durante 15 a 30 segundos respirando con tranquilidad y detén el ejercicio si sientes dolor agudo."
  },
  {
    id: 2,
    titulo: "Fortalecimiento inicial de rodilla",
    canal: "FisioOnline",
    especialista: "Equipo FisioOnline",
    nivel: "Inicial - Fase temprana",
    duracion: "2:24 min",
    video: "/ejercicios/fortalecimiento-rodilla.mp4",
    vtt: "/ejercicios/fortalecimiento-rodilla.vtt",
    desc: "Activación isométrica y propioceptiva para rodilla post-inmovilización o debilidad muscular.",
    pasos: [
      "Contracción isométrica: contrae el cuádriceps 2 segundos apretando hacia la base y relaja. 10 repeticiones.",
      "Fuerza en 4 direcciones: presiona suavemente hacia adelante, atrás, adentro y afuera contra el suelo.",
      "Carga y equilibrio: mantén el apoyo unipodal con flexión de 5° durante 10 segundos, usando apoyo de seguridad.",
      "Movilidad deslizante: flexión y extensión corta y fluida aumentando progresivamente la velocidad."
    ],
    transcripcion: "Comenzamos con un ejercicio de contracción y relajación: sencillamente contraemos cuádriceps durante un par de segundos y relajamos. Estamos estimulando así todas las estructuras periarticulares, cápsulas, ligamentos y tendones, además de reactivar el músculo tras periodos de reposo. Realizamos grupos de 10 repeticiones.\n\nPasamos a un isométrico en cuatro direcciones: empujamos la pierna contra el suelo hacia adelante, atrás, adentro y afuera en ciclos de 5 a 10 repeticiones con descansos.\n\nContinuamos con un ejercicio de carga y equilibrio: mantenemos la posición con la rodilla ligerísimamente doblada (5 grados) durante 10 segundos, apoyándonos en una silla a los lados para mayor seguridad.\n\nTerminamos con movimientos de flexión y extensión cortita de rodilla, ejecutándolos inicialmente de forma suave y controlada para ganar confianza, ritmo y viveza en la articulación."
  },
  {
    id: 3,
    titulo: "Consciencia y respiración diafragmática",
    canal: "FisioOnline",
    especialista: "Equipo FisioOnline",
    nivel: "Todos los niveles",
    duracion: "3:54 min",
    video: "/ejercicios/respiracion-diafragmatica.mp4",
    vtt: "/ejercicios/respiracion-diafragmatica.vtt",
    desc: "Guía práctica para activar el diafragma, mejorar la oxigenación y relajar la caja torácica.",
    pasos: [
      "Postura: túmbate boca arriba con rodillas flexionadas y pies planos sobre el suelo.",
      "Percepción: coloca una mano sobre el vientre y otra sobre el pecho para notar el patrón de respiración.",
      "Respiración abdominal: inhala inflando el vientre como un globo por el descenso del diafragma (10 a 15 veces).",
      "Apertura costal: traslada las manos a la base de las costillas y siente la expansión lateral al inhalar."
    ],
    transcripcion: "Para realizar este ejercicio nos colocamos tumbados boca arriba con las rodillas flexionadas y los pies bien apoyados en el suelo. Comenzamos colocando una mano sobre el vientre y otra mano sobre el pecho para percibir cómo es nuestra respiración: si es más costal y alta o si es diafragmática.\n\nUna vez tomada consciencia, llevamos la respiración al vientre, intentando que al inhalar se infle suavemente como un globo gracias al descenso del diafragma. Las manos nos ayudan a monitorear que el pecho no se tense. Repetimos de 10 a 15 respiraciones.\n\nPosteriormente pasamos a la zona torácica baja: situamos las manos donde terminan las costillas y respiramos sintiendo cómo se abren lateralmente. Identificar en qué zona nos cuesta más mover el aire nos permite ejercitar con prioridad donde tengamos menor elasticidad respiratoria."
  }
];

export const centroInfo = {
  nombre: "IESS Centro de Rehabilitación Guaranda",
  direccion: "Av. Manuela Cañizares y 7 de Mayo, Guaranda, Bolívar",
  telefono: "(03) 255-0123",
  horario: "Lunes a Viernes 08:00 - 17:00",
};
