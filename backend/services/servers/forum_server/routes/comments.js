const db = require('../knex.js')
const request = require('request')
const {
    authenticateToken
} = require('../modules/jwt_utils.js')

const NOTIF_SERVER = process.env.NOTIF_SERVER

/**
 * @swagger
 *  tags:
 *      -   name: comments
 *          description: Forum comments operations
 *      -   name: reacts
 *          description: Forum comment reactions operations
 * /forum/comments:
 *   get:
 *     summary: Retrieve forum comments
 *     tags: 
 *          - comments
 *     description: Retrieve all forum comments or user-specific comments if authenticated as an admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of forum comments
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Database query failed
 *   post:
 *     summary: Add a new comment
 *     tags: 
 *          - comments
 *     description: Add a new comment to the forum.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_text:
 *                 type: string
 *                 description: The text of the comment.
 *               parent_id:
 *                 type: string
 *                 description: The parent comment ID if this is a reply.
 *               thread_id:
 *                 type: string
 *                 description: The ID of the thread this comment belongs to.
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Invalid thread_id field
 *   patch:
 *     summary: Update a comment
 *     tags: 
 *          - comments
 *     description: Update the text of a comment.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: string
 *                 description: The ID of the comment to be updated.
 *               comment_text:
 *                 type: string
 *                 description: The updated text of the comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request, missing required fields or insufficient permissions
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Comment does not exist
*/

/**
 * @swagger
 * /forum/comments/{thread_id}:
 *   get:
 *     summary: Get comments for a specific forum thread
 *     tags: 
 *          - comments
 *     description: Retrieve comments for a specific forum thread, including nested comments.
 *     parameters:
 *       - in: path
 *         name: thread_id
 *         required: true
 *         description: ID of the forum thread to retrieve comments for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully.
 *       404:
 *         description: Forum comment database query failed.
 */

/**
 * @swagger
 * /forum/comments/like:
 *   post:
 *     summary: Like or unlike a forum comment
 *     tags: 
 *          - comments
 *          - reacts
 *     description: Toggle the like status for a forum comment. If the user has already liked the comment, it unlikes it; otherwise, it likes the comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: string
 *                 description: ID of the comment to like/unlike.
 *               user_email:
 *                 type: string
 *                 description: Email of the user performing the action.
 *     responses:
 *       200:
 *         description: Toggle successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the toggle was successful.
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the toggle.
 *       400:
 *         description: Missing comment_id or user_email in the request body.
 *       500:
 *         description: Toggling like on the comment failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the toggle failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the reason for failure.
 */

/**
 * @swagger
 * /forum/comments/dislike:
 *   post:
 *     summary: Dislike or remove dislike from a forum comment
 *     tags: 
 *          - comments
 *          - reacts
 *     description: Toggle the dislike status for a forum comment. If the user has already disliked the comment, it removes the dislike; otherwise, it dislikes the comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: string
 *                 description: ID of the comment to dislike/remove dislike from.
 *               user_email:
 *                 type: string
 *                 description: Email of the user performing the action.
 *     responses:
 *       200:
 *         description: Toggle successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the toggle was successful.
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the toggle.
 *       400:
 *         description: Missing comment_id or user_email in the request body.
 *       500:
 *         description: Toggling dislike on the comment failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the toggle failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the reason for failure.
 */

/**
 * @swagger
 * /forum/comments_liked/{user_email}:
 *   get:
 *     summary: Get liked comments by user
 *     tags: 
 *          - comments
 *          - reacts
 *     description: Retrieve the comments liked by a specific user based on their email.
 *     parameters:
 *       - in: path
 *         name: user_email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user whose liked comments are to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved liked comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 comments:
 *                   type: array
 *                   description: The array of comments liked by the user.
 *       500:
 *         description: Failed to fetch liked comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the reason for failure.
 *                 stack:
 *                   type: string
 *                   description: The error stack trace.
 */

/**
 * @swagger
 * /forum/comments_disliked/{user_email}:
 *   get:
 *     summary: Get disliked comments by user
 *     tags: 
 *          - comments
 *          - reacts
 *     description: Retrieve the comments disliked by a specific user based on their email.
 *     parameters:
 *       - in: path
 *         name: user_email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user whose disliked comments are to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved disliked comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 comments:
 *                   type: array
 *                   description: The array of comments disliked by the user.
 *       500:
 *         description: Failed to fetch disliked comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the reason for failure.
 *                 stack:
 *                   type: string
 *                   description: The error stack trace.
 */




module.exports = app => {
    app.route('/forum/comments')
        .get(authenticateToken, async (req, res) => {
            // list all threads
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
                    .from('uni_forum_comment')
                    .then(
                        results => {
                            res.json(results)
                        }
                    )
                    .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'uni forum comment database query failed',
                            stack: err.stack,
                        })
                    )
            } else {
                // console.log('User goes to', uni_name)
                db
                    .select()
                    .from('uni_forum_comment')
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
                            message: 'uni forum comment database query failed',
                            stack: err.stack,
                        })
                    )
            }

            // res.json(threads)
        })
        .post(authenticateToken, async (req, res) => {
            const reqCommentText = req.body.comment_text
            const reqCommentTextRaw = req.body.comment_text_raw
            const parentId = req.body.parent_id
            const threadId = req.body.thread_id
            const uniName = req.body.uni_name

            const {
                email,
                name,
                created,
                updated,
                is_admin,
                image_filename
            } = req.jwt_object

            if (!reqCommentText) {
                return res.status(400).send('Missing comment text field')
            }

            if (!threadId) {
                return res.status(400).send('Missing thread_id field')
            }

            const threadObj = await db.select().from('uni_forum_thread').where('id', threadId).first()

            if (!threadObj) {
                return res.status(400).send('Invalid thread_id field')
            }

            // const user = await db.select().from('user').where('email', email).first()
            // const user_email = user.email
            // const user_image_filename = user.image_filename
            // const user_university = user.university

            const comment_obj = {
                user_email: email,
                thread_id: threadId,
                comment_text: reqCommentText,
                comment_text_raw: reqCommentTextRaw
            }

            if (parentId) {
                comment_obj.parent_id = parentId
            }

            const thread_obj = await db('uni_forum_comment').insert(comment_obj).returning("*")

            const pub_data = {
                threadId: threadId,
                uniName: uniName,
                commentBy: email,
                message: reqCommentText
            }

            const api = `${NOTIF_SERVER}/publish/notification`
            console.log(api)
            const publish_notif = await request.post(api, {
                json: pub_data
            })
            pub_res = publish_notif.toJSON()
            if (pub_res['status'] !== 'success') {
                console.error('Publish Notification Error')
            }

            res.status(201).json({
                ...thread_obj,
                image_filename: image_filename
            })


        })
        .patch(authenticateToken, async (req, res) => {
            const commentId = req.body.comment_id
            const newComment = req.body.comment_text

            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object

            const commentObj = await db.select().from('uni_forum_comment').where('id', commentId).first()

            if (!commentObj) {
                return res.status(400).send("Thread does not exist")
            }

            if (commentObj.user_email != email || !is_admin) {
                return res.status(400).send("No permission to edit thread")
            }

            const count = await db('uni_forum_thread').where('id', commentId).update({
                comment_text: newComment,
                updated: db.fn.now()
            })

            res.status(200).json({
                updated: count
            })
        })

    app.route('/forum/comments/:thread_id')
        .get(async (req, res) => {
            const {
                thread_id
            } = req.params

            db
                .withRecursive('nested_comments', (children) => {
                    children
                        .select(
                            'id',
                            'thread_id',
                            'parent_id',
                            'user_email',
                            'comment_text',
                            'comment_text_raw',
                            'num_likes',
                            'num_dislikes',
                            'num_children',
                            'created',
                            'updated',
                        )
                        .select(db.raw('1 AS depth'))
                        .from('uni_forum_comment')
                        .where(
                            {
                                thread_id: thread_id,
                                parent_id: null
                            }
                        )
                        .unionAll((children) => {
                            children
                                .select(
                                    'c.id',
                                    'c.thread_id',
                                    'c.parent_id',
                                    'c.user_email',
                                    'c.comment_text',
                                    'c.comment_text_raw',
                                    'c.num_likes',
                                    'c.num_dislikes',
                                    'c.num_children',
                                    'c.created',
                                    'c.updated',
                                )
                                .select(db.raw('nc.depth + 1'))
                                .from({c: 'uni_forum_comment'})
                                .innerJoin({nc: 'nested_comments'}, 'c.parent_id', '=', 'nc.id')
                        })
                })
                .select()
                .from('nested_comments')
                .then(
                    results => {
                        res.json(results)
                    }
                )
                .catch(err => res
                    .status(404)
                    .json({
                        success: false,
                        message: 'uni forum comment database query failed',
                        stack: err.stack,
                    })
                )
        })

    app.route('/forum/comments/like')
        .post(async (req, res) => {
            const { comment_id, user_email } = req.body

            if (!comment_id || !user_email) {
                return res.status(400).send("Missing comment_id or user_email")
            }

            try {
                const existingDislike = await db('comment_dislikes')
                    .where({
                        comment_id,
                        user_email
                    }).first()

                if (existingDislike) {
                    await db('comment_dislikes')
                        .where({
                            comment_id,
                            user_email
                        }).del()
                }

                const existingLike = await db('comment_likes')
                    .where({
                        comment_id,
                        user_email
                    }).first()

                if (!existingLike) {
                    await db('comment_likes')
                        .insert({
                            comment_id,
                            user_email
                        })
                } else {
                    await db('comment_likes')
                        .where({
                            comment_id,
                            user_email
                        }).del()
                }

                res.status(200).json({
                    success: true,
                    message: "toggling comment like successful"
                })
            } 
            catch (error) {
                console.error(error)

                res.status(500).json({
                    success: false,
                    message: "toggling like on the comment failed",
                    stack: error.stack
                })
            }
        })

    app.route('/forum/comments/dislike')
        .post(async (req, res) => {
            const { comment_id, user_email } = req.body

            if (!comment_id || !user_email) {
                return res.status(400).send("Missing comment_id or user_email")
            }

            try {
                const existingLike = await db('comment_likes')
                    .where({
                        comment_id,
                        user_email
                    }).first()

                if (existingLike) {
                    await db('comment_likes')
                        .where({
                            comment_id,
                            user_email
                        }).del()
                }

                const existingDislike = await db('comment_dislikes')
                    .where({
                        comment_id,
                        user_email
                    }).first()

                if (!existingDislike) {
                    await db('comment_dislikes')
                        .insert({
                            comment_id,
                            user_email
                        })
                } else {
                    await db('comment_dislikes')
                        .where({
                            comment_id,
                            user_email
                        }).del()
                }

                res.status(200).json({
                    success: true,
                    message: "toggling comment dislike successful"
                })
            } 
            catch (error) {
                console.error(error)

                res.status(500).json({
                    success: false,
                    message: "toggling dislike on the comment failed",
                    stack: error.stack
                })
            }
        })

    app.route('/forum/comments_liked/:user_email')
        .get((req, res) => {
            const { user_email } = req.params

            db('comment_likes')
                .join('uni_forum_comment', 'comment_likes.comment_id', '=', 'uni_forum_comment.id')
                .where('comment_likes.user_email', user_email)
                .select('uni_forum_comment.*')
                .then((comments) => {
                    res.json({
                        success: true,
                        comments: comments
                    })
                })
                .catch(err => res
                    .status(500)
                    .json({
                        success: false,
                        message: "failed to fetch liked comments",
                        stack: err.stack
                    }))
        })

    app.route('/forum/comments_disliked/:user_email')
        .get((req, res) => {
            const { user_email } = req.params

            db('comment_dislikes')
                .join('uni_forum_comment', 'comment_dislikes.comment_id', '=', 'uni_forum_comment.id')
                .where('comment_dislikes.user_email', user_email)
                .select('uni_forum_comment.*')
                .then((comments) => {
                    res.json({
                        success: true,
                        comments: comments
                    })
                })
                .catch(err => res
                    .status(500)
                    .json({
                        success: false,
                        message: "failed to fetch disliked comments",
                        stack: err.stack
                    }))
        })
}