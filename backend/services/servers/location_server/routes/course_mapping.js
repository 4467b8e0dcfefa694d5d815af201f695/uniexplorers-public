const mongo = require('mongodb')

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DATABASE,
    MONGO_HOST,
    MONGO_PORT,
} = process.env

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`
const client = new mongo.MongoClient(uri)
const mongoOptions = {
    sort: {course_title: 1}
}
/**
 * @swagger
 * tags:
 *   -  name: course_mapping
 *      description: Course mapping operations related routes
 */

/**
 * @swagger
 * /course_mapping/country/{country}:
 *   get:
 *     summary: Get course mapping data by country
 *     tags: 
 *          - course_mapping
 *     description: Retrieve course mapping data for a specific country.
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the country.
 *     responses:
 *       200:
 *         description: Successful response with course mapping data.
 *       404:
 *         description: Course mapping data not found

 * /course_mapping/course_area/{course_area}:
 *   get:
 *     summary: Get course mapping data by course area
 *     tags: 
 *          - course_mapping
 *     description: Retrieve course mapping data for a specific course area.
 *     parameters:
 *       - in: path
 *         name: course_area
 *         schema:
 *           type: string
 *         required: true
 *         description: The course area.
 *     responses:
 *       200:
 *         description: Successful response with course mapping data.
 *       404:
 *         description: Course mapping data not found

 * /course_mapping/university/{university}:
 *   get:
 *     summary: Get course mapping data by university name
 *     tags: 
 *          - course_mapping
 *     description: Retrieve course mapping data for a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: Successful response with course mapping data.
 *       404:
 *         description: Course mapping data not found

 * /course_mapping/course_title/{course_title}:
 *   get:
 *     summary: Get course mapping data by course title
 *     tags: 
 *          - course_mapping
 *     description: Retrieve course mapping data for a specific course title.
 *     parameters:
 *       - in: path
 *         name: course_title
 *         schema:
 *           type: string
 *         required: true
 *         description: The title of the course.
 *     responses:
 *       200:
 *         description: Successful response with course mapping data.
 *       404:
 *         description: Course mapping data not found
 */


module.exports = app => {
    app.route('/course_mapping/country/:country')
        .get(async (req, res) => {
            const {
                country
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const courseMapping = database.collection('CourseMapping')

            try {
                const data = await courseMapping.find({ country: country }, mongoOptions).toArray()
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "course mapping data not found"
                })
            }
        })

    app.route('/course_mapping/course_area/:course_area')
        .get(async (req, res) => {
            const {
                course_area
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const courseMapping = database.collection('CourseMapping')

            try {
                const data = await courseMapping.find({ course_area: course_area }, mongoOptions).toArray()
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "course mapping data not found"
                })
            }
        })

    app.route('/course_mapping/university/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const courseMapping = database.collection('CourseMapping')

            try {
                const data = await courseMapping.find({ university: university }, mongoOptions).toArray()
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "course mapping data not found"
                })
            }
        })

    app.route('/course_mapping/course_title/:course_title')
        .get(async (req, res) => {
            const {
                course_title
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const courseMapping = database.collection('CourseMapping')

            try {
                const data = await courseMapping.findOne({ course_title: course_title }, mongoOptions).toArray()
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "course mapping data not found"
                })
            }
        })
}