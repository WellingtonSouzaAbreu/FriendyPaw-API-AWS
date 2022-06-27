const config = require('./knexFile.js')
const knex = require('knex')(config)

module.exports = knex