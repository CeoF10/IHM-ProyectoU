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

function MovementIllustration() {
  return <figure className="movement-art">
    <svg viewBox="0 0 260 270" role="img" aria-labelledby="movement-title">
      <title id="movement-title">Ilustración de movilidad de hombro</title>
      <circle cx="130" cy="135" r="112" fill="#EAF1F8" />
      <path d="M50 157a92 92 0 0 1 151-75" fill="none" stroke="var(--primary-mid)" strokeWidth="8" strokeLinecap="round" />
      <path d="m190 71 14 8-2-16" fill="none" stroke="var(--primary-mid)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="119" cy="85" r="18" fill="var(--primary)" />
      <path d="M114 106c-10 17-13 41-8 60l-26 38m30-38 38 12 13 32m-52-68-25-9-19 27m31-28 25-21 31-23m-63 90 44 2" fill="none" stroke="var(--primary-dark)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M178 70a65 65 0 0 1 32 50" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="5 8" strokeLinecap="round" />
      <circle cx="211" cy="125" r="5" fill="var(--primary-mid)" />
      <path d="M65 223h132" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" opacity=".35" />
    </svg>
  </figure>;
}

const groups = [
  { title: "Antes de tu cita", items: [
    ["especialistas", "people", "Profesionales"],
    ["calendario", "calendar", "Horarios"],
    ["centros", "place", "Centro de atención"],
  ] },
  { title: "Para continuar", items: [
    ["ejercicios", "exercise", "Ejercicios"],
    ["recordatorios", "reminder", "Recordatorios"],
    ["registro", "register", "Mis datos"],
  ] },
];

export default function Home({ onNavigate, onStart, titleRef }) {
  const [especialidad, setEspecialidad] = useState("");
  return <div className="home">
    <section className="home-intro" aria-labelledby="home-title">
      <div className="home-copy">
        <p className="location-label">Rehabilitación en Guaranda</p>
        <h1 id="home-title" ref={titleRef} tabIndex={-1}>Tu cita de rehabilitación.</h1>
        <p className="home-description">Elige un profesional y un horario. Confirma al final.</p>
      </div>
      <MovementIllustration />
      <form className="booking-start" onSubmit={(event) => { event.preventDefault(); onStart(especialidad); }}>
        <span className="booking-symbol"><ServiceIcon type="calendar" /></span>
        <h2>Solicitar cita</h2>
        <label htmlFor="home-specialty">Especialidad <span className="optional">(opcional)</span></label>
        <select id="home-specialty" value={especialidad} onChange={(event) => setEspecialidad(event.target.value)}>
          <option value="">Elegir durante la solicitud</option>
          {[...new Set(especialistas.map(item => item.especialidad))].map(item => <option key={item}>{item}</option>)}
        </select>
        <button className="booking-action" type="submit">Empezar solicitud</button>
      </form>
    </section>
    <section className="returning-patient" aria-labelledby="returning-title">
      <div className="returning-icon"><ServiceIcon type="calendar" /></div>
      <div><h2 id="returning-title">¿Ya tienes una cita?</h2></div>
      <button className="btn-secondary" onClick={() => onNavigate("historial")}>Ver mis citas</button>
    </section>
    <div className="service-groups">{groups.map(group => <section key={group.title} className="service-group">
      <h2>{group.title}</h2>
      <div className="service-links">{group.items.map(([target, icon, title]) => <button className="service-link" key={target} onClick={() => onNavigate(target)}>
        <span className="service-icon"><ServiceIcon type={icon}/></span><span><strong>{title}</strong></span><span className="service-chevron" aria-hidden="true">›</span>
      </button>)}</div>
    </section>)}</div>
  </div>;
}
