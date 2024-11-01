import { useContext, useState } from "react";
import styles from "./CreateGroup.module.css";
import { useSearchUser } from "../../hooks/useSearchUser";
import { X } from "lucide-react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../Error/Error";
import axios from "axios";
import { ChatContext } from "../../Context/ChatContext";
import Spinner from "../Spinner/Spinner";

function CreateGroup({ setIsVisible }) {
  const [chatName, setChatName] = useState("");
  const [search, setSearch] = useState("");
  const { isLoading, error, userData } = useSearchUser(search);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useContext(ChatContext);

  const [cookies] = useCookies(["jwt"]);

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

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState(null);

  async function handleCreateGroup() {
    try {
      setIsCreatingGroup(true);
      setCreateGroupError(null);

      if (selectedUsers.length <= 1) {
        throw new Error("Please select atleast 2 users to create a group");
      }

      const token = cookies.jwt;

      if (!token) throw new Error("Unauthorized");

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "/api/v1/chats/groupChat",
        {
          name: chatName,
          users: JSON.stringify([...selectedUsers, user]),
        },
        config
      );

      if (!response) {
        throw new Error("Error while creating group chat");
      }

      if (response.status === 201) {
        setIsVisible(false);
      }
    } catch (error) {
      setCreateGroupError(error.message);
    } finally {
      setIsCreatingGroup(false);
    }
  }

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
            {isCreatingGroup ? <Spinner /> : "Create Chat"}
          </button>
        </div>
      </div>
      {createGroupError && <ErrorPopup message={createGroupError} />}
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

export default CreateGroup;
