import React from 'react';
import SolicitudForm from './components/SolicitudForm';
import SolicitudesList from './components/SolicitudesList';

function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Enviar justificantes</h1>
      <SolicitudForm onCreated={() => window.location.reload()} />
      <hr />
      <SolicitudesList />
    </div>
  );
}

export default App;
