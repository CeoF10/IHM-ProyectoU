import { useEffect, useRef, useState } from "react";
import { especialistas } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, validarIdentificador } from "../utils/appointments";

export default function GuiaPasoAPasoForm({ form, setForm, citas, editandoId, onConfirm }) {
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState("");
  const [campoError, setCampoError] = useState("");
  const tituloRef = useRef(null);
  const errorRef = useRef(null);
  const fechaMinima = fechaLocal();
  const horarios = obtenerHorariosDisponibles(form.especialista, form.fecha, citas, editandoId);
  const titulosPaso = ["Tus datos", "Elige un profesional", "Elige fecha y hora"];

  useEffect(() => {
    tituloRef.current?.focus();
  }, [paso]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const actualizar = (campo, valor, extras = {}) => {
    setForm((actual) => ({ ...actual, [campo]: valor, ...extras }));
    setError("");
    setCampoError("");
  };

  const mostrarError = (campo, mensaje) => {
    setCampoError(campo);
    setError(mensaje);
  };

  const siguiente = () => {
    setError("");
    if (paso === 1) {
      if (form.nombre.trim().length < 3) return mostrarError("nombre", "Escriba su nombre completo. Ejemplo: Rosa García.");
      if (!validarIdentificador(form.identificador)) return mostrarError("identificador", "Escribe los 10 dígitos de tu cédula, sin espacios ni guiones.");
      return setPaso(2);
    }
    if (paso === 2) {
      if (!form.especialista) return mostrarError("especialista", "Elija un profesional con el botón Seleccionar.");
      return setPaso(3);
    }
    if (!form.fecha) return mostrarError("fecha", "Elija el día de la cita.");
    if (form.fecha < fechaMinima) return mostrarError("fecha", "La fecha no puede estar en el pasado.");
    if (!form.hora || !horarios.includes(form.hora)) return mostrarError("hora", "Elija una de las horas disponibles.");
    onConfirm(form);
  };

  const volver = () => {
    setError("");
    setCampoError("");
    setPaso((actual) => Math.max(1, actual - 1));
  };

  return (
    <section className="card guiada" aria-label="Solicitud de cita con guía paso a paso">
      <div className="form-header"><div><p className="eyebrow">Paso {paso} de 3</p><h2 ref={tituloRef} tabIndex={-1}>{titulosPaso[paso - 1]}</h2></div></div>
      <ol className="pasos" aria-label={`Paso ${paso} de 3`}>
        <li aria-current={paso === 1 ? "step" : undefined} className={paso >= 1 ? "on" : ""}>1. Datos</li>
        <li aria-current={paso === 2 ? "step" : undefined} className={paso >= 2 ? "on" : ""}>2. Profesional</li>
        <li aria-current={paso === 3 ? "step" : undefined} className={paso >= 3 ? "on" : ""}>3. Fecha</li>
      </ol>

      {error && <p id="solicitud-error" ref={errorRef} tabIndex={-1} role="alert" className="err grande">{error}</p>}

      {paso === 1 && <div className="form-fields">
        <label htmlFor="guia-nombre">Nombre completo *</label>
        <input id="guia-nombre" className="big" value={form.nombre} onChange={(ev) => actualizar("nombre", ev.target.value)} placeholder="Ejemplo: Rosa García" autoComplete="name" aria-invalid={campoError === "nombre"} aria-describedby={campoError === "nombre" ? "solicitud-error" : undefined} />
        <label htmlFor="guia-identificador">Número de cédula *</label>
        <input id="guia-identificador" className="big" value={form.identificador} onChange={(ev) => actualizar("identificador", ev.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength="10" autoComplete="off" placeholder="10 dígitos" aria-invalid={campoError === "identificador"} aria-describedby={campoError === "identificador" ? "solicitud-error guia-identificador-ayuda" : "guia-identificador-ayuda"} />
        <p id="guia-identificador-ayuda" className="field-help">Tu cédula no se guarda al confirmar la cita.</p>
      </div>}

      {paso === 2 && <ul className="docs">
        {especialistas.map((item) => <li key={item.id} className={form.especialista === item.nombre ? "doc sel" : "doc"}>
          <span className={`professional-portrait portrait-${item.id}`} aria-hidden="true" />
          <span><strong>{item.nombre}</strong><br />{item.especialidad}<br /><small>{item.horario}</small></span>
          <button type="button" className="btn-big" onClick={() => actualizar("especialista", item.nombre, { esp: item.especialidad, fecha: "", hora: "" })} aria-pressed={form.especialista === item.nombre} aria-label={`${form.especialista === item.nombre ? "Seleccionado" : "Seleccionar"}: ${item.nombre}, ${item.especialidad}`} aria-describedby={campoError === "especialista" ? "solicitud-error" : undefined}>
            {form.especialista === item.nombre ? "Seleccionado" : "Seleccionar"}
          </button>
        </li>)}
      </ul>}

      {paso === 3 && <div className="form-fields">
        <label htmlFor="guia-fecha">Día de la cita *</label>
        <input id="guia-fecha" type="date" min={fechaMinima} className="big" value={form.fecha} onChange={(ev) => actualizar("fecha", ev.target.value, { hora: "" })} aria-invalid={campoError === "fecha"} aria-describedby={campoError === "fecha" ? "solicitud-error" : undefined} />
        <p className="field-label grande" id="guia-hora">Horas disponibles *</p>
        <div className="chips big-chips" role="group" aria-labelledby="guia-hora" aria-describedby={campoError === "hora" ? "solicitud-error" : undefined}>
          {horarios.map((hora) => <button key={hora} type="button" className={form.hora === hora ? "chip active" : "chip"} onClick={() => actualizar("hora", hora)} aria-pressed={form.hora === hora}>{hora}</button>)}
        </div>
        <p className="field-help grande">{!form.fecha ? "Primero elija el día." : horarios.length ? `${horarios.length} horarios disponibles.` : "El profesional no atiende o ya no tiene cupos ese día. Elija otra fecha."}</p>
      </div>}

      <div className="nav-pasos">
        {paso > 1 && <button type="button" className="btn-sec-big" onClick={volver}>Atrás</button>}
        <button type="button" className="btn-big" onClick={siguiente}>{paso === 3 ? "Revisar cita" : "Siguiente"}</button>
      </div>
    </section>
  );
}
