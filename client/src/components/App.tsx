import { useEffect } from "react";
import SocketComponent from "./Socket"; // Update the path

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
