import { useEffect } from "react";
import "./App.css";
import SocketComponent from "./components/Socket"; // Update the path

function App() {
  useEffect(() => {
    // initializeSocket(); // No need to call this here
  }, []);

  return (
    <>
      {/* Render the SocketComponent */}
      <SocketComponent />
    </>
  );
}

export default App;
