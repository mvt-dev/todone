require('dotenv').config({ path: ['.env.local', '.env'] })

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  migrations: {
    directory: './migrations'
  },
};
