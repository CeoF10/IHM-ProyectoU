import { useEffect, useRef, useState } from "react";
import { especialistas } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, validarIdentificador } from "../utils/appointments";

export default function VistaRapidaForm({ form, setForm, citas, editandoId, onConfirm }) {
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);
  const fechaMinima = fechaLocal();
  const especialistasFiltrados = especialistas.filter((item) => item.especialidad === form.esp);
  const horarios = obtenerHorariosDisponibles(form.especialista, form.fecha, citas, editandoId);

  useEffect(() => {
    const primero = Object.keys(errores)[0];
    if (!primero) return;
    const selector = primero === "hora" ? "[data-hours] button, #j-fecha" : `#j-${primero}`;
    formRef.current?.querySelector(selector)?.focus();
  }, [errores]);

  const actualizar = (campo, valor, extras = {}) => {
    setForm((actual) => ({ ...actual, [campo]: valor, ...extras }));
    setErrores((actuales) => {
      const siguientes = { ...actuales };
      delete siguientes[campo];
      return siguientes;
    });
  };

  const validar = () => {
    const nuevos = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre completo. Ejemplo: Juan Pérez.";
    if (!validarIdentificador(form.identificador)) nuevos.identificador = "Escribe únicamente los últimos 4 números. Ejemplo: 4567.";
    if (!form.esp) nuevos.esp = "Selecciona una especialidad.";
    if (!form.especialista || !especialistasFiltrados.some((item) => item.nombre === form.especialista)) nuevos.especialista = "Elige un profesional de la especialidad seleccionada.";
    if (!form.fecha) nuevos.fecha = "Elige una fecha.";
    else if (form.fecha < fechaMinima) nuevos.fecha = "La fecha no puede estar en el pasado.";
    if (!form.hora || !horarios.includes(form.hora)) nuevos.hora = horarios.length ? "Elige una hora disponible." : "No hay horarios disponibles para esa fecha.";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validar()) onConfirm({ ...form, modo: "Vista rápida" });
  };

  const input = (campo) => ({
    id: `j-${campo}`,
    value: form[campo],
    onChange: (ev) => actualizar(campo, ev.target.value),
    "aria-invalid": !!errores[campo],
    "aria-describedby": errores[campo] ? `j-${campo}-err` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={submit} className="card" noValidate aria-label="Solicitud de cita en vista rápida">
      <div className="form-header"><div><p className="eyebrow">Nueva solicitud</p><h2>Completa los datos de la cita</h2><p className="muted">Todo en una pantalla. Los campos con * son obligatorios.</p></div><span className="privacy-badge">Datos temporales</span></div>
      {Object.keys(errores).length > 0 && <p className="error-summary" role="alert">Revisa los campos señalados antes de continuar.</p>}
      <div className="grid2">
        <div>
          <label htmlFor="j-nombre">Nombre completo *</label>
          <input {...input("nombre")} placeholder="Juan Pérez" autoComplete="name" />
          {errores.nombre && <p id="j-nombre-err" className="err">{errores.nombre}</p>}
        </div>
        <div>
          <label htmlFor="j-identificador">Últimos 4 números de la cédula *</label>
          <input {...input("identificador")} inputMode="numeric" maxLength="4" autoComplete="off" placeholder="4567" />
          <p className="field-help">Se utiliza solo durante la solicitud y no se guarda.</p>
          {errores.identificador && <p id="j-identificador-err" className="err">{errores.identificador}</p>}
        </div>
        <div>
          <label htmlFor="j-esp">Especialidad *</label>
          <select id="j-esp" value={form.esp} onChange={(ev) => actualizar("esp", ev.target.value, { especialista: "", fecha: "", hora: "" })} aria-invalid={!!errores.esp} aria-describedby={errores.esp ? "j-esp-err" : undefined}>
            <option value="">Selecciona una opción</option>
            {[...new Set(especialistas.map((item) => item.especialidad))].map((especialidad) => <option key={especialidad}>{especialidad}</option>)}
          </select>
          {errores.esp && <p id="j-esp-err" className="err">{errores.esp}</p>}
        </div>
        <div>
          <label htmlFor="j-especialista">Profesional *</label>
          <select id="j-especialista" value={form.especialista} onChange={(ev) => actualizar("especialista", ev.target.value, { fecha: "", hora: "" })} disabled={!form.esp} aria-invalid={!!errores.especialista} aria-describedby={errores.especialista ? "j-especialista-err" : undefined}>
            <option value="">{form.esp ? "Selecciona un profesional" : "Primero elige una especialidad"}</option>
            {especialistasFiltrados.map((item) => <option key={item.id} value={item.nombre}>{item.nombre} · {item.horario}</option>)}
          </select>
          {errores.especialista && <p id="j-especialista-err" className="err">{errores.especialista}</p>}
        </div>
        <div>
          <label htmlFor="j-fecha">Fecha *</label>
          <input type="date" min={fechaMinima} disabled={!form.especialista} {...input("fecha")} onChange={(ev) => actualizar("fecha", ev.target.value, { hora: "" })} />
          {errores.fecha && <p id="j-fecha-err" className="err">{errores.fecha}</p>}
        </div>
        <div>
          <span id="j-hora-label" className="field-label">Hora disponible *</span>
          <div className="chips" data-hours role="group" aria-labelledby="j-hora-label" aria-describedby={errores.hora ? "j-hora-err" : "j-hora-help"}>
            {horarios.map((hora) => <button key={hora} type="button" className={form.hora === hora ? "chip active" : "chip"} onClick={() => actualizar("hora", hora)} aria-pressed={form.hora === hora}>{hora}</button>)}
          </div>
          <p id="j-hora-help" className="field-help">{!form.fecha ? "Elige profesional y fecha para consultar horarios." : horarios.length === 0 ? "Ese profesional no atiende o ya no tiene cupos en la fecha seleccionada." : `${horarios.length} horarios disponibles.`}</p>
          {errores.hora && <p id="j-hora-err" className="err">{errores.hora}</p>}
        </div>
      </div>
      <div className="form-footer"><p><strong>Siguiente:</strong> podrás revisar todo antes de confirmar.</p><button type="submit" className="btn-primary">Revisar cita <span aria-hidden="true">→</span></button></div>
    </form>
  );
}
