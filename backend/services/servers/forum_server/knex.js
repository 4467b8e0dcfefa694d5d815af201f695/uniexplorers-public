// const environment = process.env.NODE_ENV || 'development'
const forum_config = require('./knexfile')["dev_forum"]

module.exports = require('knex')(forum_config)