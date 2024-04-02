/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async (knex) => {  
    return knex('uni_exchange').insert([
        {
            university_name: 'Singapore Management University',
            duration: 3,
        },
        {
            university_name: 'Singapore Management University',
            duration: 6,
        },
        // {
        //     university_name: 'National University of Singapore',
        //     duration: 3,
        // },
        // {
        //     university_name: 'National University of Singapore',
        //     duration: 6,
        // },
    ])
}