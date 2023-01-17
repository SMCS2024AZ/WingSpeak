const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.connection,
    ssl: { rejectUnauthorized: false }
})

client.connect()

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
}