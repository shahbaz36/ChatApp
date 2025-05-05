import styles from "./Conversation.module.css";

import { useAccessChat } from "../../hooks/useChat";
import { useParams } from "react-router-dom";
import ErrorPopup from "../Error/Error";
import { Eye } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { ChatContext } from "../../Context/ChatContext";
import Profile from "../Profile/Profile";
import GroupChatProfile from "../GroupChatProfile/GroupChatProfile";

//Imports for Messages
import io from "socket.io-client";
import axios from "axios";
import { useCookies } from "react-cookie";
import Spinner from "../Spinner/Spinner";
import ScrollableChat from "../ScrollableChat/ScrollableChat";

//Imports for SendMessage
import Lottie from "react-lottie";
import typingAnimation from "../../animations/typing.json";

const ENDPOINT = "https://talksapp.onrender.com";
var socket;

function Conversation() {
  const { id } = useParams();
  const [isAccessingChat, selectedChat, setSelectedChat, error] =
    useAccessChat(id);
  const { user } = useContext(ChatContext);

  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

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
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          socketConnected={socketConnected}
        />
      )}
      {error && (
        <ErrorPopup message={"Please select a user to start conversation"} />
      )}
    </>
  );
}

function SelectedChat({
  selectedChat,
  user,
  setSelectedChat,
  isTyping,
  setIsTyping,
  socketConnected,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState(null);

  const getSender = (users) => {
    return user._id === users[0]._id ? users[1] : users[0];
  };

  return (
    <div className={styles.conv}>
      {/* conversation header */}
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
              loggedUser={false}
            />
          ))}
      </div>
      <div className={styles.chat}>
        <Messages
          selectedChat={selectedChat}
          setMessages={setMessages}
          messages={messages}
        />
        <SendMessage
          selectedChat={selectedChat}
          setMessages={setMessages}
          messages={messages}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          socketConnected={socketConnected}
        />
      </div>
    </div>
  );
}

function Messages({ selectedChat, setMessages, messages }) {
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [, setError] = useState(null);

  // const { notification, setNotification, setRefresh, refresh } =
  //   useContext(ChatContext);

  const [cookies] = useCookies(["jwt"]);

  async function fetchAllMessages() {
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

      setMessages(response.data.data);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  useEffect(() => {
    fetchAllMessages();
    // selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // if (
      //   !selectedChatCompare ||
      //   selectedChatCompare._id !== newMessageReceived.chat._id
      // ) {
      //   console.log(notification);
      //   if (!notification.includes(newMessageReceived)) {
      //     setNotification([newMessageReceived, ...notification]);
      //     setRefresh(!refresh);
      //     console.log(notification + "---------------");
      //   }
      // } else {
      setMessages([...(messages || []), newMessageReceived]);
      // }
    });
  });

  return (
    <div className={styles.msgBox}>
      {isLoadingMessages ? <Spinner /> : <ScrollableChat messages={messages} />}
    </div>
  );
}

function SendMessage({
  selectedChat,
  setMessages,
  messages,
  socketConnected,
  isTyping,
  setIsTyping,
}) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendingError, setSendingError] = useState(null);
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["jwt"]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRation: "xMidYMid slice",
    },
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit("stop typing", selectedChat._id);
        setIsTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!message.trim()) {
      setSendingError("Can't send empty messages");
      return;
    }

    try {
      socket.emit("stop typing", selectedChat._id);
      setIsSendingMessage(true);
      setSendingError(null);

      const token = cookies.jwt;
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:3030/api/v1/messages/`,
        { content: message.trim(), chatId: selectedChat._id },
        config
      );

      if (data?.status !== "success")
        throw new Error("Problem while sending message");

      if (socket) {
        socket.emit("new message", data.data);
      } else {
        console.error("Socket is not initialized");
      }

      setMessages([...messages, data.data]);

      setMessage("");
      // console.log(messages); //React state updates are asynchronous!!
    } catch (error) {
      setSendingError(error.message || "An error occurred");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // useEffect(() => {
  //   console.log("Updated messages:", messages);
  // }, [messages]);

  return (
    <>
      <form className={styles.inputWrapper}>
        {" "}
        {isTyping ? (
          <div>
            <Lottie
              width={70}
              style={{
                marginBottom: 0,
                marginLeft: 0,
                left: 0,
                display: "block",
                position: "absolute",
                bottom: "100%",
              }}
              options={defaultOptions}
            />
          </div>
        ) : (
          <></>
        )}
        <input
          type="text"
          placeholder="Enter a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={handleSendMessage}
          disabled={isSendingMessage}
        />
      </form>
      {sendingError && <ErrorPopup message={sendingError} />}
    </>
  );
}

export default Conversation;
