import knex from 'knex'
import path from 'path'

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(process.cwd(), 'database.sqlite'),
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: any, cb: any) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
})

export default db
