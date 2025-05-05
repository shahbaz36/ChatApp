import { NavLink } from "react-router-dom";
import styles from "./SingleChat.module.css";

function SingleChat({ chat, isActive, user }) {
  const getSender = (users) => {
    return user._id === users[0]._id ? users[1] : users[0];
  };

  function displayMsg(msg) {
    return msg.length > 15 ? msg.slice(0, 10) + "..." : msg;
  }

  return (
    <NavLink
      className={`${styles.chat}  ${isActive ? styles.active : ""}`}
      to={`/chats/${getSender(chat.users)?._id}`}
      key={chat._id}
    >
      {chat.latestMessage ? (
        <>
          <img src={getSender(chat.users)?.pic} alt="" />
          <div>
            <h3>{getSender(chat.users)?.name} </h3>
            <p className={styles.author}>{chat.latestMessage.sender?.name}</p>
            {" :"}
            <p>{displayMsg(chat.latestMessage.content)}</p>
          </div>
        </>
      ) : (
        <>
          <img src={getSender(chat.users)?.pic} alt="" />
          <div>
            <h3>{getSender(chat.users)?.name} </h3>
            <p className={styles.author}>Author :</p> <p>Message</p>
          </div>
        </>
      )}
    </NavLink>
  );
}
export default SingleChat;
