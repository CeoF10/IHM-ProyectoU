import { useEffect, useRef, useState } from "react";
import { especialistas } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, validarIdentificador } from "../utils/appointments";

export default function GuiaPasoAPasoForm({ form, setForm, citas, editandoId, onConfirm }) {
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState("");
  const tituloRef = useRef(null);
  const errorRef = useRef(null);
  const fechaMinima = fechaLocal();
  const horarios = obtenerHorariosDisponibles(form.especialista, form.fecha, citas, editandoId);

  useEffect(() => {
    tituloRef.current?.focus();
  }, [paso]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const actualizar = (campo, valor, extras = {}) => {
    setForm((actual) => ({ ...actual, [campo]: valor, ...extras }));
    setError("");
  };

  const siguiente = () => {
    setError("");
    if (paso === 1) {
      if (form.nombre.trim().length < 3) return setError("Escriba su nombre completo. Ejemplo: Rosa García.");
      if (!validarIdentificador(form.identificador)) return setError("Escriba solamente los últimos 4 números de su cédula. Ejemplo: 4567.");
      return setPaso(2);
    }
    if (paso === 2) {
      if (!form.especialista) return setError("Elija un profesional con el botón Seleccionar.");
      return setPaso(3);
    }
    if (!form.fecha) return setError("Elija el día de la cita.");
    if (form.fecha < fechaMinima) return setError("La fecha no puede estar en el pasado.");
    if (!form.hora || !horarios.includes(form.hora)) return setError("Elija una de las horas disponibles.");
    onConfirm({ ...form, modo: "Guía paso a paso" });
  };

  const volver = () => {
    setError("");
    setPaso((actual) => Math.max(1, actual - 1));
  };

  return (
    <section className="card guiada" aria-label="Solicitud de cita con guía paso a paso">
      <div className="form-header"><div><p className="eyebrow">Proceso acompañado</p><h2 ref={tituloRef} tabIndex={-1}>Solicitud guiada</h2><p className="muted grande">Un paso a la vez. Puedes regresar sin perder tus datos.</p></div><span className="privacy-badge">Paso {paso} de 4</span></div>
      <ol className="pasos" aria-label={`Paso ${paso} de 4`}>
        <li aria-current={paso === 1 ? "step" : undefined} className={paso >= 1 ? "on" : ""}>1. Datos</li>
        <li aria-current={paso === 2 ? "step" : undefined} className={paso >= 2 ? "on" : ""}>2. Profesional</li>
        <li aria-current={paso === 3 ? "step" : undefined} className={paso >= 3 ? "on" : ""}>3. Fecha</li>
        <li>4. Confirmación</li>
      </ol>

      {error && <p ref={errorRef} tabIndex={-1} role="alert" className="err grande">{error}</p>}

      {paso === 1 && <div>
        <label htmlFor="guia-nombre">Nombre completo *</label>
        <input id="guia-nombre" className="big" value={form.nombre} onChange={(ev) => actualizar("nombre", ev.target.value)} placeholder="Ejemplo: Rosa García" autoComplete="name" />
        <label htmlFor="guia-identificador">Últimos 4 números de la cédula *</label>
        <input id="guia-identificador" className="big" value={form.identificador} onChange={(ev) => actualizar("identificador", ev.target.value)} inputMode="numeric" maxLength="4" autoComplete="off" placeholder="Ejemplo: 4567" />
        <p className="field-help grande">No guardaremos estos cuatro números.</p>
      </div>}

      {paso === 2 && <ul className="docs">
        {especialistas.map((item) => <li key={item.id} className={form.especialista === item.nombre ? "doc sel" : "doc"}>
          <span className="avatar" aria-hidden="true">{item.foto}</span>
          <span><strong>{item.nombre}</strong><br />{item.especialidad}<br />{item.horario}</span>
          <button type="button" className="btn-big" onClick={() => actualizar("especialista", item.nombre, { esp: item.especialidad, fecha: "", hora: "" })} aria-pressed={form.especialista === item.nombre}>
            {form.especialista === item.nombre ? "Seleccionado" : "Seleccionar"}
          </button>
        </li>)}
      </ul>}

      {paso === 3 && <div>
        <label htmlFor="guia-fecha">Día de la cita *</label>
        <input id="guia-fecha" type="date" min={fechaMinima} className="big" value={form.fecha} onChange={(ev) => actualizar("fecha", ev.target.value, { hora: "" })} />
        <p className="field-label grande" id="guia-hora">Horas disponibles *</p>
        <div className="chips big-chips" role="group" aria-labelledby="guia-hora">
          {horarios.map((hora) => <button key={hora} type="button" className={form.hora === hora ? "chip active" : "chip"} onClick={() => actualizar("hora", hora)} aria-pressed={form.hora === hora}>{hora}</button>)}
        </div>
        <p className="field-help grande">{!form.fecha ? "Primero elija el día." : horarios.length ? `${horarios.length} horarios disponibles.` : "El profesional no atiende o ya no tiene cupos ese día. Elija otra fecha."}</p>
      </div>}

      <div className="nav-pasos">
        {paso > 1 && <button type="button" className="btn-sec-big" onClick={volver}>← Atrás</button>}
        <button type="button" className="btn-big" onClick={siguiente}>{paso === 3 ? "Revisar cita →" : "Siguiente →"}</button>
      </div>
    </section>
  );
}
