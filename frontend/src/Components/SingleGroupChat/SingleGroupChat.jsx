import { NavLink } from "react-router-dom";
import styles from "./SingleGroupChat.module.css";

function SingleGroupChat({ chat, isActive }) {
  return (
    <NavLink
      className={`${styles.chat}  ${isActive ? styles.active : ""}`}
      to={`/chats/${chat._id}`}
      key={chat._id}
    >
      {chat.latestMessage ? (
        <>
          <h3>{chat.chatName} </h3>
          <p className={styles.author}>{chat.latestMessage}</p> <p>Message</p>
        </>
      ) : (
        <>
          <div>
            <h3>{chat.chatName} </h3>
            <p className={styles.author}>Author :</p> <p>Message</p>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default SingleGroupChat;
