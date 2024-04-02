const db = require('../knex.js')
const {
    authenticateToken
} = require('../modules/jwt_utils.js')

/**
 * @swagger
 * tags:
 *   -  name: forum_threads
 *      description: Operations related to forum threads
 *   -  name: forum_watch
 *      description: Operations related to watching a forum thread
 */

/**
 * @swagger
 * /forum/threads:
 *   get:
 *     summary: Get forum threads
 *     tags:
 *          - forum_threads
 *     description: Retrieve all forum threads or user-specific threads if authenticated as an admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of forum threads
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Database query failed
 *   post:
 *     summary: Add a new forum thread
 *     tags:
 *          - forum_threads
 *     description: Add a new forum thread.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forum_title:
 *                 type: string
 *                 description: The title of the forum thread.
 *               forum_text:
 *                 type: string
 *                 description: The text of the forum thread.
 *               forum_text_raw:
 *                 type: string
 *                 description: The raw text of the forum thread.
 *     responses:
 *       201:
 *         description: Forum thread added successfully
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized request
 *   patch:
 *     summary: Update a forum thread
 *     tags:
 *          - forum_threads
 *     description: Update the text of a forum thread.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thread_id:
 *                 type: string
 *                 description: The ID of the forum thread to be updated.
 *               forum_text:
 *                 type: string
 *                 description: The updated text of the forum thread.
 *               forum_text_raw:
 *                 type: string
 *                 description: The updated raw text of the forum thread.
 *     responses:
 *       200:
 *         description: Forum thread updated successfully
 *       400:
 *         description: Bad request, missing required fields or insufficient permissions
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Forum thread does not exist
 * 
 * /forum/threads/{university}:
 *   get:
 *     summary: Get forum threads of a specific university
 *     tags:
 *          - forum_threads
 *     description: Retrieve forum threads belonging to a specific university.
 *     parameters:
 *       - in: path
 *         name: university
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: A list of forum threads of the specified university
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
 *                   forum_title:
 *                     type: string
 *                     description: The title of the forum thread.
 *                   forum_text:
 *                     type: string
 *                     description: The text of the forum thread.
 *                   forum_text_raw:
 *                     type: string
 *                     description: The raw text of the forum thread.
 *                   comment_count:
 *                     type: integer
 *                     description: The number of comments on the thread.
 *                   thread_created:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the thread was created.
 *                   thread_updated:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the thread was last updated.
 *       404:
 *         description: No forum threads found for the specified university
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
 * 
 * /forum/{thread_id}:
 *   get:
 *     summary: Get forum thread details
 *     tags:
 *          - forum_threads
 *     description: Retrieve details of a specific forum thread.
 *     parameters:
 *       - in: path
 *         name: thread_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the forum thread.
 *     responses:
 *       200:
 *         description: Details of the specified forum thread
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thread_id:
 *                   type: integer
 *                   description: The ID of the forum thread.
 *                 university_name:
 *                   type: string
 *                   description: The name of the university associated with the thread.
 *                 forum_title:
 *                   type: string
 *                   description: The title of the forum thread.
 *                 forum_text:
 *                   type: string
 *                   description: The text of the forum thread.
 *                 forum_text_raw:
 *                   type: string
 *                   description: The raw text of the forum thread.
 *                 comment_count:
 *                   type: integer
 *                   description: The number of comments on the thread.
 *                 thread_created:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the thread was created.
 *                 thread_updated:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the thread was last updated.
 *       404:
 *         description: Forum thread not found
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
 * /forum/watch_thread:
 *   post:
 *     summary: Toggle watch status for a forum thread
 *     tags:
 *          - forum_threads
 *          - forum_watch
 *     description: Add or remove a watch for a specific forum thread.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thread_id:
 *                 type: integer
 *                 description: The ID of the forum thread to watch.
 *               user_email:
 *                 type: string
 *                 description: The email of the user watching the thread.
 *     responses:
 *       200:
 *         description: Watch status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the status of the watch operation.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating server error.
* /forum/watch_thread/check/{thread_id}:
 *   get:
 *     summary: Check if a user is watching a forum thread
 *     tags:
 *          - forum_threads
 *          - forum_watch
 *     description: Check whether a user is watching a specific forum thread.
 *     parameters:
 *       - in: path
 *         name: thread_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the forum thread to check.
 *       - in: query
 *         name: user_email
 *         schema:
 *           type: string
 *         description: The email of the user to check.
 *     responses:
 *       200:
 *         description: Watch status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isWatching:
 *                   type: boolean
 *                   description: Indicates whether the user is watching the thread.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating server error.
 */



module.exports = app => {
    app.route('/forum/threads')
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
                    .from('uni_forum_thread')
                    .then(
                        results => {
                            res.json(results)
                        }
                    )
                    .catch(err => res
                        .status(404)
                        .json({
                            success: false,
                            message: 'uni forum thread database query failed',
                            stack: err.stack,
                        })
                    )
            } else {
                // console.log('User goes to', uni_name)
                db
                    .select()
                    .from('uni_forum_thread')
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
                            message: 'uni forum thread database query failed',
                            stack: err.stack,
                        })
                    )
            }

            // res.json(threads)
        })
        .post(authenticateToken, async (req, res) => {
            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object

            const reqForumPostTitle = req.body.forum_title
            const reqForumPostText = req.body.forum_text
            const reqForumPostTextRaw = req.body.forum_text_raw

            if (!reqForumPostText) {
                return res.status(400).send('Missing forum text field')
            }

            if (!reqForumPostTitle) {
                return res.status(400).send('Missing forum title field')
            }

            const thread_obj = await db('uni_forum_thread').insert({
                user_email: email,
                university_name: user_university,
                forum_text: reqForumPostText,
                forum_text_raw: reqForumPostTextRaw
            }).returning("*")

            res.status(201).json(thread_obj)
        })
        .patch(authenticateToken, async (req, res) => {
            const {
                email,
                name,
                created,
                updated,
                is_admin
            } = req.jwt_object

            const threadId = req.body.thread_id
            const newThread = req.body.forum_text
            const newThreadRaw = req.body.forum_text

            const threadObj = await db.select().from('uni_forum_thread').where('id', threadId).first()

            if (!threadObj) {
                return res.status(400).send("Thread does not exist")
            }

            if (threadObj.user_email != email || !is_admin) {
                return res.status(400).send("No permission to edit thread")
            }

            const count = await db('uni_forum_thread').where('id', threadId).update({
                forum_text: newThread,
                forum_text_raw: newThreadRaw,
                updated: db.fn.now()
            })

            res.status(200).json({
                updated: count
            })
        })

    app.route('/forum/threads/:university')
        .get(async (req, res) => {
            const university_name = req.params.university

            db('uni_forum_thread')
                .select(
                    'uni_forum_thread.id as thread_id',
                    'uni_forum_thread.university_name',
                    'uni_forum_thread.forum_title',
                    'uni_forum_thread.forum_text',
                    'uni_forum_thread.forum_text_raw',
                    'uni_forum_thread.num_comments as comment_count',
                    'uni_forum_thread.created as thread_created',
                    'uni_forum_thread.updated as thread_updated',
                )
                .select(db('uni_forum_comment')
                    .select(
                        db.raw(
                            `json_build_object("uni_forum_comment"."user_email", "uni_forum_comment"."comment_text")`
                        )
                    )
                    .whereRaw('uni_forum_comment.thread_id = uni_forum_thread.id')
                    .orderBy('uni_forum_comment.created', 'desc')
                    .limit(1)
                    .as('first_comment_text_with_name')
                )
                .where('uni_forum_thread.university_name', university_name)
                .leftJoin('uni_forum_comment', 'uni_forum_thread.id', 'uni_forum_comment.thread_id')
                .groupBy(
                    'uni_forum_thread.id',
                    'uni_forum_thread.university_name',
                    'uni_forum_thread.forum_title',
                    'uni_forum_thread.forum_text',
                    'uni_forum_thread.forum_text_raw',
                    'uni_forum_thread.created',
                    'uni_forum_thread.updated'
                )
                .then(data => {
                    res.json(data)
                })
                .catch(error => {
                    console.error(error)
                })
        })

    app.route('/forum/:thread_id')
        .get(async (req, res) => {
            const {
                thread_id
            } = req.params

            const firstCommentSubquery = db('uni_forum_comment')
                                            .select('thread_id')
                                            .max('id as first_comment_id')
                                            .where('thread_id', thread_id)
                                            .groupBy('thread_id')
                                            .as('first_comment')
            
            db('uni_forum_thread')
                .select(
                    'uni_forum_thread.forum_title',
                    'uni_forum_thread.forum_text_raw',
                    'uni_forum_thread.university_name',
                    'fc.user_email as user_email',
                    'fc.comment_text as first_comment_text',
                    'fc.created as first_comment_created',
                    'fc.updated as first_comment_updated'
                )
                .leftJoin(
                    firstCommentSubquery, 'first_comment.thread_id', 'uni_forum_thread.id'
                )
                .leftJoin(
                    'uni_forum_comment as fc', 'fc.id', 'first_comment.first_comment_id'
                )
                .where('uni_forum_thread.id', thread_id)
                .first()
                .then(
                    results => {
                        res.json(results)
                    }
                )
                .catch(err => 
                    res
                    .status(404)
                    .json({
                        success: false,
                        message: 'uni forum thread database query failed',
                        stack: err.stack,
                    })
                )

            // db
            //     .select()
            //     .from('uni_forum_thread')
            //     .select(db('uni_forum_comment')
            //         .select(
            //             db.raw(
            //                 `json_build_object("uni_forum_comment"."user_email", "uni_forum_comment"."comment_text")`
            //             )
            //         )
            //         .where('uni_forum_comment.thread_id', 'uni_forum_thread.id')
            //         .orderBy('uni_forum_comment.created', 'desc')
            //         .limit(1)
            //         .as('first_comment_text_with_name')
            //     )
            //     .leftJoin('uni_forum_comment', 'uni_forum_thread.id', 'uni_forum_comment.thread_id')
            //     .where('uni_forum_comment.thread_id', thread_id)
            //     .then(
            //         results => {
            //             res.json(results)
            //         }
            //     )
            //     .catch(err => res
            //         .status(404)
            //         .json({
            //             success: false,
            //             message: 'uni forum thread database query failed',
            //             stack: err.stack,
            //         })
            //     )
        })

    app.route('/forum/watch_thread')
        .post(async (req, res) => {

            const { thread_id, user_email } = req.body;

            try {

                const existingWatch = await db('watch_threads')
                    .where({
                        thread_id,
                        user_email
                    })
                    .first();
    
                if (existingWatch) {
                    await db('watch_threads')
                        .where({
                            thread_id,
                            user_email
                        })
                        .del();
                    res.json({ message: 'Watch removed' });
                } else {
                    await db('watch_threads').insert({
                        thread_id,
                        user_email
                    });
                    res.json({ message: 'Watch added' });
                }
            } catch (error) {
                console.error('Error toggling watch status:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        })

    app.route('/forum/watch_thread/check/:thread_id')
        .get(async (req, res) => {
            
            const { thread_id } = req.params;
            const user_email = req.query.user_email;
    
            try {
                const watchStatus = await db('watch_threads')
                    .where({
                        thread_id: thread_id,
                        user_email: user_email
                    })
                    .first();
    
                res.json({ isWatching: !!watchStatus });
            } catch (error) {
                console.error('Error checking watch status:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

    }

    