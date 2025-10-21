import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

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

    // --- Validación de fecha ---
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Eliminar hora para comparar solo fechas
    const fechaAusencia = new Date(form.fecha_ausencia);

    if (isNaN(fechaAusencia.getTime())) {
      setErrorMessage('Por favor, selecciona una fecha válida.');
      setLoading(false);
      return;
    }

    if (fechaAusencia > hoy) {
      setErrorMessage('La fecha de ausencia no puede ser posterior al día actual.');
      setLoading(false);
      return;
    }

    if (fechaAusencia < hoy) {
      setErrorMessage('La fecha de ausencia no puede ser anterior al día actual.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/solicitudes`,
        form
      );

      setForm({ nombre: '', grupo: '', motivo: '', fecha_ausencia: '' });
      setSuccessMessage('¡Solicitud enviada con éxito!');
      onCreated?.(res.data);
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
            rows="4"
            required
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
