const swaggerJSDoc = require('swagger-jsdoc')
const openApiMerge = require('openapi-merge')
const fs = require('fs')

const forumSwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Forum API",
        version: "1.0.0",
        description: "API exposing the forum microservice. Exclusive server to access data from forum-db"
    }
}

const locationSwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Location API",
        version: "1.0.0",
        description: "API exposing the location microservice. Exclusive server to access data from course mapping MongoDB"
    }
}

const uniSwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "University API",
        version: "1.0.0",
        description: "API exposing the university microservice. Exclusive server to access data from university database"
    }
}

const userSwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "User API",
        version: "1.0.0",
        description: "API exposing the user microservice. Exclusive server to access data from user database"
    }
}

const forumOptions = {
    swaggerDefinition: forumSwaggerDefinition,
    apis: [`${__dirname}/../../servers/forum_server/routes/*.js`]
}

const locationOptions = {
    swaggerDefinition: locationSwaggerDefinition,
    apis: [`${__dirname}/../../servers/location_server/routes/*.js`]
}

const uniOptions = {
    swaggerDefinition: uniSwaggerDefinition,
    apis: [`${__dirname}/../../servers/uni_server/routes/*.js`]
}

const userOptions = {
    swaggerDefinition: userSwaggerDefinition,
    apis: [`${__dirname}/../../servers/user_server/routes/*.js`]
}

const forumSwaggerSpec = swaggerJSDoc(forumOptions)
const locationSwaggerSpec = swaggerJSDoc(locationOptions)
const uniSwaggerSpec = swaggerJSDoc(uniOptions)
const userSwaggerSpec = swaggerJSDoc(userOptions)

const specs = {
    "forum_swagger.json": forumSwaggerSpec,
    "location_swagger.json": locationSwaggerSpec,
    "uni_swagger.json": uniSwaggerSpec,
    "user_swagger.json": userSwaggerSpec
}

const mergeResult = openApiMerge.merge([
    {oas: {
        openapi: "3.0.0",
        info: {
            title: "Uniexplorers API",
            description: "The Uniexplorers API, without API gateway",
            version: "0.1"
        }
    }},
    {oas: forumSwaggerSpec},
    {oas: locationSwaggerSpec},
    {oas: uniSwaggerSpec},
    {oas: userSwaggerSpec},
    // Will need to download yourself for now
    {oas: JSON.parse(fs.readFileSync('./docs/recommender_swagger.json'))},
    {oas: JSON.parse(fs.readFileSync('./docs/similarity_swagger.json'))}
])

fs.writeFileSync(`${__dirname}/docs/api.json`, JSON.stringify(mergeResult.output, null, 2))


// for (const [key, value] of Object.entries(specs)) {
//     const filePath = `${__dirname}/docs/${key}`
//     console.log(value)
//     fs.writeFileSync(filePath, JSON.stringify(value))
// }