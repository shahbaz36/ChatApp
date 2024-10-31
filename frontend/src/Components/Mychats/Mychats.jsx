import { useContext, useState } from "react";
import styles from "./Mychats.module.css";
import { Plus, X } from "lucide-react";
import { ChatContext } from "../../Context/ChatContext";
import { NavLink, useParams } from "react-router-dom";
import { useSearchUser } from "../../hooks/useSearchUser";

function Mychats() {
  const { chats, isLoading } = useContext(ChatContext);
  const { id } = useParams();

  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.myChats}>
      <div className={styles.myNav}>
        <h2>My Chats</h2>
        <button onClick={() => setIsVisible(true)}>
          <p>New Group Chat</p> <Plus className={styles.plus} size={18} />
        </button>
      </div>
      <div className={styles.chatContainer}>
        {isLoading
          ? "Please wait while loading your chats"
          : chats.map((chat) => (
              <SingleChat
                chat={chat}
                isActive={id === chat.users[1]._id}
                key={chat._id}
              />
            ))}
      </div>
      {isVisible && <CreateGroup setIsVisible={setIsVisible} />}
    </div>
  );
}

function SingleChat({ chat, isActive }) {
  return (
    <NavLink
      className={`${styles.chat}  ${isActive ? styles.active : ""}`}
      to={`/chats/${chat.users[1]._id}`}
      key={chat._id}
    >
      {chat.latestMessage ? (
        <>
          <img src={chat.users[1].pic} alt="" />
          <h3>{chat.users[1].name} </h3>
          <p className={styles.author}>{chat.latestMessage}</p> <p>Message</p>
        </>
      ) : (
        <>
          <img src={chat.users[1].pic} alt="" />
          <div>
            <h3>{chat.users[1].name} </h3>
            <p className={styles.author}>Author :</p> <p>Message</p>
          </div>
        </>
      )}
    </NavLink>
  );
}

function CreateGroup({ setIsVisible }) {
  const [search, setSearch] = useState("");
  const [chatName, setChatName] = useState("");
  const [isLoading, error, userData] = useSearchUser(search);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearchUser = (e) => {
    setSearch(e.target.value);
    console.log(userData);
  };

  const handleChatName = (e) => {
    setChatName(e.target.value);
  };

  const handleAddToSelected = (user) => {
    let isUserAlreadyAdded = false;
    selectedUsers.forEach((addedMember) => {
      if (addedMember.email === user.email) {
        isUserAlreadyAdded = true;
      }
    });
    if (!isUserAlreadyAdded) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  function handleCreateGroup() {}

  return (
    <>
      <div className={styles.protectOverlay}></div>
      <div className={styles.group}>
        <div className={styles.groupHead}>
          <h2>Create Group Chat</h2>
          <button>
            <X
              size={18}
              onClick={() => {
                setIsVisible(false);
                setSelectedUsers([]);
              }}
            />
          </button>
        </div>
        <div className={styles.body}>
          <input
            type="text"
            placeholder="Chat Name"
            onChange={handleChatName}
          />
          <input
            type="text"
            placeholder="Add users"
            onChange={handleSearchUser}
          />
          {selectedUsers.length > 0 && (
            <SelectedUsers
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          )}
          {userData && (
            <div className={styles.userContainer}>
              {userData.map((user) => (
                <FoundUser
                  key={user._id}
                  user={user}
                  handleAddToSelected={handleAddToSelected}
                />
              ))}
            </div>
          )}
          <button className={styles.createBtn} onClick={handleCreateGroup}>
            Create Chat
          </button>
        </div>
      </div>
    </>
  );
}

function FoundUser({ user, isActive, handleAddToSelected }) {
  return (
    <div
      className={`${styles.user} ${isActive ? styles.active : ""}`}
      onClick={() => handleAddToSelected(user)}
    >
      <img src={user.pic} alt="" />
      <div className={styles.userDetails}>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

function SelectedUsers({
  selectedUsers,
  setSelectedUsers = { setSelectedUsers },
}) {
  function handleRemoveUser(user) {
    const newSelectedUsers = selectedUsers.filter(
      (member) => member.email !== user.email
    );

    setSelectedUsers(newSelectedUsers);
  }

  return (
    <div className={styles.selectedUsers}>
      {selectedUsers.map((user) => (
        <div key={user.email} className={styles.selectedUser}>
          <button onClick={() => handleRemoveUser(user)}>
            <p>{user.name}</p>
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
export default Mychats;
