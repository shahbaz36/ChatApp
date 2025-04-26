import styles from "./Messages.module.css";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import ScrollableChat from "../ScrollableChat/ScrollableChat";

function Messages({ selectedChat, setMessages, messages }) {
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [error, setError] = useState(null);

  const [cookies] = useCookies(["jwt"]);

  async function fetchAllMessages() {
    try {
      setIsLoadingMessages(true);
      setError(null);

      const token = cookies.jwt;

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:3030/api/v1/messages/${selectedChat._id}`,
        config
      );

      if (response?.status !== 200)
        throw new Error("Problem while fetching messages ");

      setMessages(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return (
    <div className={styles.msgBox}>
      {isLoadingMessages ? <Spinner /> : <ScrollableChat messages={messages} />}
    </div>
  );
}
export default Messages;
