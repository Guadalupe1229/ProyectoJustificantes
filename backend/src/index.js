const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const solicitudesRouter = require('./routes/solicitudes');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta principal para probar conexión
app.get('/', (req, res) => {
  res.send('✅ API de Justificantes funcionando correctamente');
});

// Rutas del sistema de solicitudes
app.use('/solicitudes', solicitudesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Backend escuchando en puerto', port));

