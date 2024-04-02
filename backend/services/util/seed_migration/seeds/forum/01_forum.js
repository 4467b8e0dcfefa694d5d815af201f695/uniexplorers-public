/**
 * Seeds a sample conversation between two students in the uni_forum_thread
 * and uni_forum_comment tables.
 */

exports.seed = async function(knex) {
    // Deletes ALL existing entries for a clean start
    await knex('comment_likes').del()
    await knex('comment_dislikes').del()
    await knex('uni_forum_comment').del()
    await knex('uni_forum_thread').del()

    // Inserts seed entries for a thread
    const [threadIdResult] = await knex('uni_forum_thread').insert({
        university_name: 'University of Example',
        user_email: 'student1@example.edu',
        forum_title: 'Introduction to Machine Learning',
        forum_text: 'Welcome to the Introduction to Machine Learning forum! Feel free to share resources, ask questions, and discuss topics.',
        forum_text_raw: 'Welcome to the Introduction to Machine Learning forum! Feel free to share resources, ask questions, and discuss topics.',
    }, 'id')

    const threadId = threadIdResult.id

    // Inserts initial comments by two students
    const [comment1IdResult] = await knex('uni_forum_comment').insert({
        user_email: 'student1@example.edu',
        thread_id: threadId,
        comment_text: 'I found this great resource on gradient descent. Has anyone else read it?',
        comment_text_raw: 'I found this great resource on gradient descent. Has anyone else read it?',
    }, 'id')

    const comment1Id = comment1IdResult.id

    const [comment2IdResult] = await knex('uni_forum_comment').insert({
        user_email: 'student2@example.edu',
        thread_id: threadId,
        comment_text: 'Does anyone have tips for understanding bias-variance tradeoff?',
        comment_text_raw: 'Does anyone have tips for understanding bias-variance tradeoff?',
    }, 'id')

    const comment2Id = comment2IdResult.id

    // Inserts nested comments (replies) to the initial comments
    await knex('uni_forum_comment').insert([
        {
        user_email: 'student2@example.edu',
        thread_id: threadId,
        parent_id: comment1Id,
        comment_text: 'Yes, I have! It’s a fantastic read. Really clarifies a lot of concepts.',
        comment_text_raw: 'Yes, I have! It’s a fantastic read. Really clarifies a lot of concepts.',
        },
        {
        user_email: 'student1@example.edu',
        thread_id: threadId,
        parent_id: comment2Id,
        comment_text: 'I struggled with that too. Found a lecture series on YouTube that helped.',
        comment_text_raw: 'I struggled with that too. Found a lecture series on YouTube that helped.',
        }
    ])

    // Optionally, add likes or dislikes to comments
    // Assuming you want to demonstrate the trigger functionalities.
    await knex('comment_likes').insert([
        { user_email: 'student3@example.edu', comment_id: comment1Id },
        { user_email: 'student4@example.edu', comment_id: comment2Id }
    ])

    await knex('comment_dislikes').insert([
        { user_email: 'student5@example.edu', comment_id: comment1Id }
    ])
  }
  