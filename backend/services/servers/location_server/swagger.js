const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Location API",
        version: "1.0.0",
        description: "API exposing the location microservice. Exclusive server to access data from course mapping MongoDB"
    }
}

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec