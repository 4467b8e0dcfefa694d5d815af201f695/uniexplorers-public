const fs = require('fs')

module.exports = app => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file == "index.js") return
        var name = file.substring(0, file.indexOf('.'))
        // console.log(name)
        require('./' + name)(app)
    })

    app.route('/')
        .get((req, res) => {
            res.status(200).send('UniExplorers API')
        })
}