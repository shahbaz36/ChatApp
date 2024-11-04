import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const useSearchUser = (searchData) => {
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [error, setError] = useState();
  const [userData, setUserData] = useState([]);

  const [cookies] = useCookies(["jwt"]);
  useEffect(
    function () {
      if (searchData === "") return;
      async function fetchSearchUserData() {
        try {
          setIsSearchingUser(true);

          setUserData([]);
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
        } catch (error) {
          if (error.message === "No users found!") setError(error.message);
          setUserData([]);
        } finally {
          setIsSearchingUser(false);
          setError("");
        }
      }
      fetchSearchUserData();
    },
    [searchData, cookies.jwt]
  );

  return { isSearchingUser, error, userData, setError };
};
