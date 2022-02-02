const { db } = require('./.env')

module.exports = {
    client: 'mysql',
    connection: db,
    pool: {
        min: 0,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations' // Tabela de migração
    }
}