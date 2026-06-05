const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET semua catatan
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notes ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET catatan by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST tambah catatan
router.post('/', async (req, res) => {
    const { judul, isi } = req.body;
    
    if (!judul || !isi) {
        return res.status(400).json({ message: 'Judul dan isi harus diisi' });
    }
    
    try {
        const [result] = await db.query(
            'INSERT INTO notes (judul, isi) VALUES (?, ?)',
            [judul, isi]
        );
        
        const [newNote] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newNote[0]);
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).json({ message: err.message });
    }
});

// PUT update catatan
router.put('/:id', async (req, res) => {
    const { judul, isi } = req.body;
    
    if (!judul || !isi) {
        return res.status(400).json({ message: 'Judul dan isi harus diisi' });
    }
    
    try {
        const [result] = await db.query(
            'UPDATE notes SET judul = ?, isi = ? WHERE id = ?',
            [judul, isi, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        
        const [updatedNote] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [req.params.id]
        );
        
        res.json(updatedNote[0]);
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE hapus catatan
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        
        res.json({ message: 'Catatan berhasil dihapus' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ message: err.message });
    }
});

// Pastikan ini ada di akhir file!
module.exports = router;