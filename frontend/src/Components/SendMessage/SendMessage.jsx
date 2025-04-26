import { useEffect, useState } from "react";
import styles from "./SendMessage.module.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import ErrorPopup from "../Error/Error";

function SendMessage({ selectedChat, setMessages, messages }) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendingError, setSendingError] = useState(null);
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["jwt"]);

  const handleTyping = (e) => setMessage(e.target.value);

  const handleSendMessage = async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!message.trim()) {
      setSendingError("Can't send empty messages");
      return;
    }

    try {
      setIsSendingMessage(true);
      setSendingError(null);

      const token = cookies.jwt;
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:3030/api/v1/messages/`,
        { content: message.trim(), chatId: selectedChat._id },
        config
      );

      if (data?.status !== "success")
        throw new Error("Problem while sending message");

      setMessages([...messages, data.data]);

      setMessage("");
      // console.log(messages); //React state updates are asynchronous!!
    } catch (error) {
      setSendingError(error.message || "An error occurred");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // useEffect(() => {
  //   console.log("Updated messages:", messages);
  // }, [messages]);

  return (
    <>
      <form className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={handleSendMessage}
          disabled={isSendingMessage}
        />
      </form>
      {sendingError && <ErrorPopup message={sendingError} />}
    </>
  );
}

export default SendMessage;
