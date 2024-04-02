require('dotenv').config()
const {
    ORIGIN,
    SERVER_PORT,
    CLERK_SECRET_KEY
} = process.env

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { ClerkExpressRequireAuth, users } = require('@clerk/clerk-sdk-node')
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ORIGIN.split(',')
}))
app.use(express.urlencoded({
    extended: true
}))

app.get('/auth', ClerkExpressRequireAuth({
    authorizedParties : ORIGIN.split(',')
    }), async (req, res) => {
            const { getToken, userId } = req.auth;
            // sends back an Authorization token with proper JWT to be used for further processing
            res.header(
                'Authorization',
                `Bearer ${await getToken({template : 'UniExplorers'})}`
            )
            res.json(req.auth);
        }
);

app.put('/auth/update', ClerkExpressRequireAuth({
    authorizedParties : ORIGIN.split(',')
}), async (req, res) => {
    const { userId } = req.auth;
    const { profileImage, ...metadata } = req.body

    const updatedUser = await users.updateUser(userId, {
        publicMetadata : metadata
    })

    if (profileImage) {
        const updatedImg = await fetch(`https://api.clerk.com/v1/users/${userId}/profile_image`, {
            method : 'PUT',
            headers : {
                Authorization: `Bearer ${CLERK_SECRET_KEY}`
            },
            body : profileImage
        })
        res.json(updatedImg)
    } else {
        res.json(updatedUser)
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});


app.listen(SERVER_PORT, console.log(`Server is running on port ${SERVER_PORT}`))