import { useState } from "react";
import ErrorPopup from "../Error/Error";
import styles from "./Sidedrawer.module.css";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

function Sidedrawer({ onDrawerClose, drawer, error, isLoading, userData }) {
  const [activeUserId, setActiveUserId] = useState(null);

  const handleActiveUser = (id) => {
    setActiveUserId(id);
  };

  return (
    <div className={`${styles.sideDrawer} ${drawer ? styles.open : ""}`}>
      {isLoading ? (
        "Please wait. Searching for users"
      ) : (
        <>
          {userData && (
            <div className={styles.userContainer}>
              {userData.map((user) => (
                <FoundUser
                  key={user._id}
                  user={user}
                  isActive={activeUserId === user._id}
                  onClick={() => handleActiveUser(user._id)}
                />
              ))}
            </div>
          )}
          <button onClick={onDrawerClose}>
            <X size={20} />
          </button>
          {error && <ErrorPopup message={error} />}{" "}
        </>
      )}
    </div>
  );
}

function FoundUser({ user, isActive, onClick }) {
  return (
    <Link
      className={`${styles.user} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      to={`/chats/${user._id}`}
    >
      <img src={user.pic} alt="" />
      <div className={styles.userDetails}>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </Link>
  );
}

export default Sidedrawer;
