require('dotenv/config') // load everything from `.env` file into the `process.env` variable

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env

module.exports = [{
  type: 'postgres',
  host: 'localhost',
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts'
  ],
  migrations: [
    'src/database/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
}]
