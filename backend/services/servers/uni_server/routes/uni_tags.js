const db = require('../knex')

/**
 * @swagger
 * tags:
 *   -  name: uni_tags
 *      description: University tags related routes
 */

/**
 * @swagger
 * /uni_tags:
 *   get:
 *     summary: Get all university tags
 *     tags: 
 *          - uni_tags
 *     description: Retrieve a list of all university tags.
 *     responses:
 *       200:
 *         description: A list of university tags
 *       404:
 *         description: University tags database query failed
 * 
 * /uni_tags/{university}:
 *   get:
 *     summary: Get university tags by name
 *     tags: 
 *          - uni_tags
 *     description: Retrieve a list of university tags for a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: A list of university tags for the specified university
 *       404:
 *         description: University tags database query failed
 */


module.exports = app => {
    app.route('/uni_tags')
        .get(async (req, res) => {
            // list all uni tags
            db
                .select()
                .from('uni_tag')
                .then(
                    results => {
                        res.json(results)
                    }
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'uni tags database query failed',
                        stack: err.stack,
                    })
                )
        })

    app.route('/uni_tags/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            db
                .select()
                .from('uni_tag')
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
                        message: 'uni tag database query failed',
                        stack: err.stack,
                    })
                )
        })
}