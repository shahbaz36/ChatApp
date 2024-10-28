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
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  const [cookies] = useCookies(["jwt"]);

  useEffect(
    function () {
      async function getUserAndChatData() {
        try {
          setIsLoading(true);

          const token = cookies.jwt;

          if (!token) throw new Error("Unauthorized");

          const config = {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${cookies.jwt}`,
            },
          };

          const response = await axios.get("/api/v1/chats", config);

          if (response.status === 200) {
            setIsAuth(true);
          }
          // console.log(response.data.data.user);
          setUser(response.data.data.user);
          setChat(response.data.data.result);
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      }
      getUserAndChatData();
    },
    [navigate, cookies.jwt, isAuth]
  );

  return (
    <ChatContext.Provider
      value={{
        user,
        chat,
        error,
        setError,
        isLoading,
        isAuth,
      }}
    >
      {children}
      {error === "Unauthorized" && (
        <ErrorPopup message={"Please login to use the App"} />
      )}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
