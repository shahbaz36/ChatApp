import ErrorPopup from "../Error/Error";
import styles from "./Sidedrawer.module.css";

function Sidedrawer({ onDrawerClose, drawer, error, isLoading, userData }) {
  return (
    <div className={`${styles.sideDrawer} ${drawer ? styles.open : ""}`}>
      {isLoading ? (
        "Please wait. Searching for users"
      ) : (
        <>
          {userData && (
            <div className={styles.userContainer}>
              {userData.map((user, index) => (
                <FoundUser user={user} key={index} />
              ))}
            </div>
          )}
          <button onClick={onDrawerClose}>Close</button>
          {error && <ErrorPopup message={error} />}{" "}
        </>
      )}
    </div>
  );
}

function FoundUser({ user }) {
  return (
    <div className={styles.user}>
      <img src={user.pic} alt="" />
      <div className={styles.userDetails}>
        <p>UserName</p>
        <p>Email</p>
      </div>
    </div>
  );
}

export default Sidedrawer;
