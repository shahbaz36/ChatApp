import styles from "./Chatpage.module.css";

import Navbar from "../../Components/Navbar/Navbar";
import Mychats from "../../Components/Mychats/Mychats";
import Conversation from "../../Components/Conversation/Conversation";

function Chatpage() {
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
