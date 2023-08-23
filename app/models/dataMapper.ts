import client from "./mongo-client.js";
import Debug from "debug";
import { ObjectId } from "mongodb";
const debug = Debug("app:models:dataMapper");
interface Message {
  _id?: ObjectId | undefined;
  timestamp: string;
  message: string;
}

export const dataMapper = {
  async getAll() {
    debug("getAll");
    const data = await client.find().toArray();
    return data;
  },
  async insertOne(data: Message) {
    debug("insertOne");
    await client.insertOne(data);
    return true;
  },
  async deleteOne(data: Message) {
    debug("deleteOne");
    debug(data);
    const objectId = new ObjectId(data._id); // Construct ObjectId
    await client.deleteOne({ _id: objectId });
  },
};
