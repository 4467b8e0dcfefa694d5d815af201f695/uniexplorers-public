const mongo = require("mongodb");

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
  app.route("/rooms").get(async (req, res) => {
    try {
      const email = req.query.email;
      const database = client.db(CHAT_DB_DATABASE);
      const UserRoomMapping = database.collection("UserRoomMapping");

      const rooms = await UserRoomMapping.find({
        "participants.email": email,
      }).toArray();

      return res.status(200).json({ rooms });
    } catch (error) {
      console.error("Error finding active rooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app.route("/room").get(async (req, res) => {
    try {
      const { email1, email2 } = req.query;
      const database = client.db(CHAT_DB_DATABASE);
      const UserRoomMapping = database.collection("UserRoomMapping");

      const room = await UserRoomMapping.find({
        "participants.email": {$all: [email1, email2]},
      });

      return res.status(200).json({ room });
    } catch (error) {
      console.error("Error finding user's room:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
