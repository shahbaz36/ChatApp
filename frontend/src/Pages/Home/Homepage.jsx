import { useContext, useState } from "react";
import styles from "./Homepage.module.css";
import { SignUp } from "../../Components/Signup/Signup";
import { Login } from "../../Components/Login/Login";
import { Button } from "../../Components/Button/Button";
import { ChatContext } from "../../Context/ChatContext";

import ErrorPopup from "../../Components/Error/Error";
import { Navigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";

function Homepage() {
  const [activeButton, setActiveButton] = useState("login");
  const { error, isAuth, isLoading } = useContext(ChatContext);

  if (isAuth) return <Navigate to="/chats" replace />;

  return isLoading ? (
    <Loading />
  ) : (
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
      {error === "Unauthorized" && (
        <ErrorPopup message={"Please login to use the App"} />
      )}
    </div>
  );
}

export default Homepage;
