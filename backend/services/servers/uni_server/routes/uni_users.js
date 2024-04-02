const db = require('../knex')
const {
    authenticateToken
} = require('../modules/jwt_utils.js')

/**
 * @swagger
 * tags:
 *   -  name: uni_users
 *      description: University users related routes
 */

/**
 * @swagger
 * /uni_users:
 *   get:
 *     summary: Get all users and their corresponding universities
 *     tags: 
 *          - uni_users
 *     description: Retrieve a list of all users and their corresponding universities. Only accessible to admins or the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users and their corresponding universities
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: User database query failed
 */


module.exports = app => {
    app.route('/uni_users')
        .get(authenticateToken, async (req, res) => {
            // list all users, and their corresponding universities
            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object

            if (is_admin) {
                db
                    .select()
                    .from('uni_user')
                    .then(
                        results => {
                            res.json(results)
                        }
                    )
                    .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'user database query failed',
                            stack: err.stack,
                        })
                    )
            } else {
                db
                    .select()
                    .from('uni_user')
                    .where('user_email', email)
                    .then(
                        results => {
                            res.json(results)
                        }
                    )
                    .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'user database query failed',
                            stack: err.stack,
                        })
                    )
            }

            // res.json(uniUsers)
        })
}