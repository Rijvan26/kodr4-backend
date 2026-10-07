const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const PORT = 3000;

// Express middleware
app.use(express.json());

// Normal HTTP route
app.get("/", (req, res) => {
  res.json({
    message: "Express server is running",
  });
});

// Create HTTP server using Express app
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection
wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  // Send message to newly connected client
  socket.send(
    JSON.stringify({
      type: "welcome",
      message: "Welcome to WebSocket server",
    })
  );

  // Receive message from client
  socket.on("message", (message) => {
    const data = message.toString();

    console.log("Client:", data);

    // Send response back to client
    socket.send(
      JSON.stringify({
        type: "message",
        message: `Server received: ${data}`,
      })
    );
  });

  // Client disconnected
  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  // Error
  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});