/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async (knex) => {
    return knex('review').insert([
        {
            user_email: 'jared@admin.com', // jared@admin.com
            university_name: 'Singapore Management University', // SMU
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: 'Love it my favourite university'
        },
        {
            user_email: 'jared@notadmin.com', // jared@notadmin.com
            university_name: 'Singapore Management University', // NUS
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: 'I know nothing about NUS'
        },
        {
            university_name: "Singapore Management University",
            user_email: "alice@studentsworld.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I had a great time at SMU. The campus is beautiful, and the professors are very knowledgeable. I would highly recommend it."
        },
        {
            university_name: "Singapore Management University",
            user_email: "bob@collegelife.net",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "SMU provided a fantastic learning environment. The small class sizes allowed for personalized attention, and the extracurricular activities were a lot of fun."
        },
        {
            university_name: "Singapore Management University",
            user_email: "charlie@educationhub.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "My experience at SMU was amazing. The business programs are top-notch, and the networking opportunities are invaluable for future success."
        },
        {
            university_name: "Singapore Management University",
            user_email: "daniel@adventurouslearner.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "NUS is an excellent institution. The courses are diverse, and the faculty is top-notch. I enjoyed my time there and made lifelong friends."
        },
        {
            university_name: "Singapore Management University",
            user_email: "emily@globetrotter.edu",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "NUS has a beautiful campus and a vibrant student community. The research opportunities are outstanding, and the global perspective I gained was priceless."
        },
        {
            university_name: "Singapore Management University",
            user_email: "frank@knowledgeseeker.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Studying at NUS was a life-changing experience. The professors were supportive, and I had the chance to collaborate with students from all over the world."
        },
        {
            university_name: "Singapore Management University",
            user_email: "grace@africaexplorer.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Test Africa is an unknown entity to me, but I hope it can offer educational and cultural enrichment opportunities for students interested in the African continent."
        },
        {
            university_name: "Singapore Management University",
            user_email: "henry@adventuresinAfrica.net",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I'm not familiar with Test Africa, but I'm curious to explore the diverse cultures and landscapes of Africa through its educational programs."
        },
        {
            university_name: "Singapore Management University",
            user_email: "isabella@studyinafrica.org",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I've heard about Test Africa, and I'm eager to learn more about its academic offerings and the chance to discover the beauty and history of Africa."
        },
        {
            university_name: "Singapore Management University",
            user_email: "jackson@europeanexperience.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Test Europe sounds intriguing. I would love to study in Europe and experience its diverse cultures, languages, and rich history."
        },
        {
            university_name: "Singapore Management University",
            user_email: "karen@euroadventures.net",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I'm excited to explore Test Europe. Studying in Europe offers a unique opportunity to gain international experience and broaden one's horizons."
        },
        {
            university_name: "Singapore Management University",
            user_email: "leo@europelearner.org",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Test Europe is on my radar. I've always wanted to immerse myself in European culture, and this could be a great opportunity to do so."
        },
        {
            university_name: "Singapore Management University",
            user_email: "mia@northamericanstudies.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I'm not familiar with Test NA, but I'm excited to discover what educational opportunities it offers in North America."
        },
        {
            university_name: "Singapore Management University",
            user_email: "nathan@learninNA.net",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Test NA is a new name to me, and I'm curious to learn more about the educational landscape in North America."
        },
        {
            university_name: "Singapore Management University",
            user_email: "olivia@naeducationexplorer.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "North America is a diverse and dynamic region. I'm looking forward to exploring educational options within Test NA."
        },
        {
            university_name: "Singapore Management University",
            user_email: "peter@southamericadreams.com",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "Test SA is a new name to me, but I'm eager to explore higher education options in South America and its beautiful landscapes."
        },
        {
            university_name: "Singapore Management University",
            user_email: "quinn@exploreSA.org",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "South America has always fascinated me, and Test SA seems like a gateway to discovering the vibrant culture and natural wonders of the continent."
        },
        {
            university_name: "Singapore Management University",
            user_email: "rachel@saexplorer.net",
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            review_text: "I've heard about Test SA, and I'm excited to explore academic possibilities in South America and experience its unique charm."
        }
    ])
}
