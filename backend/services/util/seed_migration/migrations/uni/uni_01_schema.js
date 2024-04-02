exports.up = function(knex) {
    return knex.schema.withSchema('public')
        .createTable('university', (table) => {
            table.string('name').primary()
            table.string('location').notNullable()
            table.enum('continent', ['Asia', 'Africa', 'North America', 'South America', 'Europe', 'Oceania', 'Middle East']).defaultTo(null)
            table.float('gpa_10_percentile').defaultTo(null)
            table.float('gpa_90_percentile').defaultTo(null)
            table.string('image_filename')
            table.text('flavor_text')
            table.string("invite_link")
            table.dateTime('created').defaultTo(knex.fn.now())
            table.dateTime('updated')
        })
        .createTable('major', (table) => {
            table.string('name').primary()
        })
        .createTable('tag', (table) => {
            table.string('name').primary()
        })
        .createTable('review', (table) => {
            table.increments('id').primary()
            table.string('user_email')
            table.string('university_name').index().references('name').inTable('university')
            table.text('review_text').notNullable()
            table.dateTime('created').defaultTo(knex.fn.now())
            table.dateTime('updated')
            table.float('rating').notNullable()
        })
        .createTable('uni_major', (table) => {
            table.string('university_name').index().references('name').inTable('university')
            table.string('major_name').index().references('name').inTable('major')
        })
        .createTable('uni_tag', (table) => {
            table.string('university_name').index().references('name').inTable('university')
            table.string('tag_name').index().references('name').inTable('tag')
        })
        .createTable('uni_exchange', (table) => {
            table.string('university_name').index().references('name').inTable('university')
            table.string('duration').notNullable()
        })
        .createTable('uni_user', (table) => {
            table.string('university_name').index().references('name').inTable('university')
            table.string('user_email')
            table.boolean('is_home').notNullable().defaultTo(true) // true - home, false - exchange
        })
        .createTable('university_image', (table) => {
            table.string('university_name').index().references('name').inTable('university')
            table.string('image_filename')
            table.primary(['university_name', 'image_filename'])
        })
}

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('tag')
        .dropTableIfExists('review')
        .dropTableIfExists('uni_tag')
        .dropTableIfExists('uni_exchange')
        .dropTableIfExists('uni_user')
        .dropTableIfExists('university_image')
        .dropTableIfExists('university')
}