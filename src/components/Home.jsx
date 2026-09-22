import { useState } from "react";
import { especialistas } from "../data/mock";

export function ServiceIcon({ type }) {
  const paths = {
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16m-11 4h2m3 0h2m-7 3h2"/></>,
    people: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2M9 17h6m-3-3v6"/></>,
    place: <><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
    exercise: <><circle cx="13" cy="4" r="2"/><path d="m4 10 5-3 5 3 6-2m-8 1-2 6-5 6m5-6 6 1 2 5"/></>,
    reminder: <><path d="M5 16V9a7 7 0 0 1 14 0v7l2 2H3l2-2Zm5 5h4"/></>,
    register: <><rect x="4" y="3" width="16" height="19" rx="2"/><circle cx="12" cy="9" r="2"/><path d="M8 16a4 4 0 0 1 8 0M9 19h6"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type] || paths.calendar}</svg>;
}

const groups = [
  { title: "Organiza tu atención", description: "Encuentra lo necesario antes de tu visita.", items: [
    ["especialistas", "people", "Profesionales", "Conoce sus especialidades y horarios."],
    ["calendario", "calendar", "Disponibilidad", "Consulta los cupos de los próximos días."],
    ["centros", "place", "Centro de atención", "Ubicación, contacto y cómo llegar."],
  ] },
  { title: "Orientación para ti", description: "Consulta información y continúa tu recorrido.", items: [
    ["ejercicios", "exercise", "Ejercicios", "Videos con subtítulos y guías escritas."],
    ["recordatorios", "reminder", "Recordatorios", "Ten presentes tus próximas citas."],
    ["registro", "register", "Registro de usuario", "Completa tus datos en la demostración."],
  ] },
];

export default function Home({ onNavigate, onStart, titleRef }) {
  const [especialidad, setEspecialidad] = useState("");
  return <div className="home">
    <section className="home-intro" aria-labelledby="home-title">
      <div className="home-copy">
        <p className="location-label">Servicio de rehabilitación en Guaranda</p>
        <h1 id="home-title" ref={titleRef} tabIndex={-1}>Tu rehabilitación,<br/>paso a paso.</h1>
        <p className="home-description">Encuentra un profesional, organiza tu cita y consulta las orientaciones para tu atención.</p>
        <div className="home-process" aria-label="Pasos para solicitar una cita"><span>Elige la atención</span><span aria-hidden="true">›</span><span>Busca un horario</span><span aria-hidden="true">›</span><span>Confirma</span></div>
        <p className="home-access-note">Puedes ampliar el texto o elegir una solicitud guiada en cualquier momento.</p>
      </div>
      <form className="booking-start" onSubmit={(event) => { event.preventDefault(); onStart(especialidad); }}>
        <span className="booking-symbol"><ServiceIcon type="calendar" /></span>
        <h2>Solicita tu cita</h2>
        <p>Comienza por la atención que necesitas.</p>
        <label htmlFor="home-specialty">Especialidad</label>
        <select id="home-specialty" value={especialidad} onChange={(event) => setEspecialidad(event.target.value)}>
          <option value="">Elegir durante la solicitud</option>
          {[...new Set(especialistas.map(item => item.especialidad))].map(item => <option key={item}>{item}</option>)}
        </select>
        <button className="booking-action" type="submit">Comenzar solicitud</button>
        <p className="booking-hint">Revisarás todos los datos antes de confirmar.</p>
      </form>
    </section>
    <section className="returning-patient" aria-labelledby="returning-title">
      <div className="returning-icon"><ServiceIcon type="calendar" /></div>
      <div><h2 id="returning-title">¿Ya tienes una cita?</h2><p>Consulta la fecha, reprograma o cancela tu solicitud.</p></div>
      <button className="btn-secondary" onClick={() => onNavigate("historial")}>Ver mis citas</button>
    </section>
    <div className="service-groups">{groups.map(group => <section key={group.title} className="service-group">
      <h2>{group.title}</h2><p>{group.description}</p>
      <div className="service-links">{group.items.map(([target, icon, title, detail]) => <button className="service-link" key={target} onClick={() => onNavigate(target)}>
        <span className="service-icon"><ServiceIcon type={icon}/></span><span><strong>{title}</strong><small>{detail}</small></span><span className="service-chevron" aria-hidden="true">›</span>
      </button>)}</div>
    </section>)}</div>
    <aside className="home-help"><span aria-hidden="true">Aa</span><div><h2>Elige la forma más cómoda para ti</h2><p>Solicitud rápida, guía paso a paso o formato con más apoyos. Todos permiten completar la misma cita.</p></div><button className="btn-link" onClick={() => onNavigate("cita")}>Conocer los formatos</button></aside>
  </div>;
}
