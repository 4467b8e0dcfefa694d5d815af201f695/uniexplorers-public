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
    app.get('/ranking', async (req, res) => {
        const decayFactor = 10 * 86400 // 10 days in seconds

        try {
            const results = await db('uni_forum_thread as uf_thread')
                .select(
                    'uf_thread.id',
                    'uf_thread.university_name'
                )
                .sum({
                    activity_score: db.raw(
                        `(
                            (uni_forum_comment.num_likes + uni_forum_comment.num_dislikes + 1) * 0.25 + 
                            (uf_thread.num_comments + 1) * 0.5
                        ) / (1 + (EXTRACT(EPOCH FROM (NOW() - uni_forum_comment.created)) / ?))`,
                        [decayFactor]
                    )
                })
                .join('uni_forum_comment', 'uf_thread.id', '=', 'uni_forum_comment.thread_id')
                .groupBy('uf_thread.id')
                .orderBy('activity_score', 'desc');

            const formattedResults = results.map(row => ({
                thread_id: row.id,
                university_name: row.university_name,
                activity_score: row.activity_score
            }))

            res.json(formattedResults)
        } catch (error) {
            console.error('Database query failed:', error)
            res.status(500).json({
                success: false,
                message: 'Server error occurred while fetching rankings.',
                stack: error.stack,
            })
        }
    })
}