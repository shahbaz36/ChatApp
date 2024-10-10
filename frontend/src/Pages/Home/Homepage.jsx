import { useState } from "react";
import styles from "./Homepage.module.css";
import { SignUp } from "../../Components/Signup/Signup";
import { Login } from "../../Components/Login/Login";
import { Button } from "../../Components/Button/Button";

function Homepage() {
  const [activeButton, setActiveButton] = useState("login");
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h3>Hey-There</h3>
        </div>
        <div className={styles.form}>
          <Button
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          {activeButton === "login" ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
