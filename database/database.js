const db = require('./db');


exports.getAllPlanets = async (req, res) => {
  try {
    const planets = await db.any('SELECT * FROM planets');
    res.json(planets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPlanetById = async (req, res) => {
  const { id } = req.params;
  try {
    const planet = await db.oneOrNone('SELECT * FROM planets WHERE id=$1', [id]);
    if (planet) {
      res.json(planet);
    } else {
      res.status(404).json({ error: 'Planet not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createPlanet = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.none('INSERT INTO planets (name) VALUES ($1)', [name]);
    res.status(201).json({ message: 'Planet created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updatePlanet = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await db.none('UPDATE planets SET name=$2 WHERE id=$1', [id, name]);
    res.json({ message: 'Planet updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deletePlanet = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.none('DELETE FROM planets WHERE id=$1', [id]);
    res.json({ message: 'Planet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};