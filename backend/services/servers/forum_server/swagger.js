const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Forum API",
        version: "1.0.0",
        description: "API exposing the forum microservice. Exclusive server to access data from forum-db"
    }
}

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec