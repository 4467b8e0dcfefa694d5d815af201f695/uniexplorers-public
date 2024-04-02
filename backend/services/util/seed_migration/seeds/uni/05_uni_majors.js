/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async (knex) => {
    return knex('uni_major').insert([
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Information Systems', //  IS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Business', //  Biz
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Computer Science', //  CS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Law', //  CS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Accountancy', //  CS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Economics', //  CS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Computing & Law', //  CS
        },
        {
            university_name: 'Singapore Management University', // SMU
            major_name: 'Social Sciences', //  CS
        }
    ])
}
