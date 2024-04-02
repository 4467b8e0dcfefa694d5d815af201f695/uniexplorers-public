const db = require('../knex.js')

/**
 * @swagger
 * tags:
 *   -  name: ranking
 *      description: Forum thread ranking operations
 */

/**
 * @swagger
 * /ranking:
 *   get:
 *     summary: Get ranked forum threads
 *     tags: 
 *          - ranking
 *     description: Retrieve ranked forum threads based on activity score.
 *     responses:
 *       200:
 *         description: A list of ranked forum threads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thread_id:
 *                     type: integer
 *                     description: The ID of the forum thread.
 *                   university_name:
 *                     type: string
 *                     description: The name of the university associated with the thread.
 *                   activity_score:
 *                     type: number
 *                     format: float
 *                     description: The calculated activity score of the thread.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 message:
 *                   type: string
 *                   description: Error message indicating server error.
 *                 stack:
 *                   type: string
 *                   description: Stack trace of the error.
 */


module.exports = app => {
    app.route('/forum/notifications')
        .get(async (req, res) => {
            // Retrieve recent notifs, less than 30 days from current datetime
            const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))
            const { userEmail } = req.query

            db('notification')
                .select()
                .where('user_email', userEmail)
                .andWhere('created_at', '>', thirtyDaysAgo)
                .then(results => {
                    res.json({
                        'success': true,
                        'recent_notifications': results
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        'success': false,
                        'err': err.stack
                    })
                })

        })
        .post(async (req, res) => {
            // Add new notification
            const { notifications } = req.body

            db('notification')
                .insert(notifications)
                .then(rowsAffected => {
                    res.json({
                        'success': true,
                        'rowsAffected': rowsAffected
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        'success': false,
                        'err': err.stack
                    })
                })
        })

    app.route('/forum/user_subscribed')
        .get(async (req, res) => {
            const { userEmail } = req.query

            db('watch_threads')
                .select()
                .where('user_email', userEmail)
                .then(results => {
                    res.json({
                        'success': true,
                        'subscribers': results
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        'success': false,
                        'err': err.stack
                    })
                })
        })

    app.route('/forum/subscribers')
        .get(async (req, res) => {
            const { threadId } = req.query

            db('watch_threads')
                .select()
                .where('thread_id', threadId)
                .then(results => {
                    res.json({
                        'success': true,
                        'subscribers': results
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        'success': false,
                        'err': err.stack
                    })
                })
        })
        .post(async (req, res) => {
            const { threadId, userEmail } = req.body

            const existing = await db('watch_threads')
                                .where({
                                    "thread_id": threadId,
                                    "user_email": userEmail
                                })
                                .first()

            if (existing) {
                return res.status(409).json({ // 409 CONFLICT
                    success: true,
                    status: `user ${userEmail} is already subscribed to thread ${threadId}`
                })
            }

            db('watch_threads')
                .insert({
                    "thread_id": threadId,
                    "user_email": userEmail
                })
                .then(results => {
                    res.json({
                        'success': true,
                        'status': "subscriber added"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        'success': false,
                        'err': err.stack
                    })
                })
        })
        
}