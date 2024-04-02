exports.up = function(knex) {
    return knex.schema.withSchema('public')
        .createTable('user', (table) => {
            // table.string('id').unique().notNullable()
            table.string('email').primary().notNullable()
            // table.boolean('is_admin').notNullable().defaultTo(false)
            table.string('image_filename')
            // table.boolean('is_alumni').defaultTo(false)
            table.string('flavor_text').notNullable().defaultTo("Life-long learner")
            table.integer('year_on_exchange').defaultTo(null)
            table.integer('exchange_duration').defaultTo(null)
            table.dateTime('updated').defaultTo(knex.fn.now())
            table.string('university_name').notNullable()
            table.string('handle').defaultTo('')
            table.string('exchange_name').defaultTo('')
            table.string('major').notNullable().defaultTo('Undecided')
            table.string('aspire')
        })
        .createTable('interest', (table) => {
            table.increments('id').primary().notNullable()
            table.string('interest').unique().notNullable()
        })
        .createTable('user_interest', (table) => {
            table.integer('interest_id').index().references('id').inTable('interest').notNullable()
            table.string('user_email').index().references('email').inTable('user').notNullable()
            table.primary(['interest_id', 'user_email'])
        })
}

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('interest')
        .dropTableIfExists('user_interest')
        .dropTableIfExists('user')
}