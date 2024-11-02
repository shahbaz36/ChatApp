import { X } from "lucide-react";
import styles from "./Profile.module.css";

function Profile({ user, setShowProfile }) {
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
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
