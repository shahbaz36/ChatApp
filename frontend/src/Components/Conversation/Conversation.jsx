import styles from "./Conversation.module.css";

import { useAccessChat } from "../../hooks/useChat";
import { useParams } from "react-router-dom";
import ErrorPopup from "../Error/Error";
import { Eye } from "lucide-react";
import { useContext, useState } from "react";

import { ChatContext } from "../../Context/ChatContext";
import Profile from "../Profile/Profile";
import GroupChatProfile from "../GroupChatProfile/GroupChatProfile";

function Conversation() {
  const { id } = useParams();
  const [isAccessingChat, selectedChat, setSelectedChat, error] =
    useAccessChat(id);
  const { user } = useContext(ChatContext);

  if (!id) {
    return (
      <div className={styles.landing}>
        Click on a User to start Conversation
      </div>
    );
  }

  return isAccessingChat === true ? (
    <div className={styles.landing}>Wait while loading your conversation</div>
  ) : (
    <>
      {selectedChat && (
        <SelectedChat
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          user={user}
        />
      )}
      {error && (
        <ErrorPopup message={"Please select a user to start conversation"} />
      )}
    </>
  );
}

function SelectedChat({ selectedChat, user, setSelectedChat }) {
  const [isVisible, setIsVisible] = useState(false);

  const getSender = (users) => {
    return user._id === users[0]._id ? users[1] : users[0];
  };

  return (
    <div className={styles.conv}>
      <div className={styles.myNav}>
        <h2>
          {selectedChat.isGroupChat
            ? selectedChat.chatName
            : getSender(selectedChat.users)?.name}
        </h2>
        <button onClick={setIsVisible} className={styles.navBtn}>
          <Eye size={25} />
        </button>
        {isVisible &&
          (selectedChat.isGroupChat ? (
            <GroupChatProfile
              groupChat={selectedChat}
              setShowProfile={setIsVisible}
              setSelectedChat={setSelectedChat}
            />
          ) : (
            <Profile
              user={getSender(selectedChat.users)}
              setShowProfile={setIsVisible}
            />
          ))}
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
