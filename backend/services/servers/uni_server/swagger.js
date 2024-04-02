const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "University API",
        version: "1.0.0",
        description: "API exposing the university microservice. Exclusive server to access data from university database"
    }
}

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec