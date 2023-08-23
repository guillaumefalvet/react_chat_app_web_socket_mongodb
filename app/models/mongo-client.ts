import { MongoClient } from "mongodb";
import Debug from "debug";
const debug = Debug("app:models:mongo-client");
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
debug("client connected");
client.connect();
export default client.db("message_app").collection("messages");
