import styles from "./Conversation.module.css";

import { useAccessChat } from "../../hooks/useChat";
import { useParams } from "react-router-dom";
import ErrorPopup from "../Error/Error";
import { Eye } from "lucide-react";
import { useContext, useState } from "react";

import { ChatContext } from "../../Context/ChatContext";
import Profile from "../Profile/Profile";
import GroupChatProfile from "../GroupChatProfile/GroupChatProfile";
import { useCookies } from "react-cookie";
import axios from "axios";

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
  const [messages, setMessages] = useState(null);

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
        <Messages selectedChat={selectedChat} setMessages={setMessages} />
        <SendMessage
          selectedChat={selectedChat}
          setMessages={setMessages}
          messages={messages}
        />
      </div>
    </div>
  );
}

function SendMessage({ selectedChat, setMessages, messages }) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendingError, setSendingError] = useState(null);
  const [message, setMessage] = useState(null);

  const [cookies] = useCookies(["jwt"]);

  function handleTyping(e) {
    setMessage(e.target.value);
  }

  async function handleSendMessage(e) {
    if (e.key === "Enter" && message) {
      try {
        e.preventDefault();
        setIsSendingMessage(true);
        setSendingError(false);

        const token = cookies.jwt;

        const config = {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `http://localhost:3030/api/v1/messages/`,
          { content: message, chatId: selectedChat._id },
          config
        );
        setMessage("");

        if (response?.status !== 201)
          throw new Error("Problem while sending message");
        console.log(response);
        setMessages([...messages, response.data.data]);
      } catch (error) {
        setSendingError(error.message);
      } finally {
        setIsSendingMessage(false);
      }
    }
  }

  return (
    <>
      <form className={styles.inputWrapper} onKeyDown={handleSendMessage}>
        <input
          type="text"
          placeholder="Enter a message..."
          onChange={handleTyping}
        />
      </form>
    </>
  );
}

function Messages({ selectedChat, setMessages }) {
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const [cookies] = useCookies(["jwt"]);

  async function fetchAllChats() {
    try {
      setIsLoadingMessages(true);
      setError(null);

      const token = cookies.jwt;

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:3030/api/v1/messages/${selectedChat._id}`,
        config
      );

      if (response?.status !== 200)
        throw new Error("Problem while fetching messages ");

      setMessages(response.data.data.messages);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  return (
    <>
      <div>Messages</div>
    </>
  );
}

export default Conversation;
