import { NavLink } from "react-router-dom";
import styles from "./SingleChat.module.css";

function SingleChat({ chat, isActive }) {
  return (
    <NavLink
      className={`${styles.chat}  ${isActive ? styles.active : ""}`}
      to={`/chats/${chat.users[1]?._id}`}
      key={chat._id}
    >
      {chat.latestMessage ? (
        <>
          <img src={chat.users[1]?.pic} alt="" />
          <div>
            <h3>{chat.users[1]?.name} </h3>
            <p className={styles.author}>{chat.latestMessage.sender.name}</p>
            {" :"}
            <p>{chat.latestMessage.content}</p>
          </div>
        </>
      ) : (
        <>
          <img src={chat.users[1]?.pic} alt="" />
          <div>
            <h3>{chat.users[1]?.name} </h3>
            <p className={styles.author}>Author :</p> <p>Message</p>
          </div>
        </>
      )}
    </NavLink>
  );
}
export default SingleChat;
