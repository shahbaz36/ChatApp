import { useContext, useState } from "react";
import styles from "./Mychats.module.css";
import { Plus } from "lucide-react";
import { ChatContext } from "../../Context/ChatContext";
import { useParams } from "react-router-dom";

import SingleChat from "../SingleChat/SingleChat";
import CreateGroup from "../CreateGroup/CreateGroup";
import SingleGroupChat from "../SingleGroupChat/SingleGroupChat";

function Mychats() {
  const { chats, isLoading } = useContext(ChatContext);
  const { id } = useParams();
  const { user } = useContext(ChatContext);

  const [isVisible, setIsVisible] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.myChats}>
      <div className={styles.myNav}>
        <h2>My Chats</h2>
        <button onClick={() => setIsVisible(true)}>
          <p>New Group Chat</p> <Plus className={styles.plus} size={18} />
        </button>
      </div>
      <div className={styles.chatContainer}>
        {chats.map((chat) =>
          chat.isGroupChat ? (
            <SingleGroupChat
              chat={chat}
              isActive={id === chat._id}
              key={chat._id}
              user={user}
            />
          ) : (
            <SingleChat
              chat={chat}
              isActive={id === chat.users[1]?._id}
              key={chat._id}
              user={user}
            />
          )
        )}
      </div>
      {isVisible && <CreateGroup setIsVisible={setIsVisible} />}
    </div>
  );
}

export default Mychats;
