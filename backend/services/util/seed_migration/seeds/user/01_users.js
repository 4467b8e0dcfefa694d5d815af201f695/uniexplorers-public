/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
    await knex("user_interest").del()
    await knex("interest").del()
    await knex("user").del()
    
    return knex("user").insert([
        {
            email: "test@mail.com",
            university_name: "School of Hard Knocks"
        },
        {
            email: "everything@mail.com",
            university_name: "School of Hard Knocks"
        },
        {
            email: "nothing@mail.com",
            university_name: "School of Hard Knocks"
        }
        // {
        //     email: "akeelaf.2022@smu.edu.sg",
        //     university_name: "Singapore Management University"
        // },
        // {
        //     email: "yfseet.2022@smu.edu.sg",
        //     university_name: "Singapore Management University"
        // },
        // {
        //     email: "darryl.poh.2022@smu.edu.sg",
        //     university_name: "Singapore Management University"
        // },
        // {
        //     email: "zftoh.2022@smu.edu.sg",
        //     university_name: "Singapore Management University"
        // },
        // {
        //     email: "jingjie.lim.2022@smu.edu.sg",
        //     university_name: "Singapore Management University"
        // }
    ])
}
