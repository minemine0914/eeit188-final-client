import { WebSocket, WebSocketServer } from "ws";

// Store clients in a map with user IDs
const clients = new Map();

const wss = new WebSocketServer({ port: 3002 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "register") {
        // 註冊用戶 ID 與 WebSocket
        clients.set(data.userId, ws);
        console.log(`User ${data.userId} registered`);
      } else if (data.type === "private_message") {
        // 發送私人訊息
        const recipientSocket = clients.get(data.receiverId);
        if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
          recipientSocket.send(
            JSON.stringify({
              chat: data.chat,
              senderId: data.senderId,
              sender: data.sender,
              receiverId: data.receiverId,
              senderAvatar: data.senderAvatar,
              createdAt: data.createdAt,
            })
          );
          console.log("Message sent to:", data.receiverId);
        } else {
          console.log(
            `User ${data.receiverId} not connected or WebSocket closed.`
          );
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8081");
