import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Home/Homepage";
import Chatpage from "./Pages/Chat/Chatpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chats" element={<Chatpage />} />
    </Routes>
  );
}

export default App;
