import styles from "./Navbar.module.css";

import find from "../../assets/find.png";
import Notif from "../../assets/Notif.png";

import Sidedrawer from "../Sidedrawer/Sidedrawer";
import { useSearchUser } from "../../hooks/useSearchUser";
import { useContext, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { X } from "lucide-react";

function Navbar() {
  const { user } = useContext(ChatContext);
  const [drawer, setDrawer] = useState(false);
  const [searchData, setSearchData] = useState("");
  const { isLoading, error, userData } = useSearchUser(searchData);

  const [showProfile, setShowProfile] = useState(false);

  const handleDrawerOpen = () => {
    setDrawer(true);
  };
  const handleDrawerClose = () => {
    setDrawer(false);
  };

  const handleSearchUser = (e) => {
    setSearchData(e.target.value);
  };

  return (
    <nav>
      <div className={styles.nav}>
        <div className={styles.navLeft}>
          <img src={find} alt="" />
          <input
            type="text"
            placeholder="Search User"
            onClick={handleDrawerOpen}
            onChange={handleSearchUser}
          />
        </div>
        <div className={styles.navMid}>Talks-App</div>
        <div className={styles.navRight}>
          <img src={Notif} alt="" />
          <img
            src={user.pic}
            id={styles.userImg}
            alt="User_image"
            onClick={() => setShowProfile(true)}
          />
        </div>
      </div>
      {showProfile && <Profile user={user} setShowProfile={setShowProfile} />}
      <Sidedrawer
        onDrawerClose={handleDrawerClose}
        drawer={drawer}
        error={error}
        isLoading={isLoading}
        userData={userData}
        setDrawer={setDrawer}
      />
    </nav>
  );
}

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

export default Navbar;
