import { useContext } from "react";
import styles from "./Mychats.module.css";
import { Plus } from "lucide-react";
import { ChatContext } from "../../Context/ChatContext";

function Mychats() {
  const { chat } = useContext(ChatContext);

  return (
    <div className={styles.myChats}>
      <div className={styles.myNav}>
        <h2>My Chats</h2>
        <button>
          <p>New Group Chat</p> <Plus className={styles.plus} size={18} />
        </button>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chat}>
          <h3>John Doe </h3>
          <p className={styles.author}>Author :</p> <p>Message</p>
        </div>
        <div className={styles.chat}>
          <h3>John Doe </h3>
          <p className={styles.author}>Author :</p> <p>Message</p>
        </div>
        <div className={styles.chat}>
          <h3>John Doe </h3>
          <p className={styles.author}>Author :</p> <p>Message</p>
        </div>
        <div className={styles.chat}>
          <h3>John Doe </h3>
          <p className={styles.author}>Author :</p> <p>Message</p>
        </div>
        <div className={styles.chat}>
          <h3>John Doe </h3>
          <p className={styles.author}>Author :</p> <p>Message</p>
        </div>
      </div>
    </div>
  );
}

export default Mychats;
