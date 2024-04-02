const db = require('../knex')

const {
    generateAccessToken
} = require('../modules/jwt_utils.js')

/**
 * @swagger
 * tags:
 *   -  name: dev
 *      description: Route to be disabled during prod deployment
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: 
 *          - dev
 *     description: Authenticate user and generate access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Successful login, returns access token and user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The access token.
 *                 user_data:
 *                   type: object
 *                   description: The user's data.
 *       400:
 *         description: Bad request, missing email or incorrect email/password.
 */


module.exports = app => {
    app.route('/login')
        .post(async (req, res) => {
            // retrieve user from db
            const reqEmail = req.body.email
            // const reqPassword = req.body.password

            // if (!reqEmail || !reqPassword) {
            if (!reqEmail) {
                return res.status(400).send("Email missing")
            }

            const user = await db.select().from('user').where('email', reqEmail).first()

            // check if user exists
            if (!user) {
                return res.status(400).send('Email or password is incorrect')
            }

            // check if password is correct
            // const validPassword = await bcrypt.compare(reqPassword, user.password)
            // if (!validPassword) {
            //     return res.status(400).send('Email or password is incorrect')
            // }

            const token = generateAccessToken(
                user.email, 
                user.flavor_text,
                user.year_on_exchange,
                user.exchange_duration,
                user.updated,
                user.university_name,
                user.major,
                user.aspire
            )

            res.json({
                'token': token,
                'user_data': user
            })
        })
}