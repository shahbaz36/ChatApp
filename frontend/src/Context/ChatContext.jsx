import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../Components/Error/Error";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const [cookies] = useCookies(["jwt"]);

  useEffect(
    function () {
      async function getUserAndChatData() {
        setError(null);
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
          console.log(response);
          if (response.status === 200) {
            setIsAuth(true);
          }

          setUser(response.data.data.user);
          setChats(response.data.data.result);
          setRefresh(false);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getUserAndChatData();
    },
    [navigate, cookies.jwt, isAuth, refresh]
  );

  return (
    <ChatContext.Provider
      value={{
        user,
        chats,
        error,
        setError,
        isLoading,
        isAuth,
        setRefresh,
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
