import { useContext, useState } from "react";
import styles from "./LeaveModal.module.css";
import axios from "axios";

import { ChatContext } from "../../Context/ChatContext";
import { useCookies } from "react-cookie";
import Spinner from "../Spinner/Spinner";

function LeaveModal({ setShowModal, message, chatId, setSelectedChat }) {
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [leavingGroupError, setLeavingGroupError] = useState(null);
  const { user } = useContext(ChatContext);
  console.log("confirm modal");

  const [cookies] = useCookies(["jwt"]);
  const confirmLeaveGroup = async () => {
    try {
      setIsLeavingGroup(true);
      setLeavingGroupError(null);

      const token = cookies.jwt;

      if (!token) {
        throw new Error("Unauthorized");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:3030/api/v1/chats/groupRemove",
        {
          chatId,
          memberId: user._id,
        },
        config
      );

      if (response?.status !== 200) {
        throw new Error("Problem while leaving group chat");
      }

      setSelectedChat(null);
    } catch (error) {
      setLeavingGroupError(error.message);
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const cancelLeaveGroup = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className={styles.protectOverlay}></div>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.choice}>
          <button
            className={`${styles.yesBtn} ${styles.btn}`}
            onClick={confirmLeaveGroup}
          >
            {isLeavingGroup ? <Spinner /> : "Yes"}
          </button>
          <button
            className={`${styles.noBtn} ${styles.btn}`}
            onClick={cancelLeaveGroup}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
}

export default LeaveModal;
