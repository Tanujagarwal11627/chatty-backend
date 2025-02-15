const { Server } = require("socket.io");
const strapi = require("@strapi/strapi");

console.log("Starting WebSocket server...");

const io = new Server(7000, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", async (data) => {
    console.log("Message received:", data);

    const newMessage = await strapi.db.query("api::chat-message.chat-message").create({
      data: {
        content: data.text,
        userId: data.userId,
      },
    });

    io.emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.listen(7000);
console.log("WebSocket server is running on port 7000");