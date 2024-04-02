/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
    return knex("user_interest").insert([
        {
            "user_email": "everything@mail.com",
            "interest_id": 1
        },
        {
            "user_email": "everything@mail.com",
            "interest_id": 2
        },
        {
            "user_email": "everything@mail.com",
            "interest_id": 3
        },
        {
            "user_email": "everything@mail.com",
            "interest_id": 4
        },
        {
            "user_email": "everything@mail.com",
            "interest_id": 5
        },
        {
            "user_email": "everything@mail.com",
            "interest_id": 6
        },
        {
            "user_email": "test@mail.com",
            "interest_id": 4
        },
        {
            "user_email": "test@mail.com",
            "interest_id": 5
        },
        {
            "user_email": "test@mail.com",
            "interest_id": 6
        },
    ])
}
