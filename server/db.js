const { Client } = require("pg");
const uuid = require('uuid');

const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost:5432/the_acme_store_db"
);

async function createTables() {
  const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS product;
    DROP TABLE IF EXISTS favorite;
    

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL
    );

    CREATE TABLE product(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorite(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES product,
        user_id UUID REFERENCES users,
        CONSTRAINT favorite UNIQUE(product_id, user_id)
    );

    -- Add ORDER BY clause to sort the results by id column
    SELECT * FROM users ORDER BY id;
    SELECT * FROM product ORDER BY id;
    SELECT * FROM favorite ORDER BY id;
    
    `;
  await client.query(SQL);
}

async function createProduct(name) {
  const SQL = `
INSERT INTO product(id, name)
VALUES ($1, $2);
    `;
  await client.query(SQL, [uuid.v4(), name]);
}

async function createUsers(username, password) {
  const SQL = `
INSERT INTO users(id, username, password)
VALUES ($1, $2, $3);
`;
  await client.query(SQL, [uuid.v4(), username, password]);
}

async function fetchUsers() {
  const SQL = `
    SELECT * FROM users;
    `;
  const response = await client.query(SQL);
  return response.rows;
}

async function fetchProduct() {
  const SQL = `
    SELECT * FROM product;
    `;
  const response = await client.query(SQL);
  return response.rows;
}

module.exports = {
  client,
  createTables,
  createProduct,
  createUsers,
  fetchUsers,
  fetchProduct,
};
