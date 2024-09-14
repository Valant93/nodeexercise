const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const multer = require('multer');
const path = require('path');


const db = pgp('postgres://username:password@localhost:5432/planets_db');

const app = express();
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });


app.get('/planets', async (req, res) => {
    try {
        const planets = await db.any('SELECT * FROM planets');
        res.json(planets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/planets/:id', async (req, res) => {
    const planetId = req.params.id;
    try {
        const planet = await db.oneOrNone('SELECT * FROM planets WHERE id=$1', [planetId]);
        if (planet) {
            res.json(planet);
        } else {
            res.status(404).json({ error: 'Planet not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/planets', async (req, res) => {
    const { name } = req.body;
    try {
        await db.none('INSERT INTO planets (name) VALUES ($1)', [name]);
        res.status(201).json({ message: 'Planet added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put('/planets/:id', async (req, res) => {
    const planetId = req.params.id;
    const { name } = req.body;
    try {
        const result = await db.result('UPDATE planets SET name=$2 WHERE id=$1', [planetId, name]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Planet not found' });
        } else {
            res.json({ message: 'Planet updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/planets/:id', async (req, res) => {
    const planetId = req.params.id;
    try {
        const result = await db.result('DELETE FROM planets WHERE id=$1', [planetId]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Planet not found' });
        } else {
            res.json({ message: 'Planet deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/planets/:id/image', upload.single('image'), async (req, res) => {
    const planetId = req.params.id;
    const filePath = req.file ? req.file.path : null;

    if (!filePath) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const result = await db.result('UPDATE planets SET image=$2 WHERE id=$1', [planetId, filePath]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Planet not found' });
        } else {
            res.json({ message: 'Image uploaded successfully', filePath });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});