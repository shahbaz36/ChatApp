import { useContext, useEffect, useRef } from "react";
import styles from "./ScrollableChat.module.css";
import { ChatContext } from "../../Context/ChatContext";

function ScrollableChat({ messages }) {
  const { user } = useContext(ChatContext);
  const scrollRef = useRef(null);

  function getSender(sender) {
    return user._id === sender._id ? true : false;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
  {messages.length === 0 ? (
        <p className={styles.noMessages}>No messages to display</p>
      ) : (
        messages.map((msg, index) => {
          const showInitials =
            index === 0 || messages[index - 1].sender._id !== msg.sender._id;

          return (
            <p
              className={`${
                getSender(msg.sender) ? styles.msgRight : styles.msgLeft
              } ${styles.msgCommon}`}
              key={`${msg._id}-${index}`}
            >
              {msg.chat.isGroupChat && showInitials ? (
                <>
                  <strong>
                    {msg.sender.name.charAt(0).toUpperCase() +
                      msg.sender.name.slice(1)}
                    :
                  </strong>{" "}
                  {msg.content}
                </>
              ) : (
                msg.content
              )}
            </p>
          );
        })
      )}
    </div>
  );
}

export default ScrollableChat;
