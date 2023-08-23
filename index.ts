import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Debug from "debug";
import cors from "cors";
import { dataMapper } from "./app/models/dataMapper.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { ObjectId } from "mongodb";

const debug = Debug("app:server");
dotenv.config();
const port = process.env.PORT;
const app: Express = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("client/dist"));
interface Message {
  _id?: ObjectId | undefined;
  timestamp: string;
  message: string;
}
io.on("connection", async (socket) => {
  debug("Une connexion au serveur websocket a été ouverte");
  const allMessages = await dataMapper.getAll();
  socket.emit("messages", allMessages);
  socket.on("message", async (message: Message) => {
    debug(`${message.timestamp} : ${message.message}`);
    await dataMapper.insertOne(message);
    io.emit("message", message); // Émettre le message à tous les clients
  });
  socket.on("disconnect", () => {
    debug("🔥: A user disconnected");
  });
  socket.on("message-delete", async (message: Message) => {
    await dataMapper.deleteOne(message);
    const allMessages = await dataMapper.getAll();
    io.emit("messages", allMessages); // Emit to all clients
  });
});

server.listen(port, () => {
  debug(`⚡️ Listening at http://localhost:${port}`);
});
