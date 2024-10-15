import styles from "./Chatpage.module.css";

import Navbar from "../../Components/Navbar/Navbar";
import Mychats from "../../Components/Mychats/Mychats";
import Conversation from "../../Components/Conversation/Conversation";
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import Loading from "../../Components/Loading/Loading";

function Chatpage() {
  const { isLoading } = useContext(ChatContext);

  return isLoading ? (
    <Loading />
  ) : (
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
