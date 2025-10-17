import React, { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Archivo de estilos para el formulario

export default function SolicitudForm({ onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    grupo: '',
    motivo: '',
    fecha_ausencia: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = e => {
    // Limpiar mensajes de éxito/error al empezar a escribir de nuevo
    if (successMessage || errorMessage) {
      setSuccessMessage('');
      setErrorMessage('');
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  setSuccessMessage('');
  setErrorMessage('');

  try {
    // Aquí usamos POST y enviamos los datos del formulario
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/solicitudes`,
      form
    );

    // Limpiar formulario y mostrar mensaje de éxito
    setForm({ nombre: '', grupo: '', motivo: '', fecha_ausencia: '' });
    setSuccessMessage('¡Solicitud enviada con éxito!');
    onCreated?.(res.data); // Notificar al componente padre
  } catch (err) {
    console.error('Error al enviar solicitud:', err);
    setErrorMessage('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-container">
      <h3 className="form-title">Crear Nueva Solicitud de Ausencia</h3>
      <p className="form-description">
        Por favor, rellena los campos a continuación para enviar tu solicitud.
      </p>

      <form onSubmit={handleSubmit} className="solicitud-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={form.nombre}
            onChange={handleChange}
            required
            aria-label="Nombre Completo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="grupo">Grupo/Departamento</label>
          <input
            id="grupo"
            name="grupo"
            type="text"
            placeholder="Ej: Marketing, Desarrollo"
            value={form.grupo}
            onChange={handleChange}
            required
            aria-label="Grupo o Departamento"
          />
        </div>

        <div className="form-group">
          <label htmlFor="motivo">Motivo de la Ausencia</label>
          <textarea
            id="motivo"
            name="motivo"
            placeholder="Describe brevemente el motivo de tu ausencia..."
            value={form.motivo}
            onChange={handleChange}
            rows="4" // Aumentar las filas para un mejor campo de texto
            required
            aria-label="Motivo de la Ausencia"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha_ausencia">Fecha de Ausencia</label>
          <input
            id="fecha_ausencia"
            name="fecha_ausencia"
            type="date"
            value={form.fecha_ausencia}
            onChange={handleChange}
            required
            aria-label="Fecha de Ausencia"
          />
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
}
