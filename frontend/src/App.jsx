import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { ChatProvider } from "./Context/ChatContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import React, { Suspense } from "react";

// Lazy load components
const Homepage = React.lazy(() => import("./Pages/Home/Homepage"));
const Chatpage = React.lazy(() => import("./Pages/Chat/Chatpage"));

function App() {
  return (
    <CookiesProvider>
      <ChatProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Chatpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats/:id"
              element={
                <ProtectedRoute>
                  <Chatpage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ChatProvider>
    </CookiesProvider>
  );
}

export default App;
