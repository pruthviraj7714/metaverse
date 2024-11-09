import { WebSocketServer, WebSocket } from "ws";
import { User } from "./UserManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  const user = new User(ws);

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    user.destroy();
  });

  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Hi there! Welcome to the server.",
    })
  );
});

console.log("websocket server is running...")