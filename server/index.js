const { client, createTables, createUser, createProduct, fetchUser, fetchProduct } = require('./db');

const init = async () => {
    client.connect();
    await createTables();

    
    console.log(fetchUser());
    console.log(fetchProduct());
};


init();
