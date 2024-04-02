/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async (knex) => {
    return knex('uni_user').insert([
        // {
        //     university_name: 'National University of Singapore',
        //     user_email: 'jared@admin.com',
        // },
        // {
        //     university_name: 'National University of Singapore',
        //     user_email: 'jared@notadmin.com',
        //     is_home: true,
        // },
        {
            university_name: 'Singapore Management University',
            user_email: 'jared@notadmin.com',
            is_home: false,
        },
    ])
}
