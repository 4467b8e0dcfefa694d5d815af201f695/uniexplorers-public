// const environment = process.env.NODE_ENV || 'development'
const uni_config = require('./knexfile')["dev_uni"]

module.exports = require('knex')(uni_config)