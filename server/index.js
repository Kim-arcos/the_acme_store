const express = require('express');
const app = express();

const { client, createTables, createUsers, createProduct, createFavorite, destroyFavorite, fetchUsers, fetchProduct, fetchFavorite } = require('./db');

app.use(express.json());

app.get('/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

app.get('/product', async (req, res, next) => {
    try {
        res.send(await fetchProduct());
    } catch (error) {
        next(error);
    }
});

const init = async () => {
    client.connect();
    await createTables();

    
    console.log(await fetchUsers());
    console.log(await fetchProduct());
};

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

init();
