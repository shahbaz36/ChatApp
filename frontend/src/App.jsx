import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Home/Homepage";
import Chatpage from "./Pages/Chat/Chatpage";
import { CookiesProvider } from "react-cookie";
import { ChatProvider } from "./Context/ChatContext";

function App() {
  return (
    <CookiesProvider>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </ChatProvider>
    </CookiesProvider>
  );
}

export default App;
