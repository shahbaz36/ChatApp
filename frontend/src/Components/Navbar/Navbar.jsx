import styles from "./Navbar.module.css";

import find from "../../assets/find.png";
import Notif from "../../assets/Notif.png";
import user from "../../assets/user.png";

function Navbar() {
  return (
    <div className={styles.nav}>
      <div className={styles.navLeft}>
        <img src={find} alt="" />
        <input type="text" placeholder="Search User" />
      </div>
      <div className={styles.navMid}>Talks-App</div>
      <div className={styles.navRight}>
        <img src={Notif} alt="" />
        <img src={user} alt="" />
      </div>
    </div>
  );
}

export default Navbar;
