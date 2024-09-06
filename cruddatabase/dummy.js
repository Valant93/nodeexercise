const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());


let planets = [
  { id: 1, name: 'Earth' },
  { id: 2, name: 'Mars' }
];


const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).required()
});

const createPlanetSchema = Joi.object({
  name: Joi.string().min(1).required()
});

const updatePlanetSchema = Joi.object({
  name: Joi.string().min(1).required()
});


app.get('/api/planets', (req, res) => {
  res.status(200).json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).json({ msg: 'Planet not found' });
  res.status(200).json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error } = createPlanetSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: 'Invalid data' });

  const newPlanet = {
    id: planets.length ? planets[planets.length - 1].id + 1 : 1,
    name: req.body.name
  };
  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', (req, res) => {
  const { error } = updatePlanetSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: 'Invalid data' });

  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).json({ msg: 'Planet not found' });

  planet.name = req.body.name;
  res.status(200).json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const index = planets.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ msg: 'Planet not found' });

  planets.splice(index, 1);
  res.status(200).json({ msg: 'Planet deleted successfully' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});