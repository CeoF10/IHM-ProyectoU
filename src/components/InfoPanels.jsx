import { useEffect, useState } from "react";
import { especialistas, ejercicios, centroInfo } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, obtenerProximasCitas } from "../utils/appointments";

function Recordatorios({ citas }) {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const reloj = setInterval(() => setAhora(new Date()), 30000);
    return () => clearInterval(reloj);
  }, []);
  const proximas = obtenerProximasCitas(citas, ahora);
  return <section className="card" aria-labelledby="recordatorios-titulo">
    <h2 id="recordatorios-titulo">Tus próximos recordatorios</h2>
    <p className="muted">Se actualizan con las citas pendientes de esta sesión.</p>
    {proximas.length === 0 ? <p role="status">No tienes citas pendientes por venir. Al confirmar una cita, aparecerá aquí.</p> :
      <ul className="reminder-list">{proximas.map((cita) => <li key={cita.id} className="alert">
        <h3>{cita.esp}</h3>
        <p>{cita.especialista}</p>
        <p><time dateTime={cita.fecha + "T" + cita.hora}>{new Date(cita.fecha + "T" + cita.hora).toLocaleString("es-EC", { dateStyle: "full", timeStyle: "short" })}</time></p>
        <p>Llega 15 minutos antes de tu cita.</p>
      </li>)}</ul>}
    <p className="alert info">Recuerda traer tu documento de identificación y orden médica.</p>
  </section>;
}

function RegistroForm() {
  const [datos, setDatos] = useState({ nombre: "", correo: "" });
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
      setMensaje(`Registro de demostración completado para ${datos.nombre}. No se enviaron datos.`);
      setDatos({ nombre: "", correo: "" });
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

    <button className="btn-primary" type="submit">Completar demostración</button>
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

export default function InfoPanels({ seccion, citas, onChangeStatus, onReschedule, onClearData, onLoadDemo }) {
  if (seccion === "especialistas") return <Especialistas />;

  if (seccion === "calendario") return <section className="card" aria-labelledby="calendario-titulo">
    <h2 id="calendario-titulo">Disponibilidad de los próximos días</h2>
    <p className="muted">Los cupos se calculan con los horarios de cada profesional y las citas no canceladas.</p>
    <div className="table-scroll" tabIndex="0" aria-label="Tabla desplazable de disponibilidad">
      <table className="calendar-table">
        <caption className="sr-only">Cantidad de horarios disponibles por profesional y día</caption>
        <thead><tr><th scope="col">Fecha</th>{especialistas.map((item) => <th scope="col" key={item.id}>{item.nombre}</th>)}</tr></thead>
        <tbody>{proximosDiasLaborables().map((dia) => {
          const fecha = fechaLocal(dia);
          return <tr key={fecha}>
            <th scope="row">{dia.toLocaleDateString("es-EC", { weekday: "short", day: "numeric", month: "short" })}</th>
            {especialistas.map((item) => {
              const total = obtenerHorariosDisponibles(item.nombre, fecha, citas).length;
              return <td key={item.id} className={total ? "slot free" : "slot occ"}>{total ? `${total} cupos` : "Sin atención"}</td>;
            })}
          </tr>;
        })}</tbody>
      </table>
    </div>
  </section>;

  if (seccion === "historial") return <section className="card" aria-labelledby="historial-titulo">
    <h2 id="historial-titulo">Mis citas de demostración</h2>
    <p className="privacy-note">Solo permanecen durante esta sesión del navegador. Nunca se conserva el número de cédula y los datos desaparecen al cerrar la pestaña.</p>
    {citas.length === 0 ? <div className="empty-appointments"><p className="muted">Aún no hay citas. Crea una desde “Solicitar cita” o carga ejemplos ficticios para recorrer las funciones de la demostración.</p><button type="button" className="btn-primary" onClick={onLoadDemo}>Cargar citas de ejemplo</button></div> : <div className="appointment-list">
      {citas.map((cita) => <article className="appointment-card" key={cita.id}>
        <div><p className="eyebrow">Código {cita.codigo}</p>{cita.esDemo && <p className="demo-record-label">Dato ficticio para la demostración</p>}<h3>{cita.esp}</h3><p>{cita.especialista}</p></div>
        <dl><div><dt>Paciente</dt><dd>{cita.nombre}</dd></div><div><dt>Fecha</dt><dd>{cita.fecha} · {cita.hora}</dd></div><div><dt>Estado</dt><dd><span className={`status status-${(cita.estado || "Pendiente").toLowerCase()}`}>{cita.estado || "Pendiente"}</span></dd></div></dl>
        <div className="appointment-actions">
          <button type="button" className="btn-secondary" onClick={() => onReschedule(cita)} disabled={cita.estado !== "Pendiente"}>Reprogramar</button>
          <button type="button" className="btn-danger" onClick={() => {
            if (window.confirm("¿Cancelar esta cita? El horario volverá a estar disponible.")) onChangeStatus(cita.id, "Cancelada");
          }} disabled={cita.estado !== "Pendiente"}>Cancelar cita</button>
        </div>
      </article>)}
    </div>}
    <div className="danger-zone">
      <h3>Datos de demostración</h3>
      <p>Elimina inmediatamente todas las citas de esta sesión.</p>
      <button type="button" className="btn-danger" disabled={citas.length === 0} onClick={() => {
        if (window.confirm("¿Eliminar todas las citas de demostración guardadas en este navegador?")) onClearData();
      }}>Borrar datos locales</button>
    </div>
  </section>;

  if (seccion === "ejercicios") return <EjerciciosSection />;


  if (seccion === "recordatorios") return <Recordatorios citas={citas} />;

  if (seccion === "centros") return <section className="card" aria-labelledby="centros-titulo">
    <h2 id="centros-titulo">Información del centro</h2>
    <p><strong>{centroInfo.nombre}</strong></p><address>{centroInfo.direccion}<br />Teléfono: {centroInfo.telefono}<br />{centroInfo.horario}</address>
    <p className="prototype-banner">Dirección y contacto usados únicamente como datos simulados para este proyecto académico.</p>
  </section>;

  if (seccion === "registro") return <section className="card" aria-labelledby="registro-titulo">
    <h2 id="registro-titulo">Registro de demostración</h2>
    <p className="muted">Valida el formulario localmente, pero no crea una cuenta ni guarda los datos.</p>
    <RegistroForm />
  </section>;

  return null;
}

function Especialistas() {
  const [consulta, setConsulta] = useState("");
  const filtrados = especialistas.filter((item) => `${item.nombre} ${item.especialidad}`.toLocaleLowerCase("es").includes(consulta.trim().toLocaleLowerCase("es")));
  return <section className="card" aria-labelledby="especialistas-titulo">
    <h2 id="especialistas-titulo">Profesionales disponibles</h2>
    <p className="muted">Busca por nombre o especialidad para encontrar a quién elegir en tu cita.</p>
    <label htmlFor="buscar-profesional">Buscar profesional o especialidad</label>
    <input id="buscar-profesional" type="search" value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Ej. fisioterapia" />
    <p className="sr-only" role="status" aria-live="polite">{filtrados.length} profesionales encontrados.</p>
    {filtrados.length ? <ul className="docs">{filtrados.map((item) => <li key={item.id} className="doc">
      <span className="avatar" aria-hidden="true">{item.foto}</span>
      <span><strong>{item.nombre}</strong><br />{item.especialidad}<br />{item.horario}</span>
    </li>)}</ul> : <p role="status" className="alert info">No encontramos profesionales con ese nombre o especialidad. Prueba con otra palabra.</p>}
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
    <section className="card" aria-labelledby="ejercicios-titulo">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 id="ejercicios-titulo">Ejercicios de rehabilitación guiados</h2>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            Videos explicativos con audio, subtítulos sincronizados y transcripción accesible. Fuente: <strong>FisioOnline</strong>.
          </p>
        </div>
        <span className="canal-tag">Canal: FisioOnline</span>
      </div>

      <p className="alert info" style={{ marginTop: "14px" }}>
        <strong>Importante:</strong> este contenido educativo es una guía de apoyo y no sustituye la valoración médica presencial de tu especialista.
      </p>

      <div className="exercise-tabs" role="tablist" aria-label="Selección de ejercicio" style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
        {ejercicios.map((ej) => {
          const seleccionado = ej.id === activo.id;
          return (
            <button
              key={ej.id}
              type="button"
              role="tab"
              aria-selected={seleccionado}
              className={seleccionado ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: "14px", padding: "8px 14px" }}
              onClick={() => {
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                setLeyendoVoz(false);
                setEjercicioActivoId(ej.id);
              }}
            >
              {seleccionado ? "▶ " : ""}{ej.titulo}
            </button>
          );
        })}
      </div>

      <article className="eje multimedia-card">
        <div>
          <p className="eyebrow">{activo.canal} &bull; {activo.especialista} &bull; {activo.duracion}</p>
          <h3>{activo.titulo}</h3>
          <p>{activo.desc}</p>
        </div>

        <video
          key={activo.id}
          controls
          preload="metadata"
          poster="/ejercicios/movilidad-hombro.svg"
          style={{ width: "100%", maxHeight: "440px", borderRadius: "10px", background: "#000" }}
        >
          <source src={activo.video} type="video/mp4" />
          <track kind="captions" src={activo.vtt} srcLang="es" label="Español" default />
          Su navegador no puede reproducir el video. Consulte la transcripción disponible debajo.
        </video>

        <details className="transcripcion-box" open>
          <summary>
            <strong>Leer transcripción completa ({activo.titulo})</strong>
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
                  {leyendoVoz ? "⏹ Detener lectura" : "🔊 Escuchar transcripción"}
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

      <h3 style={{ marginTop: "24px", marginBottom: "8px" }}>Catálogo de ejercicios de rehabilitación</h3>
      <p className="muted" style={{ margin: "0 0 14px" }}>
        Todos los videos provienen del mismo canal especializado (<strong>FisioOnline</strong>) para garantizar coherencia médica y técnica.
      </p>
      <div className="exercise-grid">
        {ejercicios.map((item) => (
          <article
            key={item.id}
            className={`eje ${item.id === activo.id ? "eje-seleccionado" : ""}`}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: "4px" }}>{item.canal} &bull; {item.duracion}</p>
              <h3>{item.titulo}</h3>
              <p><strong>Nivel:</strong> {item.nivel}</p>
              <p>{item.desc}</p>
            </div>
            <button
              type="button"
              className={item.id === activo.id ? "btn-primary" : "btn-secondary"}
              style={{ marginTop: "12px", width: "100%" }}
              onClick={() => {
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                setLeyendoVoz(false);
                setEjercicioActivoId(item.id);
              }}
            >
              {item.id === activo.id ? "▶ Viendo ahora" : "Ver video y transcripción"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

