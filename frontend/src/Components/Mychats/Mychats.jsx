import { useContext } from "react";
import styles from "./Mychats.module.css";
import { Plus } from "lucide-react";
import { ChatContext } from "../../Context/ChatContext";
import { NavLink, useParams } from "react-router-dom";

function Mychats() {
  const { chats, isLoading } = useContext(ChatContext);
  const { id } = useParams();
  return (
    <div className={styles.myChats}>
      <div className={styles.myNav}>
        <h2>My Chats</h2>
        <button>
          <p>New Group Chat</p> <Plus className={styles.plus} size={18} />
        </button>
      </div>
      <div className={styles.chatContainer}>
        {isLoading
          ? "Please wait while loading your chats"
          : chats.map((chat) => (
              <SingleChat
                chat={chat}
                isActive={id === chat.users[1]._id}
                key={chat._id}
              />
            ))}
      </div>
    </div>
  );
}

function SingleChat({ chat, isActive }) {
  return (
    <NavLink
      className={`${styles.chat}  ${isActive ? styles.active : ""}`}
      to={`/chats/${chat.users[1]._id}`}
      key={chat._id}
    >
      {chat.latestMessage ? (
        <>
          <img src={chat.users[1].pic} alt="" />
          <h3>{chat.users[1].name} </h3>
          <p className={styles.author}>{chat.latestMessage}</p> <p>Message</p>
        </>
      ) : (
        <>
          <img src={chat.users[1].pic} alt="" />
          <div>
            <h3>{chat.users[1].name} </h3>
            <p className={styles.author}>Author :</p> <p>Message</p>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default Mychats;
