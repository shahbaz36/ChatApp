import { useState } from "react";
import styles from "./Login.module.css";
import ErrorPopup from "../Error/Error";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Please provide email and password");
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/users/signin",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      console.log(error);

      if (error.response) {
        // Server error with response
        setError(
          `Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else {
        // Other errors (network, client-side, etc.)
        setError("Error: " + error.message);
      }
    }
  };

  return (
    <div>
      <form className={styles.login} onSubmit={handleSubmit}>
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.submit}>
          Login
        </button>
      </form>
      {error && <ErrorPopup message={error} />}
    </div>
  );
}
