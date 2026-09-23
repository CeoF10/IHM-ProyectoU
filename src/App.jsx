import { useEffect, useRef, useState } from "react";
import VistaRapidaForm from "./components/VistaRapidaForm";
import GuiaPasoAPasoForm from "./components/GuiaPasoAPasoForm";
import AccesibleForm from "./components/AccesibleForm";
import InfoPanels from "./components/InfoPanels";
import Home from "./components/Home";
import { especialistas } from "./data/mock";
import { borradorVacio, generarCodigo, quitarDatosSensibles } from "./utils/appointments";

const preferenciasIniciales = { textoGrande: false, altoContraste: false, botonesGrandes: false };

function Icono({ tipo }) {
  const trazos = {
    rapido: <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></>,
    pasos: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><path d="M8 6h5a3 3 0 0 1 3 3v1M16 14v1a3 3 0 0 1-3 3H8" /></>,
    apoyo: <><circle cx="12" cy="4" r="2" /><path d="M5 8h14M12 6v6m0 0-4 9m4-9 4 9" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{trazos[tipo]}</svg>;
}

function Preferencias({ valor, onChange }) {
  const [mensajeVoz, setMensajeVoz] = useState("");
  const alternar = (clave) => onChange({ ...valor, [clave]: !valor[clave] });
  const leerContenido = () => {
    const texto = document.querySelector("main")?.innerText || "No hay contenido disponible.";
    try {
      speechSynthesis.cancel();
      const lectura = new SpeechSynthesisUtterance(texto);
      lectura.lang = "es-EC";
      speechSynthesis.speak(lectura);
      setMensajeVoz("Lectura iniciada. Puedes detenerla con el botón Detener lectura.");
    } catch {
      setMensajeVoz("La lectura por voz no está disponible en este navegador.");
    }
  };
  return (
    <details className="preferencias">
      <summary>Accesibilidad</summary>
      <div className="preferencias-panel" aria-label="Preferencias de accesibilidad">
        <p>Ajusta toda la interfaz según tus necesidades.</p>
        <div className="preferencias-controles">
        <button type="button" aria-pressed={valor.textoGrande} onClick={() => alternar("textoGrande")}>A+ Texto grande</button>
        <button type="button" aria-pressed={valor.altoContraste} onClick={() => alternar("altoContraste")}>◐ Alto contraste</button>
        <button type="button" aria-pressed={valor.botonesGrandes} onClick={() => alternar("botonesGrandes")}>▣ Botones grandes</button>
        <button type="button" onClick={leerContenido}>Escuchar página</button>
        <button type="button" onClick={() => { window.speechSynthesis?.cancel(); setMensajeVoz("Lectura detenida."); }}>Detener lectura</button>
        </div>
        <p role="status">{mensajeVoz}</p>
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
  const [modo, setModo] = useState("rapida");
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
      const modosAnteriores = { Joven: "Vista rápida", "Adulto mayor": "Guía paso a paso", Discapacidad: "Accesibilidad reforzada" };
      return guardadas.map(({ perfil, ...cita }) => {
        const profesional = especialistas.find((item) => item.nombre === cita.especialista);
        return quitarDatosSensibles({
          ...cita,
          esp: cita.esp || profesional?.especialidad || "Especialidad no registrada",
          modo: cita.modo || modosAnteriores[perfil] || "Vista rápida",
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

  const navegar = (destino) => {
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
    const codigo = editandoId || generarCodigo();
    const datos = quitarDatosSensibles({
      ...citaPendiente,
      id: codigo,
      codigo,
      estado: "Pendiente",
    });
    setCitas((actuales) => editandoId
      ? actuales.map((cita) => cita.id === editandoId ? datos : cita)
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
    setModo("guiada");
    navegar("cita");
  };

  const borrarDatos = () => {
    setCitas([]);
    setBorrador(borradorVacio());
    setCitaPendiente(null);
    setEditandoId(null);
    setOk("Los datos locales de demostración fueron eliminados.");
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
          <div className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 26c4-10 10-14 16-11 4 2 7 7 8 14M11 16l5 2-1-5" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="29" cy="12" r="3" fill="var(--gold)"/></svg></span><span><strong>Rehabilitación</strong><small>IESS · Guaranda</small></span></div>
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

      <div className="utility-shell"><span className="prototype-label">Prototipo académico · Datos simulados</span><Preferencias valor={preferencias} onChange={setPreferencias} /></div>

      <main id="main">
        {seccion === "inicio" ? <Home titleRef={tituloRef} onNavigate={navegar} onStart={(esp) => {
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
            <section className="mode-section" aria-labelledby="mode-title">
              <div className="section-heading"><div><p className="eyebrow">Personaliza el proceso</p><h2 id="mode-title">¿Cómo quieres completar la solicitud?</h2></div><p>Puedes cambiar de formato sin perder tus datos.</p></div>
              <div className="modos" role="group" aria-label="Formato de solicitud">
                <button onClick={() => setModo("rapida")} className={modo === "rapida" ? "mode-card active" : "mode-card"} aria-pressed={modo === "rapida"}><span className="mode-index"><Icono tipo="rapido" /></span><span><strong>Vista rápida</strong><small>Todo en una pantalla</small></span><span className="mode-check" aria-hidden="true">✓</span></button>
                <button onClick={() => setModo("guiada")} className={modo === "guiada" ? "mode-card active" : "mode-card"} aria-pressed={modo === "guiada"}><span className="mode-index"><Icono tipo="pasos" /></span><span><strong>Paso a paso</strong><small>Una decisión a la vez</small></span><span className="mode-check" aria-hidden="true">✓</span></button>
                <button onClick={() => setModo("reforzada")} className={modo === "reforzada" ? "mode-card active" : "mode-card"} aria-pressed={modo === "reforzada"}><span className="mode-index"><Icono tipo="apoyo" /></span><span><strong>Con más apoyos</strong><small>Lineal, grande y con voz</small></span><span className="mode-check" aria-hidden="true">✓</span></button>
              </div>
            </section>
            {modo === "rapida" && <VistaRapidaForm form={borrador} setForm={setBorrador} citas={citas} editandoId={editandoId} onConfirm={prepararConfirmacion} />}
            {modo === "guiada" && <GuiaPasoAPasoForm form={borrador} setForm={setBorrador} citas={citas} editandoId={editandoId} onConfirm={prepararConfirmacion} />}
            {modo === "reforzada" && <AccesibleForm form={borrador} setForm={setBorrador} citas={citas} editandoId={editandoId} onConfirm={prepararConfirmacion} />}
          </>
        ))}
        {seccion !== "cita" && seccion !== "inicio" && <InfoPanels seccion={seccion} citas={citas} onChangeStatus={actualizarEstado} onReschedule={reprogramar} onClearData={borrarDatos} />}
      </main>
      <footer><strong>Rehab Guaranda</strong><span>Proyecto académico de Interacción Hombre–Máquina · No es un sitio oficial</span></footer>
    </div>
  );
}
