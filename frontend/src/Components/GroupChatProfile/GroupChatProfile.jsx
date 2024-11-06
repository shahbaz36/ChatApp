import { X } from "lucide-react";
import styles from "./GroupChatProfile.module.css";
import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import ErrorPopup from "../Error/Error";
import { useSearchUser } from "../../hooks/useSearchUser";

import LeaveModal from "../LeaveModal/LeaveModal";

//TODO : Remove users from group
function GroupChatProfile({ groupChat, setShowProfile, setSelectedChat }) {
  const [chatName, setChatName] = useState(null);
  const [isRenameLoading, setIsRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState(null);
  const [searchData, setSearchData] = useState("");
  const { userData } = useSearchUser(searchData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAlreadyExist, setUserAlreadyExist] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  function handleLeaveButtonClick() {
    setShowModal(true);
    // setShowProfile(false);
  }

  const [cookies] = useCookies("jwt");

  const handleSearchUser = (e) => {
    setSearchData(e.target.value);
    console.log(userData);
  };

  const handleSelectedUser = (user) => {
    let isUserAlreadyAdded = false;

    groupChat.users.forEach((addedMember) => {
      if (addedMember.email === user.email) {
        isUserAlreadyAdded = true;
      }
    });
    if (!isUserAlreadyAdded) {
      setSelectedUser(user);

      setUserAlreadyExist(null);
    } else {
      setUserAlreadyExist(
        "User already in the group, can't add same user twice"
      );
    }
  };

  function handleChatName(e) {
    setChatName(e.target.value);
  }

  async function changeChatName() {
    try {
      setIsRenameLoading(true);
      setRenameError(null);

      const token = cookies.jwt;

      if (!token) {
        throw new Error("Unauthorized");
      }

      if (chatName?.length <= 3 || chatName?.length === undefined) {
        throw new Error("A group name must be longer than 3 characters");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:3030/api/v1/chats/rename",
        {
          chatId: groupChat._id,
          chatName,
        },
        config
      );

      if (response?.status !== 200) {
        throw new Error("Problem while renaming group chat");
      }

      setSelectedChat(response.data.updatedChat);
      setShowProfile(false);
    } catch (error) {
      setRenameError(error.message);
    } finally {
      setIsRenameLoading(false);
    }
  }

  async function handleAddNewMember() {
    try {
      setIsAddingMember(true);
      setAddMemberError(null);

      const token = cookies.jwt;

      if (!token) {
        throw new Error("Unauthorized");
      }

      if (!selectedUser) {
        throw new Error("Please select a user to add to the group");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:3030/api/v1/chats/groupAdd",
        {
          chatId: groupChat._id,
          newMember: selectedUser._id,
        },
        config
      );

      if (response?.status !== 200) {
        throw new Error("Problem while adding member to group chat");
      }

      setSelectedChat(response.data.data);
      setShowProfile(false);
    } catch (error) {
      setAddMemberError(error.message);
    } finally {
      setIsAddingMember(false);
      setSelectedUser(null);
    }
  }

  return (
    <>
      <div className={styles.protectOverlay}></div>
      <div className={styles.profile}>
        <div className={styles.profileHead}>
          <h2>{groupChat.chatName}</h2>
          <button>
            <X size={18} onClick={() => setShowProfile(false)} />
          </button>
        </div>
        {groupChat && (
          <div className={styles.profileContainer}>
            <div className={styles.users}>
              {groupChat.users.map((user) => (
                <span key={user._id} className={styles.user}>
                  <p>{user.name}</p>
                  <X size={15} />
                </span>
              ))}
            </div>
            <div className={styles.body}>
              <p>Edit group </p>
              <div className={styles.chatName}>
                <input
                  type="text"
                  placeholder="Chat Name"
                  className={styles.inpt}
                  onChange={handleChatName}
                />
                <button className={styles.btn} onClick={changeChatName}>
                  {isRenameLoading ? <Spinner /> : "Update"}
                </button>
              </div>
              <div className={styles.addUsers}>
                <input
                  type="text"
                  placeholder="Add user to group"
                  className={styles.inpt}
                  onChange={handleSearchUser}
                />
                <button className={styles.btn} onClick={handleAddNewMember}>
                  {isAddingMember ? <Spinner /> : "Add"}
                </button>
              </div>
              <div className={styles.addUserList}>
                {" "}
                {userData.map((user) => {
                  return (
                    <div
                      className={`${styles.addUser} ${
                        selectedUser?.email === user.email ? styles.active : ""
                      }`}
                      key={user._id}
                      onClick={() => handleSelectedUser(user)}
                    >
                      <img src={user.pic} alt="" />
                      <div className={styles.userDetails}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  );
                })}{" "}
              </div>
            </div>
          </div>
        )}
        <button className={styles.leaveBtn} onClick={handleLeaveButtonClick}>
          Leave Group{" "}
        </button>{" "}
        {showModal && (
          <LeaveModal
            setShowModal={setShowModal}
            message="Are you sure you want to leave the group ?"
            chatId={groupChat._id}
            setSelectedChat={setSelectedChat}
          />
        )}
      </div>

      {renameError && <ErrorPopup message={renameError} />}
      {userAlreadyExist && <ErrorPopup message={userAlreadyExist} />}
      {addMemberError && <ErrorPopup message={addMemberError} />}
    </>
  );
}

export default GroupChatProfile;
