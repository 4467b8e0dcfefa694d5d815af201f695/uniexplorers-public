// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> } 
//  */

exports.seed = async (knex) => {
    await knex('uni_tag').del()
    await knex('review').del()
    await knex('uni_user').del()
    await knex('uni_exchange').del()
    await knex('uni_major').del()
    await knex('major').del()
    await knex('tag').del()
  
    return knex('university').del().then(
        async () => {
            return knex('university').insert([
                {
                    name: 'Singapore Management University',
                    location: 'Singapore',
                    continent: 'Asia',
                    gpa_10_percentile: 2.0,
                    gpa_90_percentile: 4.0,
                    flavor_text: 'Small',
                }
                // {
                //     name: 'Lively Asian University',
                //     location: 'Malaysia',
                //     continent: 'Asia',
                //     gpa_10_percentile: 3.0,
                //     gpa_90_percentile: 4.0,
                //     flavor_text: 'Lively and exciting, with many cultural activities'
                // },
                // {
                //     name: 'Dynamic European University',
                //     location: 'Denmark',
                //     continent: 'Europe',
                //     gpa_10_percentile: 3.0,
                //     gpa_90_percentile: 4.0,
                //     flavor_text: 'On the forefront of the liberal arts. Many sights to see'
                // },
                // {
                //     name: 'Intellectual North American University',
                //     location: 'Pittsburgh',
                //     continent: 'North America',
                //     gpa_10_percentile: 3.0,
                //     gpa_90_percentile: 4.0,
                //     flavor_text: 'Lots of studying and tweed here. Ralph Lauren, dark academia vibes'
                // },
                // {
                //     name: 'Vibrant South American University',
                //     location: 'Buenos Aires',
                //     continent: 'South America',
                //     gpa_10_percentile: 3.0,
                //     gpa_90_percentile: 4.0,
                //     flavor_text: 'The engineering programme here is amazing. Give the food a try!'
                // },
                // {
                //     name: 'Exciting Oceanic University',
                //     location: 'Melbourne',
                //     continent: 'Oceania',
                //     gpa_10_percentile: 3.0,
                //     gpa_90_percentile: 4.0,
                //     flavor_text: 'Coffee capital of the world and they need it'
                // }
            ])
        }
    )
}
