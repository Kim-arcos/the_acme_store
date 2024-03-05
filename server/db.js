const { Client } = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost:5432/the_acme_store_db");

async function createTables() {
  const SQL = `
  DROP TABLE IF EXISTS favorite;
  DROP TABLE IF EXISTS product;
  DROP TABLE IF EXISTS users;
  

    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product(
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

    try {
      await client.query(SQL);
      console.log("Tables created successfully.");
    } catch (error) {
      console.error("Error creating tables:", error);
    }
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
  const hash = await bcrypt.hash(password, 10);
  await client.query(SQL, [uuid.v4(), username, hash]);
}

async function fetchUsers() {
  const SQL = `
    SELECT id, username FROM users;
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

async function createFavorite(user_id, product) {
  const SQL = `
  INSERT INTO favorite(id, user_id, product)
  VALUES ($1, $2, $3);
  `;
  await client.query(SQL, [uuid.v4(), user_id, product]);
}

async function fetchFavorite(user_id) {
  const SQL = `
  SELECT favorite.name FROM product
  JOIN favorite ON product_id.user_id = product_id
  WHERE favorite.user_id = $1; 
  `;
  try {
    const response = await client.query(SQL, [user_id]);
    return response.rows;
  } catch (error) {
    console.error("Error fetching favorite:", error);
    return [];
  }
}

async function destroyFavorite(product_id, user_id) {
  const SQL = `
  DELETE FROM favorite
  WHERE id = $1 AND user_id = $2;
  `;
  await client.query(SQL, [product_id, user_id]);
}

module.exports = {
  client,
  createTables,
  createProduct,
  createUsers,
  createFavorite,
  destroyFavorite,
  fetchUsers,
  fetchProduct,
  fetchFavorite
  
};
