import Joi from "joi";


let planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];


const createPlanetSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const updatePlanetSchema = Joi.object({
  name: Joi.string().min(1).required(),
});


export const getAll = (req, res) => {
  res.status(200).json(planets);
};

export const getOneById = (req, res) => {
  const planet = planets.find((p) => p.id === parseInt(req.params.id));
  if (!planet) return res.status(404).json({ msg: "Planet not found" });
  res.status(200).json(planet);
};

export const create = (req, res) => {
  const { error } = createPlanetSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Invalid data" });

  const newPlanet = {
    id: planets.length ? planets[planets.length - 1].id + 1 : 1,
    name: req.body.name,
  };
  planets = [...planets, newPlanet];
  res.status(201).json({ msg: "Planet created successfully" });
};

export const updateById = (req, res) => {
  const { error } = updatePlanetSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Invalid data" });

  const index = planets.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ msg: "Planet not found" });

  planets = planets.map((p) =>
    p.id === parseInt(req.params.id) ? { ...p, name: req.body.name } : p
  );
  res.status(200).json({ msg: "Planet updated successfully" });
};

export const deleteById = (req, res) => {
  const index = planets.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ msg: "Planet not found" });

  planets = planets.filter((_, i) => i !== index);
  res.status(200).json({ msg: "Planet deleted successfully" });
};
