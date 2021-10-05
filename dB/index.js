// import pg module
const { Client } = require('pg');

// supply db name and location of database
const client = new Client('postgres://localhost:5432/dAndB-dev');

const createUser = async ({ username, password, name, email }) => {
    try {
        const { rows } = await client.query(`
            INSERT INTO users(username, password, name, email) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password, name, email]);

        return rows;
    } catch (error) {
        throw error;
    }
}

const getAllUSers = async () => {
    const { rows } = await client.query(
        `SELECT *
        FROM users;
        `);

        return rows;
}


module.exports = {
    client,
    createUser,
    getAllUSers
    
}
