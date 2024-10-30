import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const useAccessChat = (id) => {
  const [isAccessingChat, setIsAcessingChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState();

  const [cookies] = useCookies(["jwt"]);

  useEffect(
    function () {
      const fetchAccessChat = async () => {
        try {
          setIsAcessingChat(true);
          setError();

          const token = cookies.jwt;

          if (!token) throw new Error("Unauthorized");

          const config = {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.post(
            "/api/v1/chats",
            { userId: id },
            config
          );

          setSelectedChat(response.data.data.chat);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsAcessingChat(false);
        }
      };
      fetchAccessChat();
    },
    [id, cookies.jwt]
  );

  return [isAccessingChat, selectedChat, error];
};
