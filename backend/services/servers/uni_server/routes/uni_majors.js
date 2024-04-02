const db = require('../knex')

/**
 * @swagger
 * tags:
 *   -  name: uni_majors
 *      description: University majors related routes
 */

/**
 * @swagger
 * /uni_majors:
 *   get:
 *     summary: Get all university majors
 *     tags: 
 *          - uni_majors
 *     description: Retrieve a list of all university majors.
 *     responses:
 *       200:
 *         description: A list of university majors
 *       404:
 *         description: University majors database query failed
 * 
 * /uni_majors/{university}:
 *   get:
 *     summary: Get university majors by name
 *     tags: 
 *          - uni_majors
 *     description: Retrieve a list of university majors for a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: A list of university majors for the specified university
 *       404:
 *         description: University majors database query failed
 */


module.exports = app => {
    app.route('/uni_majors')
        .get(async (req, res) => {
            // list all uni majors
            db
                .select()
                .from('uni_major')
                .then(
                    results => {
                        res.json(results)
                    }
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'uni majors database query failed',
                        stack: err.stack,
                    })
                )
        })

    app.route('/uni_majors/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            db
                .select()
                .from('uni_major')
                .where('university_name', university)
                .then(
                    results => {
                        res.json(results)
                    }
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'uni major database query failed',
                        stack: err.stack,
                    })
                )
        })
}