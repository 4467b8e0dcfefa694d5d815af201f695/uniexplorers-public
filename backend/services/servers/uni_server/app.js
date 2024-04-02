const {
    SERVER_PORT,
    ORIGIN
} = process.env

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ORIGIN
}))
app.use(express.urlencoded({
    extended: true
}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/uni_swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})
require('./routes')(app)
app.listen(SERVER_PORT, console.log(`University server is running on port ${SERVER_PORT}`))