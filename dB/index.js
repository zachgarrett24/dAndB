// import pg module
const { Client } = require('pg');

// supply db name and location of database
const client = new Client('postgres://localhost:5432/dAndB-dev');

const getAllUSers = async () => {
    const { rows } = await client.query(
        `SELECT id, username
        FROM users;
        `);

        return rows;
}


module.exports = {
    client,
    getAllUSers,
}
