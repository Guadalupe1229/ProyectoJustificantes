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

    const [result] = await pool.query(
      'INSERT INTO solicitudes1 (nombre, grupo, motivo, fecha_ausencia) VALUES (?, ?, ?, ?)',
      [nombre, grupo, motivo, fecha_ausencia]
    );

    // Comprobamos si el insert fue exitoso
    if (!result.insertId) {
      return res.status(500).json({ error: 'No se pudo crear la solicitud' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM solicitudes1 WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error en POST /solicitudes:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /solicitudes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM solicitudes1 ORDER BY fecha_solicitud DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error en GET /solicitudes:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
