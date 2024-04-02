const db = require('../knex')
const path = require('path')

/**
 * @swagger
 * tags:
 *   -  name: university
 *      description: University data related routes
 */


/**
 * @swagger
 * /universities:
 *   get:
 *     summary: Get universities
 *     tags: 
 *          - university
 *     description: Retrieve a list of universities based on various filters such as continent, GPA, name, location, and majors.
 *     parameters:
 *       - in: query
 *         name: continent
 *         schema:
 *           type: string
 *         description: Filter by continent.
 *       - in: query
 *         name: gpa
 *         schema:
 *           type: number
 *         description: Filter by GPA.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (search).
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location.
 *       - in: query
 *         name: major
 *         schema:
 *           type: string
 *         description: Filter by major(s).
 *     responses:
 *       200:
 *         description: A list of universities
 *       404:
 *         description: Universities not found
 *
 * /universities/all:
 *   get:
 *     summary: Get all university names
 *     tags: 
 *          - university
 *     description: Retrieve a list of all university names.
 *     responses:
 *       200:
 *         description: A list of university names
 *       404:
 *         description: Universities database call failed
 *
 * /universities/name/{name}:
 *   get:
 *     summary: Get university by name
 *     tags: 
 *          - university
 *     description: Retrieve a university by its name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: The requested university
 *       404:
 *         description: University does not exist
 *
 * /universities/image/{name}/:
 *   get:
 *     summary: Get university image by name
 *     tags: 
 *          - university
 *     description: Retrieve the image of a university by its name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: The requested image
 *       404:
 *         description: University does not exist or has no image attached
 *
 * /universities/search/{searchTerm}:
 *   get:
 *     summary: Search for universities
 *     tags: 
 *          - university
 *     description: Search for universities by a search term.
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term.
 *     responses:
 *       200:
 *         description: A list of universities matching the search term
 *       404:
 *         description: Universities not found
 */


const majors_by_uni = db.select('university_name', db.raw('string_agg(major_name, \', \') as majors')).from('uni_major')
    .groupBy('university_name')
    .as('TEMPtags')

module.exports = app => {
    app.route('/universities')
        .get(async (req, res) => {
            // get filter params, if any
            const reqContinent = req.query.continent
            const reqGpa = req.query.gpa
            const reqName = req.query.name
            const reqLocation = req.query.location
            const reqMajors = req.query.major

            if (reqMajors) {
                if (Array.isArray(reqMajors)) { // multiple majors
                    var majorUnis = await db.distinct().pluck('university_name').from('uni_major').whereIn('major_name', reqMajors)
                } else { // single majors
                    var majorUnis = await db.distinct().pluck('university_name').from('uni_major').where('major_name', reqMajors)
                }
            }


            db.select().from('university').modify(
                (queryBuilder) => {
                    if (majorUnis) { // filtered by tags?
                        if (Array.isArray(majorUnis)) { // multiple unis
                            queryBuilder.whereIn('name', majorUnis)
                        } else {
                            queryBuilder.where('name', majorUnis)
                        }
                    }
                    if (reqContinent) {
                        if (Array.isArray(reqContinent)) { // multiple continent fields passed
                            queryBuilder.whereIn('continent', reqContinent)
                        } else {
                            queryBuilder.where('continent', reqContinent)
                        }
                    }
                    if (reqGpa) {
                        queryBuilder.where('gpa_10_percentile', '<=', reqGpa)
                    }
                    if (reqName) {
                        queryBuilder.where('name', 'ilike', `%${reqName}%`)
                    }
                    if (reqLocation) {
                        queryBuilder.where('location', reqLocation)
                    }
                }
            ).leftJoin(majors_by_uni, 'TEMPtags.university_name', 'university.name').then(
                (results) => {
                    res.json(results)
                }
            )
        })

    app.route('/universities/all')
        .get(async (req, res) => {
            db('university')
                .pluck('name')
                .then(university_names => {
                    res.json(university_names)
                })
                .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'universities database call does not work',
                            stack: err.stack
                        })
                )
    })

    app.route('/universities/name/:name')
        .get(async (req, res) => {
            const {
                name
            } = req.params
            db
                .select()
                .from('university')
                .where({
                    name
                })
                .first()
                .then(university => {
                    res.json(university)
                })
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'university does not exist',
                        stack: err.stack,
                    })
                )
        })

    app.route('/universities/image/:name/')
        .get(async (req, res) => {
            const {
                name
            } = req.params
            db
                .select()
                .from('university')
                .where({
                    name
                })
                .first()
                .then(university => {
                    // university exists
                    if (university) {
                        // check if image exists
                        let filename = university.image_filename

                        if (filename) {
                            // retrieve from DB
                            db
                                .select()
                                .from('image_file')
                                .where({
                                    filename
                                })
                                .first()
                                .then(image => {
                                    if (image) {
                                        const dirname = path.resolve()
                                        const fullFilePath = path.join(dirname, image.filepath)
                                        return res.type(image.mimetype).sendFile(fullFilePath)
                                    }
                                    return res.status(404).send('Image does not exist')
                                })
                        } else {
                            return res.status(404).send('University has no image attached')
                        }
                    }
                })
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'university does not exist',
                        stack: err.stack,
                    })
                )
        })

    app.route('/universities/telegram')
        .get(async (req, res) => {
            const { university_name } = req.body

            db('university')
                .pluck('invite_link')
                .where({
                    name: university_name
                })
                .then(results => res.json({
                    'success': true,
                    'invite_link': results[0]
                }))
                .catch(err => res.json({
                    'success': false,
                    'err': err.stack
                }))
        })
        .post(async (req, res) => {
            const { university_name, invite_link } = req.body

            db('university')
                .where({
                    name: university_name
                })
                .update({
                    invite_link: invite_link
                })
                .then(results => res.json({
                    'success': true,
                    'result': results
                }))
                .catch(err => res.json({
                    'success': false,
                    'err': err.stack
                }))
        })

    app.route('/universities/search/:searchTerm')
        .get(async (req, res) => {
            // pull all uni names
            const search = req.params.searchTerm
            let searchArr = search.split(" ")

            db
                .select()
                .from('university')
                // queryBuilder.where('name', 'ilike', `%${reqName}%`)
                // .whereIn('name', suggestions)
                // .whereIn("name", "ilike", )
                .where((builder) => {
                    for (let searchTerm of searchArr) {
                        builder.orWhere('name', 'ilike', `%${searchTerm}%`)
                    }
                })
                .leftJoin(majors_by_uni, 'TEMPtags.university_name', 'university.name').then(
                    (results) => {
                        res.json(results)
                    }
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'universities not found',
                        stack: err.stack,
                    })
                )
        })
}