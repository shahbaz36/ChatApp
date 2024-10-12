import { useState } from "react";
import styles from "./Login.module.css";
import Error from "../Error/Error";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("Checking error");
    // Add your login logic here
    console.log("Login submitted", { email, password });
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
      {error && <Error message={error} />}
    </div>
  );
}
