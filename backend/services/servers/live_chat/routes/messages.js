const mongo = require("mongodb");
const { ObjectId } = require("mongodb");

const { CHAT_DB_USERNAME, CHAT_DB_PASSWORD, CHAT_DB_DATABASE, CHAT_DB_HOST } =
  process.env;

// const uri = ``
const uri = `mongodb+srv://${CHAT_DB_USERNAME}:${CHAT_DB_PASSWORD}@${CHAT_DB_HOST}/${CHAT_DB_DATABASE}?authSource=admin`;
const client = new mongo.MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
connectToMongoDB();

module.exports = (app) => {
  app.route("/messages").get(async (req, res) => {
    try {
      const id = req.query.room_id;

      const database = client.db(CHAT_DB_DATABASE);
      const messagesCollection = database.collection("Messages");

      const messages = await messagesCollection
        .find({
          roomId: id,
        })
        .toArray();
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
