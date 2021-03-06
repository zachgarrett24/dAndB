// grab client with destructuring from the export in index.js
const { client,
        getAllUSers,
        createUser,
        updateUser,
        getUserById,
        createProduct,
        updateProduct,
        getAllProducts,
} = require('./index');

// calls a query which drops all tables fro database
const dropTables = async () => {
    try {
        console.log("Starting to drop tables...")
        await client.query(`
            DROP TABLE IF EXISTS product_subproducts;
            DROP TABLE IF EXISTS subproducts;
            DROP TABLE IF EXISTS products;
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
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );

            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                style VARCHAR(255) NOT NULL,
                price VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );

            CREATE TABLE subproducts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
            
            CREATE TABLE product_subproducts (
                "productId" INTEGER REFERENCES products(id),
                "subProductId" INTEGER REFERENCES subproducts(id),
                UNIQUE("productId", "subProductId")
            );
        `);
        console.log("Finished building tables!")
    } catch (error) {
        // pass error to function that calls createTables
        console.error("Error building tables!")
        throw error;
    }
}

const createInitialUsers = async () => {
    try {
        console.log("Starting to create users...");
        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'bert', email: 'berto@gmail.com' });
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'fred', email: 'fredo@gmail.com' });
        const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'nancy', email: 'nance@gmail.com' });

        console.log("Finished creating users!")
    } catch (error) {
        console.error("Error creating users!")
    }
}

const createInitialProducts = async () => {
    try {
        const [ albert, sandra, glamgal ] = await getAllUSers();

        await createProduct({ title: "Industrial Wine Thing", style: "Hard Metal", price: "$101.99"});
        await createProduct({ title: "Best Part Ever", style: "The Good Stuff", price: "$10"});
        await createProduct({ title: "Whatamacallit", style: "Hoosawhatsit", price: "$0.99 Good Deal!"});
    } catch (error) {
        throw error;
    }
}

const rebuildDB = async () => {
    try {
        // connect client to database
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProducts();
    } catch (error) {
        throw(error);
    }
}



const testDB = async () => {
    try {
        console.log("Starting to test database...")

        console.log("Calling get all users")
        const users = await getAllUSers();
        console.log("Result:", users)

        console.log("Calling getAllProducts");
        const products = await getAllProducts();
        console.log("Result", products);

        console.log("Calling updateProduct on products[0]");
        const updatedProduct = await updateProduct(products[0].id, {
            title: "Plumbus",
            style: "There's several hizzards in the way.",
            price: "priceless"
        });
        console.log("Result", updatedProduct);

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result", albert);

        console.log("Calling updateUser on users[0]")
        const updateUserRes = await updateUser(users[0].id, {
            name: "Newname Sogood",
            email: "weeee@gmail.com"
        });
        console.log("Result:", updateUserRes)

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
