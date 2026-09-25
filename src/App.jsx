import { useEffect, useRef, useState } from "react";
import GuiaPasoAPasoForm from "./components/GuiaPasoAPasoForm";
import InfoPanels from "./components/InfoPanels";
import Home from "./components/Home";
import Icon from "./components/Icon";
import { especialistas, centroInfo } from "./data/mock";
import { borradorVacio, crearCitasDemo, generarCodigo, obtenerHorariosDisponibles, quitarDatosSensibles } from "./utils/appointments";
import { fragmentarTexto, mensajeErrorVoz } from "./utils/voice";
import { assetUrl } from "./utils/assets";

const preferenciasIniciales = { textoGrande: false, altoContraste: false, botonesGrandes: false };

function Preferencias({ valor, onChange }) {
  const [estadoVoz, setEstadoVoz] = useState({ activo: false, pausado: false, texto: "", fraseActual: "" });
  const [velocidad, setVelocidad] = useState(1.0);
  const lecturaRef = useRef(0);
  const menuRef = useRef(null);

  const alternar = (clave) => onChange({ ...valor, [clave]: !valor[clave] });

  const restablecer = () => {
    detenerLectura();
    onChange(preferenciasIniciales);
  };

  const obtenerTextoParaLeer = () => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return "No hay contenido disponible para leer.";
    return mainEl.innerText.trim();
  };

  const detenerLectura = () => {
    lecturaRef.current += 1;
    window.speechSynthesis?.cancel();
    setEstadoVoz({ activo: false, pausado: false, texto: "Lectura detenida.", fraseActual: "" });
  };

  const pausarLectura = () => {
    if (!window.speechSynthesis) return;
    if (estadoVoz.pausado) {
      window.speechSynthesis.resume();
      setEstadoVoz((prev) => ({ ...prev, pausado: false }));
    } else {
      window.speechSynthesis.pause();
      setEstadoVoz((prev) => ({ ...prev, pausado: true }));
    }
  };

  const iniciarLectura = () => {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setEstadoVoz({ activo: false, pausado: false, texto: "La lectura por voz no está disponible en este navegador.", fraseActual: "" });
      return;
    }

    lecturaRef.current += 1;
    const lecturaActual = lecturaRef.current;
    window.speechSynthesis.cancel();

    const oraciones = fragmentarTexto(obtenerTextoParaLeer());

    if (oraciones.length === 0) {
      setEstadoVoz({ activo: false, pausado: false, texto: "No se encontró texto legible en esta pantalla.", fraseActual: "" });
      return;
    }

    setEstadoVoz({ activo: true, pausado: false, texto: "Preparando lectura…", fraseActual: "" });
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      setEstadoVoz({ activo: false, pausado: false, texto: mensajeErrorVoz("", true), fraseActual: "" });
      return;
    }
    const vozEsp = voices.find((v) => v.lang?.toLowerCase() === "es-ec") || voices.find((v) => v.lang?.toLowerCase().startsWith("es")) || null;

    let index = 0;

    const hablarSiguiente = () => {
      if (lecturaRef.current !== lecturaActual) return;
      if (index >= oraciones.length) {
        setEstadoVoz({ activo: false, pausado: false, texto: "Lectura finalizada.", fraseActual: "" });
        return;
      }

      const frase = oraciones[index];
      const u = new window.SpeechSynthesisUtterance(frase);
      if (vozEsp) u.voice = vozEsp;
      u.lang = vozEsp ? vozEsp.lang : "es-EC";
      u.rate = velocidad;
      u.pitch = 1.0;

      u.onstart = () => {
        if (lecturaRef.current === lecturaActual) {
          setEstadoVoz({
            activo: true,
            pausado: false,
            texto: `Leyendo ${index + 1} de ${oraciones.length}:`,
            fraseActual: frase,
          });
        }
      };

      u.onend = () => {
        if (lecturaRef.current === lecturaActual) {
          index++;
          hablarSiguiente();
        }
      };

      u.onerror = (evento) => {
        if (lecturaRef.current === lecturaActual) {
          setEstadoVoz({ activo: false, pausado: false, texto: mensajeErrorVoz(evento.error), fraseActual: "" });
        }
      };

      window.speechSynthesis.speak(u);
    };

    try {
      hablarSiguiente();
    } catch {
      setEstadoVoz({ activo: false, pausado: false, texto: mensajeErrorVoz(), fraseActual: "" });
    }
  };

  useEffect(() => {
    return () => {
      lecturaRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <details className="preferencias" id="menu-accesibilidad" ref={menuRef}>
      <summary className="preferencias-summary">
        <span className="pref-badge-icon"><Icon name="accessibility" /></span>
        <span>Accesibilidad</span>
      </summary>

      <div className="preferencias-panel" aria-label="Ajustes de accesibilidad">
        <div className="pref-header">
          <div className="pref-header-title">
            <span className="pref-header-icon"><Icon name="settings" /></span>
            <div>
              <h3>Accesibilidad</h3>
            </div>
          </div>
          <button type="button" className="pref-close" onClick={() => { menuRef.current.open = false; }} aria-label="Cerrar ajustes de accesibilidad"><Icon name="close" /></button>
        </div>

        <div className="pref-cards-grid">
          {/* Tarjeta 1: Texto Grande */}
          <div className={`pref-card ${valor.textoGrande ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon"><Icon name="text" /></span>
              <div>
                <strong>Texto Grande</strong>
                <small>Aumenta el tamaño de la letra.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.textoGrande ? "is-active" : ""}`}
              aria-pressed={valor.textoGrande}
              onClick={() => alternar("textoGrande")}
            >
              {valor.textoGrande ? "Activado" : "Activar"}
            </button>
          </div>

          {/* Tarjeta 2: Alto Contraste */}
          <div className={`pref-card ${valor.altoContraste ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon"><Icon name="contrast" /></span>
              <div>
                <strong>Alto Contraste</strong>
                <small>Texto claro sobre fondo oscuro.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.altoContraste ? "is-active" : ""}`}
              aria-pressed={valor.altoContraste}
              onClick={() => alternar("altoContraste")}
            >
              {valor.altoContraste ? "Activado" : "Activar"}
            </button>
          </div>

          {/* Tarjeta 3: Botones Grandes */}
          <div className={`pref-card ${valor.botonesGrandes ? "pref-card-active" : ""}`}>
            <div className="pref-card-info">
              <span className="pref-card-icon"><Icon name="target" /></span>
              <div>
                <strong>Botones Grandes</strong>
                <small>Amplía las zonas de toque.</small>
              </div>
            </div>
            <button
              type="button"
              className={`pref-toggle-btn ${valor.botonesGrandes ? "is-active" : ""}`}
              aria-pressed={valor.botonesGrandes}
              onClick={() => alternar("botonesGrandes")}
            >
              {valor.botonesGrandes ? "Activado" : "Activar"}
            </button>
          </div>
        </div>

        {/* Lector de Pantalla / Voz */}
        <div className="pref-audio-box">
          <div className="pref-audio-header">
            <span className="pref-audio-icon"><Icon name="volume" /></span>
            <div>
              <strong>Lectura en voz alta</strong>
              <small>Lee esta sección. El lector de tu dispositivo sirve para navegar.</small>
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
                aria-pressed={velocidad === vel}
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
                <Icon name="play" /> Escuchar esta página
              </button>
            ) : (
              <div className="pref-audio-action-row">
                <button
                  type="button"
                  className="btn-audio-pause"
                  onClick={pausarLectura}
                >
                  <Icon name={estadoVoz.pausado ? "play" : "pause"} /> {estadoVoz.pausado ? "Reanudar" : "Pausar"}
                </button>
                <button
                  type="button"
                  className="btn-audio-stop"
                  onClick={detenerLectura}
                >
                  <Icon name="stop" /> Detener
                </button>
              </div>
            )}
          </div>

          {/* Estado de lectura en vivo */}
          {estadoVoz.texto && (
            <div className={`pref-voice-status ${estadoVoz.activo ? "is-playing" : ""}`}>
              <span className="voice-dot" aria-hidden="true"></span>
              <div className="voice-status-text">
                <strong role="status">{estadoVoz.texto}</strong>
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
            <Icon name="reset" /> Restablecer valores predeterminados
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
      const lectura = new SpeechSynthesisUtterance("Resumen de tu solicitud. Paciente: " + cita.nombre + ". Especialidad: " + cita.esp + ". Profesional: " + cita.especialista + ". Fecha y hora: " + fecha + ". " + centroInfo.nombre + ". Revisa los datos antes de confirmar.");
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
        <div><dt>Fecha y hora</dt><dd><time dateTime={cita.fecha + "T" + cita.hora}>{new Date(cita.fecha + "T" + cita.hora).toLocaleString("es-EC", { dateStyle: "long", timeStyle: "short" })}</time></dd></div>
        <div><dt>Centro</dt><dd>{centroInfo.nombre}</dd></div>
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
      <div className="acciones-confirmacion">
        <button type="button" className="btn-secondary" onClick={onModificar}>Modificar</button>
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
  const [perfil, setPerfil] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("perfil-ihm-sesion") || "null"); }
    catch { return null; }
  });
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

  useEffect(() => {
    try {
      if (perfil) sessionStorage.setItem("perfil-ihm-sesion", JSON.stringify(perfil));
      else sessionStorage.removeItem("perfil-ihm-sesion");
    } catch { /* El formulario sigue disponible sin almacenamiento. */ }
  }, [perfil]);

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
    setPerfil(null);
    setBorrador(borradorVacio());
    setCitaPendiente(null);
    setEditandoId(null);
    setOk("Se eliminaron tus datos guardados en esta sesión.");
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
  const navegacionSecundaria = [["calendario", "Disponibilidad"], ["ejercicios", "Ejercicios"], ["recordatorios", "Recordatorios"], ["centros", "Centro de atención"], ["registro", "Mis datos"]];
  const titulosSeccion = {
    inicio: "Inicio",
    cita: "Solicitar cita",
    historial: "Mis citas",
    especialistas: "Profesionales",
    centros: "Centro de atención",
    calendario: "Horarios disponibles",
    ejercicios: "Ejercicios",
    recordatorios: "Recordatorios",
    registro: "Mis datos",
  };
  const descripcionesSeccion = {
    cita: "Completa tus datos, elige un profesional y selecciona una hora.",
    historial: "Consulta, reprograma o cancela tus citas.",
    especialistas: "Conoce las áreas de atención y elige un profesional.",
    centros: "Ubicación y contacto del Hospital Básico Guaranda.",
    calendario: "Compara los cupos disponibles durante los próximos días.",
    ejercicios: "Videos con subtítulos, pasos y transcripción.",
    recordatorios: "Prepara tus próximas visitas.",
    registro: "Guarda tus datos para completar más rápido una solicitud.",
  };

  return (
    <div className={clases}>
      <a href="#main" className="skip">Saltar al contenido</a>
      <header className="top">
        <div className="header-inner">
          <div className="brand">
            <img className="brand-logo" src={assetUrl("iess-logo.png")} alt="IESS" width="112" height="42" />
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-service"><strong>Rehabilitación</strong><small>Guaranda</small></span>
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

      <div className="utility-shell"><Preferencias key={seccion} valor={preferencias} onChange={setPreferencias} /></div>

      <main id="main">
        {seccion === "inicio" ? <Home titleRef={tituloRef} onNavigate={navegar} onStart={(esp) => {
          setCitaPendiente(null);
          setEditandoId(null);
          setBorrador((actual) => ({ ...actual, nombre: actual.nombre || perfil?.nombre || "", ...(esp && esp !== actual.esp ? { esp, especialista: "", fecha: "", hora: "" } : {}) }));
          navegar("cita");
        }} /> : <section className="hero hero-compact">
          <div className="hero-copy">
            <h1 ref={tituloRef} tabIndex={-1}>{titulosSeccion[seccion]}</h1>
            <p>{descripcionesSeccion[seccion]}</p>
          </div>
        </section>}
        {ok && <p role="status" className="okmsg">{ok}</p>}
        {seccion === "cita" && (citaPendiente ? (
          <Confirmacion cita={citaPendiente} esReprogramacion={!!editandoId} onModificar={() => setCitaPendiente(null)} onConfirmar={guardarCita} />
        ) : (
          <div className="booking-layout">
            <div>
            {editandoId && <p className="alert info" role="status">Estás reprogramando una cita. Revisa la nueva fecha y hora antes de confirmar.</p>}
            <GuiaPasoAPasoForm form={borrador} setForm={setBorrador} citas={citas} editandoId={editandoId} onConfirm={prepararConfirmacion} />
            </div>
            <aside className="booking-context" aria-label="Información del centro">
              <img src={centroInfo.foto} alt="Fachada del Hospital del IESS en Guaranda" />
              <div><p className="eyebrow">Atención en Guaranda</p><h2>{centroInfo.nombre}</h2><p>{centroInfo.direccion}</p><button type="button" className="context-link" onClick={() => navegar("centros")}>Ver ubicación y contacto</button></div>
            </aside>
          </div>
        ))}
        {seccion !== "cita" && seccion !== "inicio" && <InfoPanels seccion={seccion} citas={citas} perfil={perfil} onSaveProfile={setPerfil} onChangeStatus={actualizarEstado} onReschedule={reprogramar} onClearData={borrarDatos} onLoadDemo={cargarCitasDemo} onNavigate={navegar} onChooseSpecialist={(item, fecha = "") => {
          setBorrador({ ...borradorVacio(), nombre: perfil?.nombre || "", esp: item.especialidad, especialista: item.nombre, fecha });
          navegar("cita");
        }} />}
      </main>
      <footer><strong>Rehab Guaranda</strong><span>Proyecto académico de Interacción Hombre–Máquina · No es un sitio oficial</span></footer>
    </div>
  );
}
