const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /solicitudes
router.post('/', async (req, res) => {
  try {
    const { nombre, grupo, motivo, fecha_ausencia } = req.body;

    if (!nombre || !grupo || !motivo || !fecha_ausencia) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 1️⃣ Obtener el último ID registrado
    const [rows] = await pool.query('SELECT MAX(id) AS maxId FROM solicitudes');
    const nuevoId = (rows[0].maxId || 0) + 1;

    // 2️⃣ Insertar el nuevo registro con el id manual
    const [result] = await pool.query(
      'INSERT INTO solicitudes (id, nombre, grupo, motivo, fecha_ausencia) VALUES (?, ?, ?, ?, ?)',
      [nuevoId, nombre, grupo, motivo, fecha_ausencia]
    );

    // 3️⃣ Verificar el resultado e intentar devolver el registro insertado
    if (!result.affectedRows) {
      return res.status(500).json({ error: 'No se pudo crear la solicitud' });
    }

    const [nuevaSolicitud] = await pool.query(
      'SELECT * FROM solicitudes WHERE id = ?',
      [nuevoId]
    );

    res.status(201).json(nuevaSolicitud[0]);
  } catch (err) {
    console.error('Error en POST /solicitudes:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ GET /solicitudes (opcional, si lo necesitas)
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
