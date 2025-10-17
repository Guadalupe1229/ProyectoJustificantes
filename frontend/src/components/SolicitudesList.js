import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sol.css'; // Archivo de estilos

export default function SolicitudesList() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/solicitudes`,form);
        setSolicitudes(res.data);
      } catch (err) {
        console.error('Error al obtener solicitudes:', err);
        setError('No se pudieron cargar las solicitudes. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div className="solicitudes-container">
      <h3 className="container-title">Historial de Solicitudes</h3>

      {loading && <p className="loading-message">Cargando solicitudes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          {solicitudes.length === 0 ? (
            <div className="empty-state">
              <p>No hay solicitudes pendientes ni registradas.</p>
              <p>¡Todo en orden!</p>
              {/* Puedes añadir un icono o una pequeña imagen aquí */}
            </div>
          ) : (
            <ul className="solicitudes-list">
              {solicitudes.map((s) => (
                <li key={s.id} className="solicitud-item">
                  <div className="solicitud-header">
                    <span className="solicitud-nombre">{s.nombre}</span>
                    <span className="solicitud-grupo">Grupo: {s.grupo}</span>
                  </div>
                  <p className="solicitud-motivo">{s.motivo}</p>
                  <div className="solicitud-footer">
                    <span className="solicitud-fecha">
                      Fecha de ausencia: {new Date(s.fecha_ausencia).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
