import { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.css";
import { SignUp } from "../../Components/Signup/Signup";
import { Login } from "../../Components/Login/Login";
import { Button } from "../../Components/Button/Button";
import { ChatContext } from "../../Context/ChatContext";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const { user } = useContext(ChatContext);
  const [activeButton, setActiveButton] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/chats");
  });
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h3>Talks-App</h3>
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
