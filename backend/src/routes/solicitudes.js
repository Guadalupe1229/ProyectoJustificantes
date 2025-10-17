const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📌 POST /solicitudes → Crear nueva solicitud
router.post('/', async (req, res) => {
  try {
    const { nombre, grupo, motivo, fecha_ausencia } = req.body;

    // Validar campos requeridos
    if (!nombre || !grupo || !motivo || !fecha_ausencia) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 1️⃣ Obtener el último ID registrado
    const [rows] = await pool.query('SELECT MAX(id) AS maxId FROM solicitudes');
    const nuevoId = (rows[0].maxId || 0) + 1;

    // 2️⃣ Generar fecha actual para fecha_solicitud (formato MySQL)
    const fecha_solicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 3️⃣ Insertar nuevo registro con ID y fecha_solicitud
    const [result] = await pool.query(
      `INSERT INTO solicitudes 
       (id, nombre, grupo, motivo, fecha_ausencia, fecha_solicitud) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nuevoId, nombre, grupo, motivo, fecha_ausencia, fecha_solicitud]
    );

    // 4️⃣ Verificar que el registro se haya insertado
    if (!result.affectedRows) {
      return res.status(500).json({ error: 'No se pudo crear la solicitud' });
    }

    // 5️⃣ Consultar y devolver la solicitud recién creada
    const [nuevaSolicitud] = await pool.query(
      'SELECT * FROM solicitudes WHERE id = ?',
      [nuevoId]
    );

    res.status(201).json({
      mensaje: 'Solicitud creada exitosamente',
      solicitud: nuevaSolicitud[0],
    });
  } catch (err) {
    console.error('Error en POST /solicitudes:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// 📌 GET /solicitudes → Obtener todas las solicitudes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solicitudes ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error en GET /solicitudes:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

