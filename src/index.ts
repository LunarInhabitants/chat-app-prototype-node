import express, { request, response } from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

const httpServer = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server: httpServer });

interface ChatRequest {
  type: string;
  content: string;
}

let chatMessages: Array<string> = [];

webSocketServer.on("connection", (webSocket: WebSocket) => {
  webSocket.onmessage = function (event) {
    const chatRequest: ChatRequest = JSON.parse(event.data.toString());
    if (chatRequest.type === "createMessage") {
      chatMessages.push(chatRequest.content);
      webSocketServer.clients.forEach((client) =>
        client.send(chatRequest.content)
      );
    }
    console.log(`received: ${event.data}`);
    console.log(chatMessages);
  };
  console.log("New connection");
  console.log(chatMessages);

  webSocket.send(JSON.stringify(chatMessages));
});

httpServer.listen(8080, () => {
  console.log(`Server started.`);
});

app.get("/", (req, res) => {
  res.send("Standard http endpoint");
});

app.get("/messages", (request, response) => {
  response.send(chatMessages);
});
