import { useEffect, useState } from "react";
import { especialistas, ejercicios, centroInfo } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, obtenerProximasCitas } from "../utils/appointments";
import Icon from "./Icon";

function Recordatorios({ citas, onNavigate }) {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const reloj = setInterval(() => setAhora(new Date()), 30000);
    return () => clearInterval(reloj);
  }, []);
  const proximas = obtenerProximasCitas(citas, ahora);
  const hoy = fechaLocal(ahora);
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);
  const fechaManana = fechaLocal(manana);
  return <section className="card reminders-page" aria-labelledby="recordatorios-titulo">
    <div className="section-heading"><h2 id="recordatorios-titulo">Próximas citas</h2><p>Ten a mano los detalles de tu siguiente visita.</p></div>
    {proximas.length === 0 ? <div className="empty-state" role="status"><span className="empty-state-icon"><Icon name="calendar" /></span><div><h3>Todo al día</h3><p>Cuando confirmes una cita, verás aquí su fecha y hora.</p><button type="button" className="btn-primary" onClick={() => onNavigate("cita")}>Solicitar cita</button></div></div> :
      <ul className="reminder-list">{proximas.map((cita) => <li key={cita.id} className="reminder-item">
        <time className="reminder-date" dateTime={cita.fecha} aria-label={new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { dateStyle: "full" })}><strong>{new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { day: "2-digit" })}</strong><span>{new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { month: "short" })}</span></time>
        <div><p className="reminder-when">{cita.fecha === hoy ? "Hoy" : cita.fecha === fechaManana ? "Mañana" : new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" })}</p><h3>{cita.esp}</h3><p>{cita.especialista}</p><p><Icon name="clock" /> <time dateTime={cita.fecha + "T" + cita.hora}>{cita.hora}</time> · {centroInfo.nombre}</p><button type="button" className="context-link" onClick={() => onNavigate("historial")}>Ver detalle de la cita</button></div>
      </li>)}</ul>}
    <div className="visit-prep"><h3>Antes de acudir</h3><ul><li><Icon name="check" /> Documento de identidad</li><li><Icon name="check" /> Indicación médica</li><li><Icon name="check" /> Llega 15 minutos antes</li></ul></div>
  </section>;
}

function Historial({ citas, perfil, onNavigate, onReschedule, onChangeStatus, onLoadDemo, onClearData }) {
  const [filtro, setFiltro] = useState("Todas");
  const opciones = ["Todas", "Pendiente", "Atendida", "Cancelada"];
  const visibles = citas.filter((cita) => filtro === "Todas" || (cita.estado || "Pendiente") === filtro);

  return <section className="card" aria-labelledby="historial-titulo">
    <div className="section-heading"><h2 id="historial-titulo">Tus citas</h2><p>{citas.length ? `${citas.length} ${citas.length === 1 ? "cita registrada" : "citas registradas"}` : "Consulta aquí tus solicitudes."}</p></div>
    {citas.length > 0 && <div className="appointment-filters" role="group" aria-label="Filtrar citas por estado">{opciones.map((opcion) => <button key={opcion} type="button" className={filtro === opcion ? "filter-chip active" : "filter-chip"} aria-pressed={filtro === opcion} onClick={() => setFiltro(opcion)}>{opcion === "Todas" ? "Todas" : opcion === "Pendiente" ? "Pendientes" : opcion === "Atendida" ? "Atendidas" : "Canceladas"}</button>)}</div>}
    {citas.length === 0 ? <div className="empty-state"><span className="empty-state-icon"><Icon name="calendar" /></span><div><h3>Aún no tienes citas</h3><p>Elige un profesional y un horario para empezar.</p><button type="button" className="btn-primary" onClick={() => onNavigate("cita")}>Solicitar una cita</button></div></div> : visibles.length === 0 ? <div className="empty-state" role="status"><span className="empty-state-icon"><Icon name="calendar" /></span><div><h3>No hay citas {filtro.toLowerCase()}s</h3><p>Prueba con otro estado para ver tus citas.</p></div></div> : <div className="appointment-list">
      {visibles.map((cita) => <article className="appointment-card" key={cita.id}>
        <div className="appointment-top"><time className="appointment-date" dateTime={cita.fecha} aria-label={new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { dateStyle: "full" })}><strong>{new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { day: "2-digit" })}</strong><span>{new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-EC", { month: "short" })}</span></time><div><p className="eyebrow">Código {cita.codigo}</p>{cita.esDemo && <p className="demo-record-label">Cita de ejemplo</p>}<h3>{cita.esp}</h3><p>{cita.especialista}</p></div></div>
        <dl><div><dt>Paciente</dt><dd>{cita.nombre}</dd></div><div><dt>Hora</dt><dd>{cita.hora}</dd></div><div><dt>Estado</dt><dd><span className={`status status-${(cita.estado || "Pendiente").toLowerCase()}`}>{cita.estado || "Pendiente"}</span></dd></div></dl>
        <div className="appointment-actions">
          <button type="button" className="btn-secondary" onClick={() => onReschedule(cita)} disabled={cita.estado !== "Pendiente"}>Reprogramar</button>
          <button type="button" className="btn-danger" onClick={() => {
            if (window.confirm("¿Cancelar esta cita? El horario volverá a estar disponible.")) onChangeStatus(cita.id, "Cancelada");
          }} disabled={cita.estado !== "Pendiente"}>Cancelar cita</button>
        </div>
      </article>)}
    </div>}
    <details className="session-details"><summary>Datos y privacidad</summary>
      <p>Las citas y tus datos de registro permanecen en esta pestaña. La cédula no se guarda.</p>
      <div className="session-actions"><button type="button" className="btn-secondary" onClick={onLoadDemo}>Cargar citas de ejemplo</button>
      <button type="button" className="btn-danger" disabled={citas.length === 0 && !perfil} onClick={() => {
        if (window.confirm("¿Eliminar las citas y tus datos guardados en esta pestaña?")) onClearData();
      }}>Borrar mis datos</button></div>
    </details>
  </section>;
}

function RegistroForm({ perfil, onSaveProfile }) {
  const [datos, setDatos] = useState(perfil || { nombre: "", correo: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const actualizar = (campo, valor) => {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => {
      const siguientes = { ...actuales };
      delete siguientes[campo];
      return siguientes;
    });
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const nuevos = {};
    if (datos.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre completo. Ejemplo: Ana Pérez.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) nuevos.correo = "Escribe un correo válido. Ejemplo: nombre@correo.com";
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) {
      onSaveProfile({ nombre: datos.nombre.trim(), correo: datos.correo.trim() });
      setMensaje("Datos guardados. Tu nombre aparecerá al solicitar una cita.");
    } else {
      setMensaje("");
    }
  };

  return <form onSubmit={enviar} noValidate>
    {Object.keys(errores).length > 0 && <p className="error-summary" role="alert">Corrige los campos señalados.</p>}
    <label htmlFor="registro-nombre">Nombre *</label>
    <input id="registro-nombre" value={datos.nombre} onChange={(ev) => actualizar("nombre", ev.target.value)} placeholder="Nombre completo" autoComplete="name" aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "registro-nombre-error" : undefined} />
    {errores.nombre && <p id="registro-nombre-error" className="err">{errores.nombre}</p>}

    <label htmlFor="registro-correo">Correo *</label>
    <input id="registro-correo" value={datos.correo} onChange={(ev) => actualizar("correo", ev.target.value)} type="email" placeholder="correo@ejemplo.com" autoComplete="email" aria-invalid={!!errores.correo} aria-describedby={errores.correo ? "registro-correo-error" : undefined} />
    {errores.correo && <p id="registro-correo-error" className="err">{errores.correo}</p>}

    <button className="btn-primary" type="submit">Guardar mis datos</button>
    {mensaje && <p className="okmsg" role="status">{mensaje}</p>}
  </form>;
}

function proximosDiasLaborables(cantidad = 5) {
  const dias = [];
  const cursor = new Date();
  while (dias.length < cantidad) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) dias.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}

export default function InfoPanels({ seccion, citas, perfil, onSaveProfile, onChangeStatus, onReschedule, onClearData, onLoadDemo, onNavigate, onChooseSpecialist }) {
  if (seccion === "especialistas") return <Especialistas onChooseSpecialist={onChooseSpecialist} />;

  if (seccion === "calendario") return <section className="card availability-page" aria-labelledby="calendario-titulo">
    <div className="section-heading"><h2 id="calendario-titulo">Próximos cinco días</h2><p>Elige un cupo para continuar con la solicitud.</p></div>
    <p className="mobile-scroll-hint">Desliza la tabla para ver más profesionales.</p>
    <div className="table-scroll" tabIndex="0" aria-label="Tabla desplazable de disponibilidad">
      <table className="calendar-table">
        <caption className="sr-only">Cantidad de horarios disponibles por profesional y día</caption>
        <thead><tr><th scope="col">Fecha</th>{especialistas.map((item) => <th scope="col" key={item.id}><span>{item.nombre}</span><small>{item.especialidad}</small></th>)}</tr></thead>
        <tbody>{proximosDiasLaborables().map((dia) => {
          const fecha = fechaLocal(dia);
          return <tr key={fecha}>
            <th scope="row">{dia.toLocaleDateString("es-EC", { weekday: "short", day: "numeric", month: "short" })}</th>
            {especialistas.map((item) => {
              const total = obtenerHorariosDisponibles(item.nombre, fecha, citas).length;
              return <td key={item.id} className={total ? "slot free" : "slot occ"}>{total ? <button type="button" className="availability-choice" onClick={() => onChooseSpecialist(item, fecha)} aria-label={`${total} cupos con ${item.nombre} el ${dia.toLocaleDateString("es-EC", { dateStyle: "full" })}. Solicitar cita.`}><strong>{total} cupos</strong><span>Elegir horario</span></button> : <span className="no-slots">Sin atención</span>}</td>;
            })}
          </tr>;
        })}</tbody>
      </table>
    </div><p className="availability-hint">Los horarios concretos se muestran al continuar con la cita.</p>
  </section>;

  if (seccion === "historial") return <Historial citas={citas} perfil={perfil} onNavigate={onNavigate} onReschedule={onReschedule} onChangeStatus={onChangeStatus} onLoadDemo={onLoadDemo} onClearData={onClearData} />;

  if (seccion === "ejercicios") return <EjerciciosSection />;


  if (seccion === "recordatorios") return <Recordatorios citas={citas} onNavigate={onNavigate} />;

  if (seccion === "centros") return <section className="card center-page" aria-labelledby="centros-titulo">
    <div className="center-hero"><img src={centroInfo.foto} alt="Fachada del Hospital del IESS en Guaranda" />
      <div className="center-hero-copy"><p className="eyebrow">Red de atención IESS · Bolívar</p><h2 id="centros-titulo">{centroInfo.nombre}</h2><p>{centroInfo.subtitulo}</p></div></div>
    <div className="center-details"><div><h3>Ubicación</h3><address>{centroInfo.direccion}</address><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centroInfo.nombre + " " + centroInfo.direccion)}`} target="_blank" rel="noreferrer">Ver cómo llegar ↗</a></div>
      <div><h3>Contacto</h3><p><a href={`tel:+593${centroInfo.telefono.replace(/\D/g, "").slice(1)}`}>{centroInfo.telefono}</a></p><a href={centroInfo.fuente} target="_blank" rel="noreferrer">Consultar directorio del IESS ↗</a></div>
      <div><h3>Horarios de atención</h3><p>Consulta el horario vigente antes de acudir.</p><a href={centroInfo.fuente} target="_blank" rel="noreferrer">Ver información oficial ↗</a></div></div>
    <div className="center-next"><div><h3>¿Listo para solicitar una cita?</h3><p>Elige un profesional y continúa con la solicitud guiada.</p></div><button type="button" className="btn-primary" onClick={() => onNavigate("cita")}>Solicitar cita</button></div>
    <p className="image-credit">Imagen: <a href={centroInfo.fuenteFoto} target="_blank" rel="noreferrer">archivo institucional del IESS</a>.</p>
  </section>;

  if (seccion === "registro") return <section className="card profile-page" aria-labelledby="registro-titulo">
    <div className="profile-intro"><span className="profile-mark"><Icon name="user" /></span><h2 id="registro-titulo">Tus datos, a mano</h2><p>Tu nombre se completa automáticamente al solicitar una cita.</p><div className="profile-detail"><Icon name="check" /> Puedes actualizarlos cuando quieras</div></div>
    <div className="profile-form"><h3>Información personal</h3><RegistroForm perfil={perfil} onSaveProfile={onSaveProfile} /></div>
  </section>;

  return null;
}

function Especialistas({ onChooseSpecialist }) {
  const [consulta, setConsulta] = useState("");
  const [area, setArea] = useState("Todas");
  const areas = ["Todas", ...new Set(especialistas.map((item) => item.especialidad))];
  const filtrados = especialistas.filter((item) => (area === "Todas" || item.especialidad === area) && `${item.nombre} ${item.especialidad}`.toLocaleLowerCase("es").includes(consulta.trim().toLocaleLowerCase("es")));
  return <section className="card" aria-labelledby="especialistas-titulo">
    <h2 id="especialistas-titulo">Elige tu profesional</h2>
    <p className="section-lead">Encuentra el área de atención que necesitas y continúa con una sola solicitud de cita.</p>
    <label htmlFor="buscar-profesional">Buscar profesional o especialidad</label>
    <input id="buscar-profesional" type="search" value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Ej. fisioterapia" />
    <div className="professional-filters" role="group" aria-label="Filtrar por especialidad">{areas.map((opcion) => <button type="button" className={area === opcion ? "filter-chip active" : "filter-chip"} key={opcion} aria-pressed={area === opcion} onClick={() => setArea(opcion)}>{opcion}</button>)}</div>
    <p className="sr-only" role="status" aria-live="polite">{filtrados.length} profesionales encontrados.</p>
    {filtrados.length ? <ul className="professional-grid">{filtrados.map((item) => <li key={item.id} className="professional-card">
      <span className={`professional-portrait portrait-${item.id}`} aria-hidden="true" />
      <div className="professional-details"><span className="specialty-pill">{item.especialidad}</span><h3>{item.nombre}</h3><p>{item.enfoque}</p><div className="professional-schedule"><Icon name="calendar" /> <span>{item.horario}</span></div><button className="btn-primary" type="button" onClick={() => onChooseSpecialist(item)}>Solicitar cita</button></div>
    </li>)}</ul> : <p role="status" className="alert info">No encontramos profesionales con ese nombre o especialidad. Prueba con otra palabra.</p>}
    <p className="image-credit">Profesionales y horarios referenciales para este proyecto académico; retratos ilustrativos.</p>
  </section>;
}

function EjerciciosSection() {
  const [ejercicioActivoId, setEjercicioActivoId] = useState(1);
  const [leyendoVoz, setLeyendoVoz] = useState(false);

  const activo = ejercicios.find((e) => e.id === ejercicioActivoId) || ejercicios[0];

  const hablarTranscripcion = () => {
    if (!("speechSynthesis" in window)) return;
    if (leyendoVoz) {
      window.speechSynthesis.cancel();
      setLeyendoVoz(false);
      return;
    }
    window.speechSynthesis.cancel();
    const texto = `${activo.titulo}. Ejercicio del canal ${activo.canal}, guiado por ${activo.especialista}. ${activo.transcripcion}`;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-EC";
    utterance.rate = 0.95;
    utterance.onend = () => setLeyendoVoz(false);
    utterance.onerror = () => setLeyendoVoz(false);
    setLeyendoVoz(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [ejercicioActivoId]);

  return (
    <section className="card exercises-page" aria-labelledby="ejercicios-titulo">
      <div className="section-heading"><h2 id="ejercicios-titulo">Muévete a tu ritmo</h2><p>Elige un video. Todos incluyen subtítulos y transcripción.</p></div>
      <div className="exercise-workspace">
      <div className="exercise-playlist" aria-label="Elegir ejercicio">
        {ejercicios.map((ej) => <button key={ej.id} type="button" className={ej.id === activo.id ? "playlist-item selected" : "playlist-item"} aria-pressed={ej.id === activo.id} onClick={() => {
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
          setLeyendoVoz(false);
          setEjercicioActivoId(ej.id);
        }}><img src={ej.poster} alt="" /><span><strong>{ej.titulo}</strong><small>{ej.duracion} · {ej.nivel}</small></span></button>)}
      </div>
      <article className="eje multimedia-card">
        <div>
          <p className="eyebrow">{activo.duracion} · {activo.nivel}</p>
          <h3>{activo.titulo}</h3>
          <p>{activo.desc}</p>
        </div>

        <video
          key={activo.id}
          controls
          preload="metadata"
          poster={activo.poster}
          style={{ width: "100%", maxHeight: "440px", borderRadius: "10px", background: "#000" }}
        >
          <source src={activo.video} type="video/mp4" />
          <track kind="captions" src={activo.vtt} srcLang="es" label="Español" default />
          Su navegador no puede reproducir el video. Consulte la transcripción disponible debajo.
        </video>

        <details className="transcripcion-box">
          <summary>
            <strong>Pasos y transcripción</strong>
          </summary>
          <div className="transcripcion-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", margin: "10px 0" }}>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--muted)" }}>
                <strong>Canal:</strong> {activo.canal} &bull; <strong>Especialista:</strong> {activo.especialista} &bull; <strong>Nivel:</strong> {activo.nivel} &bull; <strong>Duración:</strong> {activo.duracion}
              </p>
              {"speechSynthesis" in window && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: "13px", padding: "6px 12px" }}
                  onClick={hablarTranscripcion}
                >
                  <Icon name={leyendoVoz ? "stop" : "volume"} /> {leyendoVoz ? "Detener lectura" : "Escuchar transcripción"}
                </button>
              )}
            </div>

            <div style={{ background: "#edf2fa", padding: "12px 16px", borderRadius: "8px", margin: "12px 0" }}>
              <h4 style={{ margin: "0 0 6px", color: "var(--primary-dark)" }}>Pasos clave explicados en el video:</h4>
              <ol style={{ margin: 0, paddingLeft: "20px" }}>
                {activo.pasos.map((paso, idx) => (
                  <li key={idx} style={{ marginBottom: "4px" }}>{paso}</li>
                ))}
              </ol>
            </div>

            <h4 style={{ margin: "14px 0 6px", color: "var(--primary-dark)" }}>Transcripción textual de la locución:</h4>
            {activo.transcripcion.split("\n\n").map((parrafo, idx) => (
              <p key={idx} style={{ margin: "8px 0", lineHeight: "1.6" }}>{parrafo}</p>
            ))}
          </div>
        </details>
      </article>
      </div>
      <p className="exercise-source">Videos: {activo.canal}. Esta guía acompaña la atención profesional; detén el ejercicio si sientes dolor.</p>
    </section>
  );
}
