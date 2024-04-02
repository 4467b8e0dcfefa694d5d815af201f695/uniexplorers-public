const { 
    USER_DB_CLIENT,
    USER_DB_NAME,
    USER_DB_USER,
    USER_DB_PASSWORD,
    USER_DB_HOST,
    USER_DB_PORT,
    USER_DB_EXTERNAL_PORT,
    FORUM_DB_CLIENT,
    FORUM_DB_NAME,
    FORUM_DB_USER,
    FORUM_DB_PASSWORD,
    FORUM_DB_HOST,
    FORUM_DB_PORT,
    FORUM_DB_EXTERNAL_PORT,
    UNI_DB_CLIENT,
    UNI_DB_NAME,
    UNI_DB_USER,
    UNI_DB_PASSWORD,
    UNI_DB_HOST,
    UNI_DB_PORT,
    UNI_DB_EXTERNAL_PORT
} = process.env

// console.log(process.env);

module.exports = {
    dev_user: {
        client: USER_DB_CLIENT,
        // debug: true,
        connection: {
            database: USER_DB_NAME,
            user: USER_DB_USER,
            password: USER_DB_PASSWORD,
            host: USER_DB_HOST,
            port: USER_DB_PORT
        },
        migrations: {
            directory: __dirname + '/migrations/user'
        },
        seeds: {
            directory: __dirname + '/seeds/user'
        }
    },

    dev_forum: {
        client: FORUM_DB_CLIENT,
        // debug: true,
        connection: {
            database: FORUM_DB_NAME,
            user: FORUM_DB_USER,
            password: FORUM_DB_PASSWORD,
            host: FORUM_DB_HOST,
            port: FORUM_DB_PORT
        },
        migrations: {
            directory: __dirname + '/migrations/forum'
        },
        seeds: {
            directory: __dirname + '/seeds/forum'
        }
    },

    dev_uni: {
        client: UNI_DB_CLIENT,
        // debug: true,
        connection: {
            database: UNI_DB_NAME,
            user: UNI_DB_USER,
            password: UNI_DB_PASSWORD,
            host: UNI_DB_HOST,
            port: UNI_DB_PORT
        },
        migrations: {
            directory: __dirname + '/migrations/uni'
        },
        seeds: {
            directory: __dirname + '/seeds/uni'
        }
    }
}