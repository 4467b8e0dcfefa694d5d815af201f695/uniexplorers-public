require("dotenv").config({ path: "../../server.env" });

// const SERVER_PORT = 3500;
// const { ORIGIN } = process.env;
const { SERVER_PORT, ORIGIN } = process.env;

const mongo = require("mongodb");

const { CHAT_DB_USERNAME, CHAT_DB_PASSWORD, CHAT_DB_DATABASE, CHAT_DB_HOST } =
  process.env;
// console.log(CHAT_DB_HOST)
// const uri = ``
// 
const uri = `mongodb+srv://${CHAT_DB_USERNAME}:${CHAT_DB_PASSWORD}@${CHAT_DB_HOST}/${CHAT_DB_DATABASE}?authSource=admin`;
// console.log(uri);
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

const { Server } = require("socket.io");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./routes")(app);
const expressServer = app.listen(
  SERVER_PORT,
  console.log(`Server is running on port ${SERVER_PORT}`)
);

const io = new Server(expressServer, {
  cors: {
    origin: ORIGIN,
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  console.log("socket room:", socket.rooms);
  console.log(io.engine.clientsCount);

  // Upon connection - only to user

  socket.on("enterRoom", async ({ user, other_user }) => {
    const room = await activateUser(user, other_user);
    const message = await buildMsg(room.roomId, user, "Room Created");
    // socket.join("yfseet");
    // socket.to(room.roomId).emit("roomCreated", room, message);
    console.log(socket.rooms);
    io.emit("roomCreated", room, message);
    // socket.emit("roomCreated", room, message);
  });

  // Listening for a message event
  socket.on("message", async ({ roomId, from, text }) => {
    const message = await buildMsg(roomId, from, text);
    io.emit("messageSent", message);
    // socket.emit("messageSent", message);
  });

  // Listen for activity
  socket.on("typing", ({ user, roomId }) => {
    socket.broadcast.to(roomId).emit("handleTyping", user);
    io.emit("handleTyping", user);
  });

  // Listen for disconnect
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnect`);
  });
});

async function buildMsg(roomId, from, text) {
  const database = client.db(CHAT_DB_DATABASE);
  const messagesCollection = database.collection("Messages");
  const sentTime = new Date();
  const message = {
    roomId,
    from,
    text,
    time: sentTime,
  };
  try {
    await messagesCollection.insertOne(message);
    console.log(`Inserted message with text: ${text}`);
    return message; // Return the inserted message ID
  } catch (error) {
    console.error("Error inserting message:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// User functions
async function activateUser(user, otherUser) {
  const data = {
    participants: [user, otherUser],
  };
  const database = client.db(CHAT_DB_DATABASE);
  const UserRoomMapping = database.collection("UserRoomMapping");

  console.log("trying to activate user");
  try {
    const result = await UserRoomMapping.insertOne(data);
    console.log("successfully added room");
    return { ...data, roomId: result.insertedId.toString() };
  } catch (error) {
    console.log("Error in adding room:", error);
  }
}

async function getUser(email, callback) {
  try {
    const database = client.db(CHAT_DB_DATABASE);
    const UserRoomMapping = database.collection("UserRoomMapping");

    const user = await UserRoomMapping.findOne({ "participants.email": email });
    callback(user); // Call the callback with the user data
  } catch (error) {
    console.error("Error finding user:", error);
    callback(null); // Call the callback with null to indicate an error
  }
}

async function setNewMessage(roomId, text, time) {
  const database = client.db(CHAT_DB_DATABASE);
  const UserRoomMapping = database.collection("UserRoomMapping");
  try {
    const result = await UserRoomMapping.updateOne(
      { _id: roomId }, // Match the room by _id
      { $set: { latestMessage: text, date: time } } // Update the latest message and date
    );
    console.log("Updated latest message for room:", roomId);
  } catch (error) {
    console.error("Error updating latest message in room:", roomId, error);
  }
}
