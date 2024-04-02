// const environment = process.env.NODE_ENV || 'development'
const user_config = require('./knexfile')["dev_user"]
const forum_config = require('./knexfile')["dev_forum"]
const uni_config = require('./knexfile')["dev_uni"]

export const user_connection = require('knex')(user_config)
export const forum_connection = require('knex')(forum_config);
export const uni_connection = require('knex')(uni_config);