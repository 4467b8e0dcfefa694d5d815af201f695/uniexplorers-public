// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> } 
//  */

exports.seed = async (knex) => {
    return knex('major').insert([
        {
            name: 'Information Systems',
        },
        {
            name: 'Business',
        },
        {
            name: 'Computer Science',
        },
        {
            name: 'Accountancy',
        },
        {
            name: 'Social Sciences',
        },
        {
            name: 'Computing & Law',
        },
        {
            name: 'Law',
        },
        {
            name: 'Economics',
        },
    ])
}
