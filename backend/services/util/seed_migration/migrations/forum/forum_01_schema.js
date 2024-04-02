exports.up = function(knex) {
    return knex.schema.withSchema('public')
        .createTable('uni_forum_thread', (table) => {
            table.increments('id').primary()
            table.string('university_name')
            table.string('user_email')
            table.text('forum_title').notNullable()
            table.text('forum_text').notNullable()
            table.text('forum_text_raw').notNullable()
            table.integer('num_comments').notNullable().defaultTo(0)
            table.dateTime('created').defaultTo(knex.fn.now())
            table.dateTime('updated')
        })
        .createTable('uni_forum_comment', (table) => {
            table.increments('id').primary()
            table.string('user_email')
            table.integer('thread_id').index().references('id').inTable('uni_forum_thread').notNullable()
            table.integer('parent_id').index().references('id').inTable('uni_forum_comment')
            // SELECT COUNT(*) FROM comment_likes WHERE comment_id = id
            table.integer('num_likes').defaultTo(0)
            table.integer('num_dislikes').defaultTo(0)
            table.integer('num_children').defaultTo(0)
            table.text('comment_text').notNullable()
            table.text('comment_text_raw').notNullable()
            table.dateTime('created').defaultTo(knex.fn.now())
            table.dateTime('updated')
        })
        .createTable('comment_likes', (table) => {
            table.string('user_email')
            table.integer('comment_id').index().references('id').inTable('uni_forum_comment')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.primary(['user_email', 'comment_id'])
        })
        .createTable('comment_dislikes', (table) => {
            table.string('user_email')
            table.integer('comment_id').index().references('id').inTable('uni_forum_comment')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.primary(['user_email', 'comment_id'])
        })
        .createTable('watch_threads', (table) => {
            table.integer('thread_id').index().references('id').inTable('uni_forum_thread')
            table.string('user_email').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.primary(['thread_id', 'user_email'])
        })
        .createTable('subscriber', (table) => {
            table.integer('thread_id').index().references('id').inTable('uni_forum_thread')
            table.string('user_email').notNullable()
        })
        .createTable('notification', (table) => {
            table.increments('id').primary()
            table.integer('thread_id').index().references('id').inTable('uni_forum_thread')
            table.string('uni_name')
            table.string('comment_by')
            table.string('user_email')
            table.string('message')
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
}

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('notification')
        .dropTableIfExists('subscriber')
        .dropTableIfExists('comment_likes')
        .dropTableIfExists('comment_dislikes')
        .dropTableIfExists('watch_thread')
        .dropTableIfExists('uni_forum_comment')
        .dropTableIfExists('uni_forum_thread')
}