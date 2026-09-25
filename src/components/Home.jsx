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

const destacados = [
  { target: "especialistas", title: "Profesionales", description: "Encuentra tu especialidad.", image: "professional" },
  { target: "ejercicios", title: "Ejercicios guiados", description: "Videos y pasos a tu ritmo.", image: "exercise" },
  { target: "centros", title: "Centro de atención", description: "Ubicación y contacto en Guaranda.", image: "center" },
];

const accesos = [
  ["calendario", "calendar", "Horarios disponibles"],
  ["recordatorios", "reminder", "Recordatorios"],
  ["registro", "register", "Mis datos"],
];

export default function Home({ onNavigate, onStart, titleRef }) {
  const [especialidad, setEspecialidad] = useState("");
  return <div className="home">
    <section className="home-intro" aria-labelledby="home-title">
      <div className="home-copy">
        <p className="location-label">Rehabilitación en Guaranda</p>
        <h1 id="home-title" ref={titleRef} tabIndex={-1}>Tu atención empieza aquí.</h1>
        <p className="home-description">Solicita tu cita de rehabilitación con pasos claros y a tu ritmo.</p>
      </div>
      <figure className="home-visual">
        <img src="/inicio/rehabilitacion-ilustrativa.png" alt="Una fisioterapeuta acompaña a una adulta mayor durante un ejercicio de movilidad" />
        <figcaption>Imagen ilustrativa</figcaption>
      </figure>
      <form className="booking-start" onSubmit={(event) => { event.preventDefault(); onStart(especialidad); }}>
        <div className="booking-heading"><span className="booking-symbol"><ServiceIcon type="calendar" /></span><h2>Solicitar cita</h2></div>
        <div className="booking-field"><label htmlFor="home-specialty">Especialidad <span className="optional">(opcional)</span></label>
          <select id="home-specialty" value={especialidad} onChange={(event) => setEspecialidad(event.target.value)}>
            <option value="">Elegir durante la solicitud</option>
            {[...new Set(especialistas.map(item => item.especialidad))].map(item => <option key={item}>{item}</option>)}
          </select></div>
        <button className="booking-action" type="submit">Empezar solicitud</button>
      </form>
    </section>
    <section className="home-steps" aria-label="Cómo solicitar una cita">
      <h2>Una solicitud, tres pasos</h2>
      <ol><li><span>1</span>Tus datos</li><li><span>2</span>Profesional</li><li><span>3</span>Fecha y hora</li></ol>
    </section>
    <section className="returning-patient" aria-labelledby="returning-title">
      <div className="returning-icon"><ServiceIcon type="calendar" /></div>
      <div><h2 id="returning-title">¿Ya tienes una cita?</h2></div>
      <button className="btn-secondary" onClick={() => onNavigate("historial")}>Ver mis citas</button>
    </section>
    <section className="home-discover" aria-labelledby="discover-title">
      <h2 id="discover-title">Explora tu atención</h2>
      <div className="home-feature-grid">{destacados.map((item) => <button className="home-feature" key={item.target} type="button" onClick={() => onNavigate(item.target)}>
        <span className={`home-feature-image feature-${item.image}`} aria-hidden="true" />
        <span className="home-feature-copy"><strong>{item.title}</strong><small>{item.description}</small></span>
        <span className="home-feature-arrow" aria-hidden="true">›</span>
      </button>)}</div>
    </section>
    <section className="home-more" aria-labelledby="home-more-title"><h2 id="home-more-title">Más opciones</h2>
      <div className="home-more-links">{accesos.map(([target, icon, title]) => <button className="service-link" key={target} type="button" onClick={() => onNavigate(target)}>
        <span className="service-icon"><ServiceIcon type={icon}/></span><strong>{title}</strong><span className="service-chevron" aria-hidden="true">›</span>
      </button>)}</div>
    </section>
  </div>;
}
