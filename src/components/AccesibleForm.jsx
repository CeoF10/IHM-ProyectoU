import { useEffect, useRef, useState } from "react";
import { especialistas } from "../data/mock";
import { fechaLocal, obtenerHorariosDisponibles, validarIdentificador } from "../utils/appointments";

export default function AccesibleForm({ form, setForm, citas, editandoId, onConfirm }) {
  const [anuncio, setAnuncio] = useState("");
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);
  const fechaMinima = fechaLocal();
  const horarios = obtenerHorariosDisponibles(form.especialista, form.fecha, citas, editandoId);

  useEffect(() => {
    const primerError = Object.keys(errores)[0];
    if (!primerError) return;
    const selectores = {
      nombre: "#apoyo-nombre",
      identificador: "#apoyo-identificador",
      especialista: 'input[name="especialista-apoyo"]',
      fecha: "#apoyo-fecha",
      hora: "#apoyo-hora",
    };
    formRef.current?.querySelector(selectores[primerError])?.focus();
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
    if (form.nombre.trim().length < 3) nuevos.nombre = "Error: escriba su nombre completo.";
    if (!validarIdentificador(form.identificador)) nuevos.identificador = "Error: escriba los últimos 4 números de la cédula.";
    if (!form.especialista) nuevos.especialista = "Error: debe elegir un profesional.";
    if (!form.fecha) nuevos.fecha = "Error: elija una fecha.";
    else if (form.fecha < fechaMinima) nuevos.fecha = "Error: la fecha no puede estar en el pasado.";
    if (!form.hora || !horarios.includes(form.hora)) nuevos.hora = "Error: elija una hora disponible.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      setAnuncio(`Hay ${Object.keys(nuevos).length} campos por corregir. El foco irá al primero.`);
      return false;
    }
    return true;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validar()) onConfirm({ ...form, modo: "Apoyos adicionales" });
  };

  const leerEnVozAlta = () => {
    const texto = `Solicitud de cita. Nombre ${form.nombre || "sin completar"}. Profesional ${form.especialista || "sin elegir"}. Fecha ${form.fecha || "sin elegir"}. Hora ${form.hora || "sin elegir"}. Use Tab para avanzar.`;
    setAnuncio(texto);
    try {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
    } catch {
      setAnuncio(`${texto} La voz no está disponible en este navegador.`);
    }
  };

  return (
    <section className="card accesible" aria-labelledby="apoyo-titulo">
      <div className="form-header"><div><p className="eyebrow">Más herramientas</p><h2 id="apoyo-titulo">Solicitud con apoyos adicionales</h2><p>Formato lineal, controles grandes, instrucciones por voz y mensajes anunciados.</p></div><span className="privacy-badge">Compatible con teclado</span></div>
      <button type="button" className="btn-voz" onClick={leerEnVozAlta} accessKey="l">Escuchar el estado del formulario</button>
      <div role="status" aria-live="polite" className="live">{anuncio}</div>

      <form id="apoyo-form" ref={formRef} onSubmit={submit} noValidate>
        <label htmlFor="apoyo-nombre">1. Nombre completo *</label>
        <input id="apoyo-nombre" value={form.nombre} onChange={(ev) => actualizar("nombre", ev.target.value)} aria-required="true" aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "apoyo-nombre-error apoyo-nombre-ayuda" : "apoyo-nombre-ayuda"} />
        <p id="apoyo-nombre-ayuda" className="field-help">Escriba nombres y apellidos.</p>
        {errores.nombre && <p id="apoyo-nombre-error" className="err">{errores.nombre}</p>}

        <label htmlFor="apoyo-identificador">2. Últimos 4 números de la cédula *</label>
        <input id="apoyo-identificador" value={form.identificador} onChange={(ev) => actualizar("identificador", ev.target.value)} inputMode="numeric" maxLength="4" autoComplete="off" aria-required="true" aria-invalid={!!errores.identificador} aria-describedby={errores.identificador ? "apoyo-identificador-error apoyo-identificador-ayuda" : "apoyo-identificador-ayuda"} />
        <p id="apoyo-identificador-ayuda" className="field-help">No se guardarán estos números.</p>
        {errores.identificador && <p id="apoyo-identificador-error" className="err">{errores.identificador}</p>}

        <fieldset aria-describedby={errores.especialista ? "apoyo-especialista-error" : undefined}>
          <legend>3. Profesional *</legend>
          {especialistas.map((item, indice) => <label key={item.id} className="radio-acc">
            <input type="radio" name="especialista-apoyo" value={item.nombre} checked={form.especialista === item.nombre} aria-invalid={!!errores.especialista} onChange={() => {
              actualizar("especialista", item.nombre, { esp: item.especialidad, fecha: "", hora: "" });
              setAnuncio(`Seleccionado: ${item.nombre}, ${item.especialidad}.`);
            }} />
            {indice + 1}. {item.nombre}, {item.especialidad}, {item.horario}
          </label>)}
          {errores.especialista && <p id="apoyo-especialista-error" className="err">{errores.especialista}</p>}
        </fieldset>

        <label htmlFor="apoyo-fecha">4. Fecha *</label>
        <input id="apoyo-fecha" type="date" min={fechaMinima} value={form.fecha} onChange={(ev) => actualizar("fecha", ev.target.value, { hora: "" })} aria-required="true" aria-invalid={!!errores.fecha} aria-describedby={errores.fecha ? "apoyo-fecha-error" : undefined} />
        {errores.fecha && <p id="apoyo-fecha-error" className="err">{errores.fecha}</p>}

        <label htmlFor="apoyo-hora">5. Hora disponible *</label>
        <select id="apoyo-hora" value={form.hora} onChange={(ev) => actualizar("hora", ev.target.value)} disabled={!form.fecha || horarios.length === 0} aria-required="true" aria-invalid={!!errores.hora} aria-describedby={errores.hora ? "apoyo-hora-error apoyo-hora-ayuda" : "apoyo-hora-ayuda"}>
          <option value="">Seleccione una hora</option>
          {horarios.map((hora) => <option key={hora}>{hora}</option>)}
        </select>
        <p id="apoyo-hora-ayuda" className="field-help">{!form.fecha ? "Primero elija una fecha." : horarios.length ? `${horarios.length} horarios disponibles.` : "No hay cupos ese día; elija otra fecha."}</p>
        {errores.hora && <p id="apoyo-hora-error" className="err">{errores.hora}</p>}

        <button type="submit" className="btn-acc">Revisar cita</button>
      </form>
    </section>
  );
}
