const pgp = require('pg-promise')();
const db = pgp('postgres://username:password@localhost:5432/planets_db'); 

async function setupDb() {
    try {
        await db.none(`
            DROP TABLE IF EXISTS planets;
            CREATE TABLE planets(
                id SERIAL NOT NULL PRIMARY KEY,
                name TEXT NOT NULL,
                image TEXT
            );
        `);

    
        await db.none(`INSERT INTO planets (name) VALUES ($1), ($2);`, ['Earth', 'Mars']);

        console.log("Database setup complete and planets inserted.");
    } catch (err) {
        console.error("Error setting up the database: ", err);
    }
}

setupDb().finally(() => pgp.end());