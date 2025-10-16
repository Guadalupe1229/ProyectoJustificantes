const express = require('express');
const router = express.Router();
const pool = require('../db');


// POST /solicitudes
router.post('/', async (req, res) => {
  try {
    const { nombre, grupo, motivo, fecha_ausencia } = req.body;
    if (!nombre || !grupo || !motivo || !fecha_ausencia)
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    const [result] = await pool.query(
      'INSERT INTO solicitudes (nombre, grupo, motivo, fecha_ausencia) VALUES (?, ?, ?, ?)',
      [nombre, grupo, motivo, fecha_ausencia]
    );
    const [rows] = await pool.query('SELECT * FROM solicitudes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /solicitudes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solicitudes ORDER BY fecha_solicitud DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /solicitudes/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM solicitudes WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
