import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../Components/Error/Error";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chat, setChat] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const [cookies] = useCookies(["jwt"]);

  useEffect(
    function () {
      async function getUserAndChatData() {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${cookies.jwt}`,
            },
          };
          const response = await axios.get("/api/v1/chats", config);

          // console.log(response.data.data.user);
          setUser(response.data.data.user);
          setChat(response.data.data.chatData);
        } catch (error) {
          setError(error);
        }
      }
      getUserAndChatData();
    },
    [navigate]
  );

  return (
    <ChatContext.Provider value={{ user, chat, error, setError }}>
      {children}
      {error && error.response.data.message === "jwt malformed" && (
        <ErrorPopup message={"Please login to use the App"} />
      )}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
