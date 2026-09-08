import { useState } from "react";
import { especialistas, ejercicios, centroInfo } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles } from "../utils/appointments";

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

export default function InfoPanels({ seccion, citas, onChangeStatus, onReschedule, onClearData }) {
  if (seccion === "especialistas") return <section className="card" aria-labelledby="especialistas-titulo">
    <h2 id="especialistas-titulo">Profesionales disponibles</h2>
    <ul className="docs">{especialistas.map((item) => <li key={item.id} className="doc">
      <span className="avatar" aria-hidden="true">{item.foto}</span>
      <span><strong>{item.nombre}</strong><br />{item.especialidad}<br />{item.horario}</span>
    </li>)}</ul>
  </section>;

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
    {citas.length === 0 ? <p className="muted">Aún no hay citas. Puedes crear una desde “Solicitar cita”.</p> : <div className="appointment-list">
      {citas.map((cita) => <article className="appointment-card" key={cita.id}>
        <div><p className="eyebrow">Código {cita.codigo}</p><h3>{cita.esp}</h3><p>{cita.especialista}</p></div>
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

  if (seccion === "ejercicios") return <section className="card" aria-labelledby="ejercicios-titulo">
    <h2 id="ejercicios-titulo">Ejercicios de demostración</h2>
    <p className="alert info"><strong>Importante:</strong> este contenido no sustituye las indicaciones de un profesional de salud.</p>
    <article className="eje multimedia-card">
      <div><p className="eyebrow">Video con subtítulos y transcripción</p><h3>Movilidad suave de hombro</h3><p>Demostración visual de tres pasos básicos.</p></div>
      <video controls preload="metadata" poster="/ejercicios/movilidad-hombro.svg">
        <source src="/ejercicios/movilidad-hombro.mp4" type="video/mp4" />
        <track kind="captions" src="/ejercicios/movilidad-hombro.vtt" srcLang="es" label="Español" default />
        Su navegador no puede reproducir el video. Consulte la transcripción disponible debajo.
      </video>
      <details><summary>Leer transcripción del video</summary><ol><li>Siéntate con la espalda apoyada.</li><li>Eleva lentamente el brazo hasta donde resulte cómodo.</li><li>Baja el brazo despacio. Detente si sientes dolor.</li></ol></details>
    </article>
    <div className="exercise-grid">{ejercicios.slice(1).map((item) => <article key={item.id} className="eje"><h3>{item.titulo}</h3><p><strong>Nivel:</strong> {item.nivel}</p><p>{item.desc}</p></article>)}</div>
  </section>;

  if (seccion === "recordatorios") return <section className="card" aria-labelledby="recordatorios-titulo">
    <h2 id="recordatorios-titulo">Recordatorios de demostración</h2>
    <div className="alert">Mañana tienes terapia a las 09:00. Llega 15 minutos antes.</div>
    <div className="alert info">Recuerda traer tu documento de identificación y orden médica.</div>
  </section>;

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
