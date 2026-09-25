import { useEffect, useRef, useState } from "react";
import GuiaPasoAPasoForm from "./components/GuiaPasoAPasoForm";
import InfoPanels from "./components/InfoPanels";
import Home from "./components/Home";
import { especialistas } from "./data/mock";
import { borradorVacio, crearCitasDemo, generarCodigo, obtenerHorariosDisponibles, quitarDatosSensibles } from "./utils/appointments";

const preferenciasIniciales = { textoGrande: false, altoContraste: false, botonesGrandes: false };

function Preferencias({ valor, onChange, seccion }) {
  const [estadoVoz, setEstadoVoz] = useState({ activo: false, pausado: false, texto: "", fraseActual: "" });
  const [velocidad, setVelocidad] = useState(1.0);
  const synthRef = useRef({ cancelado: false, timer: null });

  const alternar = (clave) => onChange({ ...valor, [clave]: !valor[clave] });

  const restablecer = () => {
    detenerLectura();
    onChange(preferenciasIniciales);
  };

  const obtenerTextoParaLeer = () => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return "No hay contenido disponible para leer.";

    const elementos = mainEl.querySelectorAll("h1, h2, h3, p:not(.sr-only), li");
    const textos = [];
    elementos.forEach((el) => {
      if (el.offsetParent === null || el.classList.contains("sr-only")) return;
      const t = el.innerText.trim();
      if (t && !textos.includes(t)) textos.push(t);
    });

    if (textos.length === 0) return mainEl.innerText.trim();
    return textos.join(". ");
  };

  const detenerLectura = () => {
    synthRef.current.cancelado = true;
    if (synthRef.current.timer) clearInterval(synthRef.current.timer);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setEstadoVoz({ activo: false, pausado: false, texto: "Lectura detenida.", fraseActual: "" });
  };

  const pausarLectura = () => {
    if (!("speechSynthesis" in window)) return;
    if (estadoVoz.pausado) {
      window.speechSynthesis.resume();
      setEstadoVoz((prev) => ({ ...prev, pausado: false }));
    } else {
      window.speechSynthesis.pause();
      setEstadoVoz((prev) => ({ ...prev, pausado: true }));
    }
  };

  const iniciarLectura = () => {
    if (!("speechSynthesis" in window)) {
      setEstadoVoz({ activo: false, pausado: false, texto: "La lectura por voz no está disponible en este navegador.", fraseActual: "" });
      return;
    }

    detenerLectura();
    synthRef.current.cancelado = false;
    window.speechSynthesis.resume();

    const textoCompleto = obtenerTextoParaLeer();
    const oraciones = textoCompleto
      .replace(/\s+/g, " ")
      .split(/(?<=[.?!;])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("http"));

    if (oraciones.length === 0) {
      setEstadoVoz({ activo: false, pausado: false, texto: "No se encontró texto legible en esta pantalla.", fraseActual: "" });
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const vozEsp = voices.find((v) => v.lang && v.lang.startsWith("es")) || null;

    let index = 0;

    const hablarSiguiente = () => {
      if (synthRef.current.cancelado) return;
      if (index >= oraciones.length) {
        setEstadoVoz({ activo: false, pausado: false, texto: "Lectura finalizada.", fraseActual: "" });
        return;
      }

      const frase = oraciones[index];
      const u = new SpeechSynthesisUtterance(frase);
      if (vozEsp) u.voice = vozEsp;
      u.lang = vozEsp ? vozEsp.lang : "es-ES";
      u.rate = velocidad;
      u.pitch = 1.0;

      u.onstart = () => {
        if (!synthRef.current.cancelado) {
          setEstadoVoz({
            activo: true,
            pausado: false,
            texto: `Leyendo ${index + 1} de ${oraciones.length}:`,
            fraseActual: frase,
          });
        }
      };

      u.onend = () => {
        if (!synthRef.current.cancelado) {
          index++;
          hablarSiguiente();
        }
      };

      u.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.warn("Speech synthesis error", e);
        }
        if (!synthRef.current.cancelado) {
          index++;
          hablarSiguiente();
        }
      };

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(u);
    };

    hablarSiguiente();

    // Mantener activo speechSynthesis en Chromium para evitar corte tras 15 segundos
    synthRef.current.timer = setInterval(() => {
      if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  useEffect(() => {
    return () => {
      detenerLectura();
    };
  }, [seccion]);

  return (
    <details className="preferencias" id="menu-accesibilidad">
      <summary className="preferencias-summary">
        <span className="pref-badge-icon" aria-hidden="true">♿</span>
        <span>Accesibilidad</span>
      </summary>

      <div className="preferencias-panel" aria-label="Ajustes de accesibilidad">
        <div className="pref-header">
          <div className="pref-header-title">
            <span className="pref-header-icon" aria-hidden="true">⚙️</span>
            <div>
              <h3>Ajustes de Accesibilidad</h3>
              <p>Diseño universal para baja visión, adultos mayores y motricidad.</p>
            </div>
          </div>
        </div>

        <div className="pref-cards-grid">
          {/* Tarjeta 1: Texto Grande */}
          <div className={`pref-card ${valor.textoGrande ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon" aria-hidden="true">🔤</span>
              <div>
                <strong>Texto Grande</strong>
                <small>Aumenta títulos y contenidos para lectura sin esfuerzo.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.textoGrande ? "is-active" : ""}`}
              aria-pressed={valor.textoGrande}
              onClick={() => alternar("textoGrande")}
            >
              {valor.textoGrande ? "Activado ✓" : "Activar"}
            </button>
          </div>

          {/* Tarjeta 2: Alto Contraste */}
          <div className={`pref-card ${valor.altoContraste ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon" aria-hidden="true">◐</span>
              <div>
                <strong>Alto Contraste</strong>
                <small>Fondo negro profundo y tipografía de máxima visibilidad.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.altoContraste ? "is-active" : ""}`}
              aria-pressed={valor.altoContraste}
              onClick={() => alternar("altoContraste")}
            >
              {valor.altoContraste ? "Activado ✓" : "Activar"}
            </button>
          </div>

          {/* Tarjeta 3: Botones Grandes */}
          <div className={`pref-card ${valor.botonesGrandes ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon" aria-hidden="true">▣</span>
              <div>
                <strong>Botones Grandes</strong>
                <small>Zonas táctiles amplias (+58px) para facilitar el toque o clic.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.botonesGrandes ? "is-active" : ""}`}
              aria-pressed={valor.botonesGrandes}
              onClick={() => alternar("botonesGrandes")}
            >
              {valor.botonesGrandes ? "Activado ✓" : "Activar"}
            </button>
          </div>
        </div>

        {/* Lector de Pantalla / Voz */}
        <div className="pref-audio-box">
          <div className="pref-audio-header">
            <span className="pref-audio-icon" aria-hidden="true">🔊</span>
            <div>
              <strong>Lector de pantalla asistido</strong>
              <small>Escucha la información de esta pantalla en voz alta.</small>
            </div>
          </div>

          {/* Velocidad de locución */}
          <div className="pref-speed-selector">
            <span>Velocidad:</span>
            {[0.8, 1.0, 1.25].map((vel) => (
              <button
                key={vel}
                type="button"
                className={`pref-speed-chip ${velocidad === vel ? "is-selected" : ""}`}
                onClick={() => setVelocidad(vel)}
              >
                {vel === 0.8 ? "0.8x Lenta" : vel === 1.0 ? "1.0x Normal" : "1.25x Rápida"}
              </button>
            ))}
          </div>

          {/* Controles de reproducción */}
          <div className="pref-audio-controls">
            {!estadoVoz.activo ? (
              <button
                type="button"
                className="btn-audio-primary"
                onClick={iniciarLectura}
              >
                ▶ Escuchar esta página
              </button>
            ) : (
              <div className="pref-audio-action-row">
                <button
                  type="button"
                  className="btn-audio-pause"
                  onClick={pausarLectura}
                >
                  {estadoVoz.pausado ? "▶ Reanudar" : "⏸ Pausar"}
                </button>
                <button
                  type="button"
                  className="btn-audio-stop"
                  onClick={detenerLectura}
                >
                  ⏹ Detener
                </button>
              </div>
            )}
          </div>

          {/* Estado de lectura en vivo */}
          {estadoVoz.texto && (
            <div className={`pref-voice-status ${estadoVoz.activo ? "is-playing" : ""}`} role="status">
              <span className="voice-dot" aria-hidden="true"></span>
              <div className="voice-status-text">
                <strong>{estadoVoz.texto}</strong>
                {estadoVoz.fraseActual && <p>"{estadoVoz.fraseActual}"</p>}
              </div>
            </div>
          )}
        </div>

        <div className="pref-footer">
          <button
            type="button"
            className="btn-reset-pref"
            onClick={restablecer}
          >
            ↺ Restablecer valores predeterminados
          </button>
        </div>
      </div>
    </details>
  );
}

function Confirmacion({ cita, esReprogramacion, onModificar, onConfirmar }) {
  const headingRef = useRef(null);
  const [vozEstado, setVozEstado] = useState("");
  const lecturaRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
    return () => {
      if (lecturaRef.current) {
        lecturaRef.current.onend = null;
        lecturaRef.current.onerror = null;
        window.speechSynthesis?.cancel();
      }
    };
  }, []);
  const escucharResumen = () => {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setVozEstado("La lectura por voz no está disponible. Puedes consultar el resumen escrito.");
      return;
    }
    try {
      if (lecturaRef.current) {
        lecturaRef.current.onend = null;
        lecturaRef.current.onerror = null;
      }
      window.speechSynthesis.cancel();
      const fecha = new Date(cita.fecha + "T" + cita.hora).toLocaleString("es-EC", { dateStyle: "full", timeStyle: "short" });
      const lectura = new SpeechSynthesisUtterance("Resumen de tu solicitud. Paciente: " + cita.nombre + ". Especialidad: " + cita.esp + ". Profesional: " + cita.especialista + ". Fecha y hora: " + fecha + ". Centro de rehabilitación IESS Guaranda. Revisa los datos antes de confirmar.");
      lectura.lang = "es-EC";
      lectura.onend = () => setVozEstado("Lectura finalizada.");
      lectura.onerror = () => setVozEstado("No se pudo reproducir la voz. Puedes consultar el resumen escrito.");
      lecturaRef.current = lectura;
      window.speechSynthesis.speak(lectura);
      setVozEstado("Leyendo el resumen.");
    } catch {
      setVozEstado("No se pudo reproducir la voz. Puedes consultar el resumen escrito.");
    }
  };
  return (
    <section className="card confirmacion" aria-labelledby="confirmacion-titulo">
      <p className="eyebrow">Último paso</p>
      <h2 id="confirmacion-titulo" ref={headingRef} tabIndex={-1}>Revisa los datos antes de confirmar</h2>
      <dl className="resumen-datos">
        <div><dt>Paciente</dt><dd>{cita.nombre}</dd></div>
        <div><dt>Especialidad</dt><dd>{cita.esp}</dd></div>
        <div><dt>Profesional</dt><dd>{cita.especialista}</dd></div>
        <div><dt>Fecha y hora</dt><dd>{cita.fecha} · {cita.hora}</dd></div>
        <div><dt>Centro</dt><dd>IESS Centro de Rehabilitación Guaranda</dd></div>
      </dl>
      <div className="acciones-confirmacion">
        <button type="button" className="btn-secondary" onClick={escucharResumen}>Escuchar resumen</button>
        <button type="button" className="btn-secondary" onClick={() => {
          if (lecturaRef.current) {
            lecturaRef.current.onend = null;
            lecturaRef.current.onerror = null;
          }
          window.speechSynthesis?.cancel();
          setVozEstado("Lectura detenida.");
        }}>Detener lectura</button>
      </div>
      <p role="status">{vozEstado}</p>
      <p className="privacy-note">El código personal de cuatro dígitos se usa solo para validar este formulario y no se guardará.</p>
      <div className="acciones-confirmacion">
        <button type="button" className="btn-secondary" onClick={onModificar}>← Modificar</button>
        <button type="button" className="btn-primary" onClick={onConfirmar}>{esReprogramacion ? "Confirmar nueva fecha" : "Confirmar cita"}</button>
      </div>
    </section>
  );
}

export default function App() {
  const [seccion, setSeccion] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [borrador, setBorrador] = useState(borradorVacio);
  const [citaPendiente, setCitaPendiente] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [ok, setOk] = useState("");
  const tituloRef = useRef(null);
  const masRef = useRef(null);
  const [preferencias, setPreferencias] = useState(() => {
    try {
      return { ...preferenciasIniciales, ...JSON.parse(localStorage.getItem("ihm-preferencias") || "{}") };
    } catch {
      return preferenciasIniciales;
    }
  });
  const [citas, setCitas] = useState(() => {
    try {
      const origen = sessionStorage.getItem("citas-ihm-sesion") || localStorage.getItem("citas-iess") || "[]";
      const guardadas = JSON.parse(origen);
      if (!Array.isArray(guardadas)) return [];
      return guardadas.map((cita) => {
        const profesional = especialistas.find((item) => item.nombre === cita.especialista);
        return quitarDatosSensibles({
          ...cita,
          esp: cita.esp || profesional?.especialidad || "Especialidad no registrada",
          id: cita.id || generarCodigo(Date.now() + Math.random() * 1000),
          codigo: cita.codigo || generarCodigo(Date.now() + Math.random() * 1000),
        });
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("citas-ihm-sesion", JSON.stringify(citas));
      localStorage.removeItem("citas-iess");
    } catch {
      // La aplicación sigue funcionando si el navegador bloquea el almacenamiento.
    }
  }, [citas]);

  useEffect(() => {
    try {
      localStorage.setItem("ihm-preferencias", JSON.stringify(preferencias));
    } catch {
      // Las preferencias son opcionales.
    }
  }, [preferencias]);

  const navegar = (destino, conservarEdicion = false) => {
    if (destino === "cita" && !conservarEdicion) {
      setCitaPendiente(null);
      setEditandoId(null);
    }
    setSeccion(destino);
    setMenuAbierto(false);
    if (masRef.current) masRef.current.open = false;
    setOk("");
    requestAnimationFrame(() => tituloRef.current?.focus());
  };

  const prepararConfirmacion = (cita) => {
    setCitaPendiente(cita);
    window.scrollTo(0, 0);
  };

  const guardarCita = () => {
    if (!citaPendiente) return;
    const horarios = obtenerHorariosDisponibles(citaPendiente.especialista, citaPendiente.fecha, citas, editandoId);
    if (!horarios.includes(citaPendiente.hora)) {
      setBorrador({ ...citaPendiente, hora: "" });
      setCitaPendiente(null);
      setOk("Ese horario ya no está disponible. Elige otro antes de confirmar.");
      return;
    }
    const codigo = editandoId || generarCodigo();
    const datos = quitarDatosSensibles({
      ...citaPendiente,
      id: codigo,
      codigo,
      estado: "Pendiente",
    });
    setCitas((actuales) => editandoId
      ? actuales.map((cita) => cita.id === editandoId ? { ...cita, ...datos } : cita)
      : [...actuales, datos]);
    setOk(`${editandoId ? "Cita reprogramada" : "Cita confirmada"}. Código: ${codigo}.`);
    setCitaPendiente(null);
    setEditandoId(null);
    setBorrador(borradorVacio());
    setSeccion("historial");
    requestAnimationFrame(() => tituloRef.current?.focus());
    window.scrollTo(0, 0);
  };

  const actualizarEstado = (id, estado) => {
    setCitas((actuales) => actuales.map((cita) => cita.id === id ? { ...cita, estado } : cita));
    setOk(`Estado actualizado a ${estado}.`);
  };

  const reprogramar = (cita) => {
    setBorrador({
      nombre: cita.nombre,
      identificador: "",
      esp: cita.esp,
      especialista: cita.especialista,
      fecha: cita.fecha,
      hora: cita.hora,
    });
    setEditandoId(cita.id);
    setCitaPendiente(null);
    navegar("cita", true);
  };

  const borrarDatos = () => {
    setCitas([]);
    setBorrador(borradorVacio());
    setCitaPendiente(null);
    setEditandoId(null);
    setOk("Los datos locales de demostración fueron eliminados.");
  };

  const cargarCitasDemo = () => {
    const demos = crearCitasDemo(citas);
    const existentes = new Set(citas.map((cita) => cita.codigo));
    const nuevas = demos.filter((cita) => !existentes.has(cita.codigo));
    if (nuevas.length === 0) {
      navegar("historial");
      setOk("Las citas ficticias ya están cargadas. Puedes probar el historial y los recordatorios.");
      return;
    }
    setCitas((actuales) => [...actuales, ...nuevas]);
    navegar("historial");
    setOk("Se añadieron dos citas ficticias. Úsalas para probar el historial y los recordatorios.");
  };

  const clases = [
    "app",
    preferencias.textoGrande ? "pref-texto-grande" : "",
    preferencias.altoContraste ? "pref-alto-contraste" : "",
    preferencias.botonesGrandes ? "pref-botones-grandes" : "",
  ].filter(Boolean).join(" ");

  const navegacionPrincipal = [["inicio", "Inicio"], ["cita", "Nueva cita"], ["historial", "Mis citas"], ["especialistas", "Profesionales"]];
  const navegacionSecundaria = [["calendario", "Disponibilidad"], ["ejercicios", "Ejercicios"], ["recordatorios", "Recordatorios"], ["centros", "Centro de atención"], ["registro", "Registro"]];
  const textosSeccion = {
    inicio: ["Rehabilitación · Guaranda", "Tu próxima cita, más cerca.", "Encuentra atención, organiza tus citas y consulta las orientaciones para tu rehabilitación."],
    cita: ["Atención en rehabilitación", "Solicitar una cita", "Consulta profesionales, encuentra un horario y prepara una cita en pocos pasos."],
    historial: ["Seguimiento personal", "Mis citas", "Consulta el estado, reprograma o cancela una cita de demostración."],
    especialistas: ["Equipo de atención", "Profesionales de atención", "Conoce las especialidades y horarios simulados antes de elegir."],
    centros: ["Información útil", "Centro de atención", "Consulta ubicación, contacto y horario del centro de demostración."],
    calendario: ["Planifica con tiempo", "Disponibilidad de citas", "Compara los cupos simulados de cada profesional por día."],
    ejercicios: ["Acompañamiento", "Ejercicios y orientación", "Revisa material de demostración con subtítulos y transcripción."],
    recordatorios: ["Antes de tu atención", "Tus recordatorios", "Ten a mano la información necesaria para tu próxima cita."],
    registro: ["Demostración local", "Registro de usuario", "Los datos se validan en esta pantalla y no se envían ni se guardan."],
  };
  const [heroKicker, heroTitle, heroDescription] = textosSeccion[seccion];

  return (
    <div className={clases}>
      <a href="#main" className="skip">Saltar al contenido</a>
      <header className="top">
        <div className="header-inner">
          <div className="brand">
            <img className="brand-logo" src="/iess-logo.png" alt="IESS" width="112" height="42" />
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-service"><strong>Rehabilitación</strong><small>Guaranda · prototipo académico</small></span>
          </div>
          <button type="button" className="menu-toggle" aria-expanded={menuAbierto} aria-controls="nav-principal" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? "Cerrar" : "Menú"}
          </button>
          <nav id="nav-principal" className={menuAbierto ? "menu-open" : ""} aria-label="Funciones principales">
            {navegacionPrincipal.map(([clave, etiqueta]) => (
              <button key={clave} onClick={() => navegar(clave)} className={seccion === clave ? "nav on" : "nav"} aria-current={seccion === clave ? "page" : undefined}>{etiqueta}</button>
            ))}
            <details className="more-menu" ref={masRef}>
              <summary>Más</summary>
              <div className="more-menu-panel">
                {navegacionSecundaria.map(([clave, etiqueta]) => <button key={clave} type="button" onClick={() => navegar(clave)} aria-current={seccion === clave ? "page" : undefined}>{etiqueta}</button>)}
              </div>
            </details>
          </nav>
        </div>
      </header>

      <div className="utility-shell"><span className="prototype-label">Prototipo académico · Datos simulados</span><Preferencias valor={preferencias} onChange={setPreferencias} seccion={seccion} /></div>

      <main id="main">
        {seccion === "inicio" ? <Home titleRef={tituloRef} onNavigate={navegar} onLoadDemo={cargarCitasDemo} hasDemo={citas.some((cita) => cita.esDemo)} onStart={(esp) => {
          setCitaPendiente(null);
          setEditandoId(null);
          setBorrador((actual) => esp && esp !== actual.esp ? { ...actual, esp, especialista: "", fecha: "", hora: "" } : actual);
          navegar("cita");
        }} /> : <section className="hero hero-compact">
          <div className="hero-copy">
            <p className="hero-kicker">{heroKicker}</p>
            <h1 ref={tituloRef} tabIndex={-1}>{heroTitle}</h1>
            <p className="hero-description">{heroDescription}</p>
          </div>
        </section>}
        {ok && <p role="status" className="okmsg">{ok}</p>}
        {seccion === "cita" && (citaPendiente ? (
          <Confirmacion cita={citaPendiente} esReprogramacion={!!editandoId} onModificar={() => setCitaPendiente(null)} onConfirmar={guardarCita} />
        ) : (
          <>
            {editandoId && <p className="alert info" role="status">Estás reprogramando una cita. Revisa la nueva fecha y hora antes de confirmar.</p>}
            <section className="booking-flow-intro" aria-labelledby="booking-flow-title">
              <p className="eyebrow">Solicitud de cita</p>
              <h2 id="booking-flow-title">Completa estos pasos</h2>
              <p>Te guiaremos desde tus datos hasta la elección de un horario. Puedes volver para corregir cualquier respuesta.</p>
            </section>
            <GuiaPasoAPasoForm form={borrador} setForm={setBorrador} citas={citas} editandoId={editandoId} onConfirm={prepararConfirmacion} />
          </>
        ))}
        {seccion !== "cita" && seccion !== "inicio" && <InfoPanels seccion={seccion} citas={citas} onChangeStatus={actualizarEstado} onReschedule={reprogramar} onClearData={borrarDatos} onLoadDemo={cargarCitasDemo} />}
      </main>
      <footer><strong>Rehab Guaranda</strong><span>Proyecto académico de Interacción Hombre–Máquina · No es un sitio oficial</span></footer>
    </div>
  );
}
