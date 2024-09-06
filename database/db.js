const pgp = require('pg-promise')();
const db = pgp('postgres://username:password@localhost:5432/planets_db');

module.exports = db;