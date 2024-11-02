import { X } from "lucide-react";
import styles from "./GroupChatProfile.module.css";

function GroupChatProfile({ groupChat, setShowProfile }) {
  console.log(groupChat);
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
                <span key={user.id} className={styles.user}>
                  <p>{user.name}</p>
                  <X size={15} />
                </span>
              ))}
            </div>
            <div className={styles.body}>
              <div className={styles.chatName}>
                <input
                  type="text"
                  placeholder="Chat Name"
                  className={styles.inpt}
                />
                <button className={styles.btn}>Update</button>
              </div>

              <input
                type="text"
                placeholder="Add user to group"
                className={styles.inpt}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GroupChatProfile;
