const express = require('express');
const router = express.Router();
const planetsController = require('./planetsController');

router.get('/planets', planetsController.getAllPlanets);
router.get('/planets/:id', planetsController.getPlanetById);
router.post('/planets', planetsController.createPlanet);
router.put('/planets/:id', planetsController.updatePlanet);
router.delete('/planets/:id', planetsController.deletePlanet);

module.exports = router;