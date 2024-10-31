import styles from "./Conversation.module.css";

import { useAccessChat } from "../../hooks/useChat";
import { useParams } from "react-router-dom";
import ErrorPopup from "../Error/Error";
import { Eye } from "lucide-react";
import { useContext } from "react";

import { ChatContext } from "../../Context/ChatContext";

function Conversation() {
  const { id } = useParams();
  const [isAccessingChat, selectedChat, error] = useAccessChat(id);

  if (!id) {
    return (
      <div className={styles.landing}>
        Click on a User to start Conversation
      </div>
    );
  }

  return isAccessingChat === true ? (
    <div className={styles.landing}>Click on a User to start Conversation</div>
  ) : (
    <>
      {selectedChat && <SelectedChat selectedChat={selectedChat} />}
      {error && (
        <ErrorPopup message={"Please select a user to start conversation"} />
      )}
    </>
  );
}

function SelectedChat({ selectedChat }) {
  const { user } = useContext(ChatContext);

  const getSender = (users) => {
    return user._id === users[0]._id ? users[1] : users[0];
  };

  return (
    <div className={styles.conv}>
      <div className={styles.myNav}>
        <h2>
          {selectedChat.isGroupChat
            ? selectedChat.chatName
            : getSender(selectedChat.users).name}
        </h2>
        <button>
          <Eye size={25} />
        </button>
      </div>
      <div className={styles.chat}>
        <div className={styles.inputWrapper}>
          <input type="text" placeholder="Enter a message..." />
        </div>
      </div>
    </div>
  );
}

export default Conversation;
