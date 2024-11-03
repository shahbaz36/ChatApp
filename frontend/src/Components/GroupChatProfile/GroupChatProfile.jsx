import { X } from "lucide-react";
import styles from "./GroupChatProfile.module.css";
import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import ErrorPopup from "../Error/Error";

function GroupChatProfile({ groupChat, setShowProfile, setSelectedChat }) {
  const [chatName, setChatName] = useState(null);
  const [isRenameLoading, setIsRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState(null);

  const [cookies] = useCookies("jwt");

  function handleChatName(e) {
    setChatName(e.target.value);
  }
  async function changeChatName() {
    try {
      setIsRenameLoading(true);
      setRenameError(null);

      const token = cookies.jwt;

      if (!token) {
        throw new Error("Unauthorized");
      }

      if (chatName.length <= 3) {
        throw new Error("A group name must be longer than 3 characters");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:3030/api/v1/chats/rename",
        {
          chatId: groupChat._id,
          chatName,
        },
        config
      );

      if (response?.status !== 200) {
        throw new Error("Problem while renaming group chat");
      }

      setSelectedChat(response.data.updatedChat);
      setShowProfile(false);
    } catch (error) {
      setRenameError(error.message);
    } finally {
      setIsRenameLoading(false);
    }
  }

  return (
    <>
      <div className={styles.protectOverlay}></div>
      <div className={styles.profile}>
        <div className={styles.profileHead}>
          <h2>{groupChat.chatName}</h2>
          <button>
            <X size={18} onClick={() => setShowProfile(false)} />
          </button>
        </div>
        {groupChat && (
          <div className={styles.profileContainer}>
            <div className={styles.users}>
              {groupChat.users.map((user) => (
                <span key={user._id} className={styles.user}>
                  <p>{user.name}</p>
                  <X size={15} />
                </span>
              ))}
            </div>
            <div className={styles.body}>
              <p>Edit group </p>
              <div className={styles.chatName}>
                <input
                  type="text"
                  placeholder="Chat Name"
                  className={styles.inpt}
                  onChange={handleChatName}
                />
                <button className={styles.btn} onClick={changeChatName}>
                  {isRenameLoading ? <Spinner /> : "Update"}
                </button>
              </div>

              <input
                type="text"
                placeholder="Add user to group"
                className={styles.inpt}
              />
            </div>
          </div>
        )}
        <button className={styles.leaveBtn}>Leave Group </button>
      </div>
      {renameError && <ErrorPopup message={renameError} />}
    </>
  );
}

export default GroupChatProfile;
