import { useContext } from "react";
import styles from "./ScrollableChat.module.css";
import { ChatContext } from "../../Context/ChatContext";

function ScrollableChat({ messages }) {
  const { user } = useContext(ChatContext);

  function getSender(sender) {
    return user._id === sender._id ? true : false;
  }

  console.log(messages);
  return (
    <div className={styles.allMsg}>
      {messages.map((msg) => (
        <p
          className={`${
            getSender(msg.sender) ? styles.msgRight : styles.msgLeft
          } ${styles.msgCommon}`}
          key={msg._id}
        >
          {msg.content}
        </p>
      ))}
    </div>
  );
}

export default ScrollableChat;
