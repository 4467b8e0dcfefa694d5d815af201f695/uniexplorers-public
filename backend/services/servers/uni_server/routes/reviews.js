const db = require('../knex')
const {
    authenticateToken
} = require('../modules/jwt_utils.js')

/**
 * @swagger
 * tags:
 *   -  name: reviews
 *      description: University reviews related routes
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get reviews
 *     tags: 
 *          - reviews
 *     description: Retrieve all reviews or user-specific reviews if authenticated as an admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Review database query failed
 *   post:
 *     summary: Add a new review
 *     tags: 
 *          - reviews
 *     description: Add a new review for a university.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review_text:
 *                 type: string
 *                 description: The text of the review.
 *               university:
 *                 type: string
 *                 description: The name of the university.
 *               rating:
 *                 type: integer
 *                 description: The rating given for the review.
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized request
 *   patch:
 *     summary: Update a review
 *     tags: 
 *          - reviews
 *     description: Update the text or rating of a review.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review_id:
 *                 type: string
 *                 description: The ID of the review to be updated.
 *               review_text:
 *                 type: string
 *                 description: The updated text of the review.
 *               rating:
 *                 type: integer
 *                 description: The updated rating of the review.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Bad request, missing required fields or insufficient permissions
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Review does not exist
 * 
 * /reviews/{university}:
 *   get:
 *     summary: Get reviews by university
 *     tags: 
 *          - reviews
 *     description: Retrieve reviews for a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: A list of reviews for the university
 *       404:
 *         description: Review database query failed
 * 
 * /reviews/recommendation/{university}:
 *   get:
 *     summary: Get review recommendations by university
 *     tags: 
 *          - reviews
 *     description: Retrieve review recommendations for a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: A list of review recommendations for the university
 *       404:
 *         description: Review database query failed
 */


// TODO: review by university sort
module.exports = app => {
    app.route('/reviews')
        .get(authenticateToken, async (req, res) => {
            // list all reviews
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
                    .from('review')
                    .then(
                        results => {
                            res.json(results)
                        }
                    )
                    .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'review database query failed',
                            stack: err.stack,
                        })
                    )
            } else {
                // console.log('User goes to', uni_name)
                db
                    .select()
                    .from('review')
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
                            message: 'review database query failed',
                            stack: err.stack,
                        })
                    )
            }

            // res.json(reviews)
        })
        .post(authenticateToken, async (req, res) => {
            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object

            const reqReviewText = req.body.review_text
            const reqReviewUni = req.body.university
            const reqReviewRating = req.body.rating

            if (!reqReviewText) {
                return res.status(400).send('Missing review field')
            }

            db('review').insert({
                    user_email: email,
                    university_name: reqReviewUni,
                    review_text: reqReviewText,
                    rating: reqReviewRating
                }).returning("*")
                .then(
                    review_obj => res.status(201).json(review_obj)
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'review database insert failed',
                        stack: err.stack,
                    })
                )
        })
        .patch(authenticateToken, async (req, res) => {
            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object
            const reviewId = req.body.review_id
            const newReview = req.body.review_text
            const newRating = req.body.rating

            const user = await db.select().from('user').where('email', email).first()
            const reviewObj = await db.select().from('review').where('id', reviewId).first()

            if (!reviewObj) {
                return res.status(400).send("Review does not exist")
            }

            if (reviewObj.user_email != user.email || !user.is_admin) {
                return res.status(400).send("No permission to edit review")
            }

            const count = await db('review').where('id', reviewId).update({
                review_text: newReview,
                rating: newRating,
                updated: db.fn.now()
            })

            res.status(200).json({
                updated: count
            })
        })

    app.route('/reviews/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            db
                .select()
                .from('review')
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
                        message: 'review database query failed',
                        stack: err.stack,
                    })
                )
        })

    app.route('/reviews/recommendation/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            db
                .select('university_name', 'created', 'updated', 'rating')
                .from('review')
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
                        message: 'review database query failed',
                        stack: err.stack,
                    })
                )
        })
}