import styles from "./Navbar.module.css";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

import find from "../../assets/find.png";
import Notif from "../../assets/Notif.png";
import user from "../../assets/user.png";

import Sidedrawer from "../Sidedrawer/Sidedrawer";

function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [userData, setUserData] = useState();

  const [cookies] = useCookies(["jwt"]);

  const handleDrawerOpen = () => {
    setDrawer(true);
  };
  const handleDrawerClose = () => {
    setDrawer(false);
  };

  const handleSearchUser = (e) => {
    setSearchData(e.target.value);
  };

  useEffect(
    function () {
      async function fetchUserData() {
        try {
          setIsLoading(true);

          const token = cookies.jwt;

          if (!token) throw new Error("Unauthorized");

          const config = {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${token}`,
            },
            params: { search: searchData },
          };

          const response = await axios.get("/api/v1/users", config);

          if (response.data.data.foundUsers.length === 0) {
            throw new Error(`No users found!`);
          }

          setUserData(response.data.data.foundUsers);
          console.log(userData);
        } catch (error) {
          if (error.message === "No users found!") setError(error.message);
          console.log(error);
        } finally {
          setIsLoading(false);
          setError("");
        }
      }
      fetchUserData();
    },
    [searchData, cookies.jwt]
  );

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
      />
    </nav>
  );
}

export default Navbar;
