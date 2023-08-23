import { useState, useEffect } from "react";
import { io, Socket as SocketType } from "socket.io-client";
console.log(import.meta.env.VITE_BASE_URL);
interface Message {
  _id: string;
  timestamp: string;
  message: string;
}

let socket: SocketType;

export default function SocketComponent() {
  const [allMessages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null); // Track the message to delete

  useEffect(() => {
    socket = io();
    // listen to the socket to receive all messages
    socket.on("messages", (receivedMessages: Message[]) => {
      setMessages(receivedMessages);
    });
    // listen to the socket for a new message

    socket.on("message", (receivedMessages: Message) => {
      // refresh the state by adding our new message
      console.log("adding new message");
      console.log(receivedMessages);
      setMessages((prevMessages) => [...prevMessages, receivedMessages]);
    });
    // Clean up the socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleDelete = (messageId: string) => {
    setMessageToDelete(messageId); // Set the message to delete
    socket.emit("message-delete", { _id: messageId });
    console.log(messageId);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        timestamp: new Date().toISOString(),
        message: newMessage,
      };

      // Emit the new message to the server
      socket.emit("message", newMessageObj);

      // Clear the input after sending the message
      setNewMessage("");
    }
  };

  return (
    <div>
      <ul>
        {allMessages.map((message, index) => (
          <li key={index}>
            <button onClick={() => handleDelete(message._id)}>delete</button>
            {message.timestamp} - {message.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a new message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
