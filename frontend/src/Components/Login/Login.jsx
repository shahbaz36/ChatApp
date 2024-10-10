import styles from "./Login.module.css";

export function Login() {
  return (
    <div className={styles.login}>
      <p>Email*</p>
      <input type="text"></input>
      <p>Password*</p>
      <input type="text"></input>
      <button className={styles.submit}>Login</button>
    </div>
  );
}
