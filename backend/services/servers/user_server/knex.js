// const environment = process.env.NODE_ENV || 'development'
const user_config = require('./knexfile')["dev_user"]

module.exports = require('knex')(user_config)