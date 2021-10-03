// grab client with destructuring from the export in index.js
const { client,
        getAllUSers
} = require('./index');

// calls a query which drops all tables fro database
const dropTables = async () => {
    try {
        console.log("Starting to drop tables...")
        await client.query(`
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!")
    } catch (error) {
        //pass error to function that calls dropTables
        console.error("Error dropping tables!")
        throw error; 
    }
}

//calls a query to create all tables for database
const createTables = async () => {
    try {
        console.log("Starting to build tables...")
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
        `);
        console.log("Finished building tables!")
    } catch (error) {
        // pass error to function that calls createTables
        console.error("Error building tables!")
        throw error;
    }
}

const rebuildDB = async () => {
    try {
        // connect client to database
        client.connect();
        await dropTables();
        await createTables();
    } catch (error) {
        throw(error);
    }
}

const testDB = async () => {
    try {
        console.log("Starting to test database...")
        // quieries
        const users = await getAllUSers();

        // log results for now
        console.log("getAllUsers:", users);

        console.log("Finished database tests!")

    } catch (error) {
        console.error("Error testing database");
        throw error;
    } 
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
