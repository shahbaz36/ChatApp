import { X } from "lucide-react";
import { useCookies } from "react-cookie";
import styles from "./Profile.module.css";

function Profile({ user, setShowProfile, loggedUser }) {
  const [, , removeCookie] = useCookies(["jwt"]);

  const handleLogout = () => {
    removeCookie("jwt");
    window.location.reload();
  };

  return (
    <>
      <div className={styles.protectOverlay}></div>
      <div className={styles.profile}>
        <div className={styles.profileHead}>
          <h2>{user.name}</h2>
          <button>
            <X size={18} onClick={() => setShowProfile(false)} />
          </button>
        </div>
        {user && (
          <div className={styles.profileContainer}>
            <img src={user.pic} alt="" />
            <h2>Email : {user.email}</h2>
            {loggedUser ? (
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
