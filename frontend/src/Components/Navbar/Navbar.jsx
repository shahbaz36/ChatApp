import styles from "./Navbar.module.css";

import find from "../../assets/find.png";
import Notif from "../../assets/Notif.png";
import user from "../../assets/user.png";

import Sidedrawer from "../Sidedrawer/Sidedrawer";
import { useSearchUser } from "../../hooks/useSearchUser";
import { useState } from "react";

function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isLoading, error, userData] = useSearchUser(searchData);

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
          <img src={user} alt="" />
        </div>
      </div>
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

export default Navbar;
