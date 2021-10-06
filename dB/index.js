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

const updateUser = async (id, fields = {}) => {
    // build set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${index + 1}`
    ).join(', ');

    //return early if called without fields
    if(setString.length === 0) {
        return;
    }

    try {
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));

        return user;
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

const createProduct = async ({title, style, price}) => {
    try {
        const { rows } = await client.query(`
        INSERT INTO products(title, style, price), 
        VALUES ($1, $2, $3),
        ON CONFLICT (title) DO NOTHING,
        ON CONFLICT (style) DO NOTHING,
        ON CONFLICT (price) DO NOTHING,
        RETURNING *;
        `,[title, style, price]);

        return rows;
    } catch (error) {
        throw error;
    }
}

const updateProduct = async( id, fields = {} ) => {
    
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${index + 1}`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };
    try {
        const { rows: [product] } = await client.query(`
            UPDATE products
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));

        return product;
    } catch (error) {
        throw error;
    }
}

const getAllProducts = async () => {
    try {
        const { rows } = await client.query(`
            SELECT * FROM products;
        `)
    } catch (error) {
        throw error;
    }
}


module.exports = {
    client,
    createUser,
    getAllUSers,
    updateUser,
    createProduct,
    updateProduct,
    getAllProducts
}
