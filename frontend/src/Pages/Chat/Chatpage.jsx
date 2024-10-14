import styles from "./Chatpage.module.css";

import Navbar from "../../Components/Navbar/Navbar";
import Mychats from "../../Components/Mychats/Mychats";
import Conversation from "../../Components/Conversation/Conversation";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { useNavigate } from "react-router-dom";

function Chatpage() {
  const { user } = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Mychats />
        <Conversation />
      </div>
    </div>
  );
}

export default Chatpage;
