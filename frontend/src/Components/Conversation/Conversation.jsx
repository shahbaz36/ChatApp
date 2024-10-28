import styles from "./Conversation.module.css";

import { useAccessChat } from "../../hooks/useChat";
import { useParams } from "react-router-dom";
import ErrorPopup from "../Error/Error";

function Conversation() {
  const { id } = useParams();
  const [isAccessingChat, onClickChatData, error] = useAccessChat(id);

  return isAccessingChat === true ? (
    <div className={styles.conv}>Click on a User to start Conversation</div>
  ) : (
    <>
      {onClickChatData && (
        <div className={styles.conv}>{onClickChatData._id}</div>
      )}
      {error && (
        <ErrorPopup message={"Please select a user to start conversation"} />
      )}
    </>
  );
}

export default Conversation;
